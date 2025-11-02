import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();
    
    if (!token) {
      console.error('No CAPTCHA token provided');
      return new Response(
        JSON.stringify({ success: false, error: 'Token required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || req.headers.get('x-real-ip') 
      || 'unknown';

    console.log(`CAPTCHA verification request from IP: ${clientIP}`);

    // Initialize Supabase client with service role for rate limiting
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check rate limit: 20 requests per IP per minute
    const { data: rateLimitResult, error: rateLimitError } = await supabase.rpc('check_rate_limit', {
      _identifier: clientIP,
      _action_type: 'captcha_verify',
      _max_attempts: 20,
      _window_ms: 60000, // 1 minute
      _block_duration_ms: 300000 // 5 minutes block
    });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
      // Fail closed - deny if rate limit check fails
      return new Response(
        JSON.stringify({ success: false, error: 'Rate limit check failed' }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const rateLimit = rateLimitResult as { allowed: boolean; remaining_attempts: number; reset_time?: number };
    
    if (!rateLimit.allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Too many requests',
          resetTime: rateLimit.reset_time
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify origin (optional but recommended)
    const origin = req.headers.get('origin');
    const allowedOrigins = [
      Deno.env.get('ALLOWED_ORIGIN'),
      'http://localhost:5173',
      'http://localhost:8080'
    ].filter(Boolean);

    if (origin && !allowedOrigins.includes(origin)) {
      console.warn(`Suspicious origin: ${origin} from IP: ${clientIP}`);
      // Continue anyway, but log for monitoring
    }

    const turnstileSecret = Deno.env.get('TURNSTILE_SECRET_KEY');
    if (!turnstileSecret) {
      console.error('TURNSTILE_SECRET_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify the CAPTCHA token with Cloudflare Turnstile
    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: turnstileSecret,
        response: token,
        remoteip: clientIP,
      }),
    });

    const verifyData = await verifyResponse.json();
    
    console.log('CAPTCHA verification result:', { 
      success: verifyData.success,
      ip: clientIP,
      challenge_ts: verifyData.challenge_ts
    });

    // Log suspicious patterns
    if (!verifyData.success) {
      console.warn(`Failed CAPTCHA verification from IP: ${clientIP}`, {
        errors: verifyData['error-codes']
      });
    }

    return new Response(
      JSON.stringify({ 
        success: verifyData.success,
        remainingAttempts: rateLimit.remaining_attempts
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in verify-captcha function:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Verification failed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});