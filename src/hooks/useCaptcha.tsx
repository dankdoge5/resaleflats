import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// reCAPTCHA v3 site key (public key - safe to expose)
const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Test key

export const useCaptcha = () => {
  const verifyCaptcha = useCallback(async (action: string): Promise<boolean> => {
    // For development/demo purposes, we'll skip CAPTCHA verification
    // In production, implement proper reCAPTCHA v3 integration
    try {
      console.log(`CAPTCHA verification for action: ${action} - skipped in demo mode`);
      return true; // Always return true for demo
    } catch (error) {
      console.error('CAPTCHA error:', error);
      return true; // Still return true to allow authentication
    }
  }, []);

  return { verifyCaptcha };
};

// Add types for reCAPTCHA
declare global {
  interface Window {
    grecaptcha: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}