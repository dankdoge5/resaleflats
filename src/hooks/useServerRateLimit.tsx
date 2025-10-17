import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ServerRateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
}

interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  resetTime?: number;
}

/**
 * Server-side rate limiting hook using Supabase database
 * This provides actual protection against abuse, unlike client-side rate limiting
 */
export const useServerRateLimit = () => {
  const checkRateLimit = useCallback(
    async (
      identifier: string, // user_id, email, or IP
      actionType: string, // 'login', 'signup', 'contact_request'
      config: ServerRateLimitConfig
    ): Promise<RateLimitResult> => {
      try {
        const { data, error } = await supabase.rpc('check_rate_limit', {
          _identifier: identifier,
          _action_type: actionType,
          _max_attempts: config.maxAttempts,
          _window_ms: config.windowMs,
          _block_duration_ms: config.blockDurationMs || config.windowMs,
        });

        if (error) {
          console.error('Rate limit check error:', error);
          // Fail open for better UX, but log the error
          return {
            allowed: true,
            remainingAttempts: config.maxAttempts,
          };
        }

        const result = data as { allowed: boolean; remaining_attempts: number; reset_time?: number };
        return {
          allowed: result.allowed,
          remainingAttempts: result.remaining_attempts,
          resetTime: result.reset_time,
        };
      } catch (error) {
        console.error('Rate limit check exception:', error);
        // Fail open for better UX
        return {
          allowed: true,
          remainingAttempts: config.maxAttempts,
        };
      }
    },
    []
  );

  return { checkRateLimit };
};