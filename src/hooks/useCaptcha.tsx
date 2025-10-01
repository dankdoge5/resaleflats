import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// reCAPTCHA v3 site key (public key - safe to expose)
const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Test key

export const useCaptcha = () => {
  const verifyCaptcha = useCallback(async (action: string): Promise<boolean> => {
    try {
      // Check if grecaptcha is loaded
      if (!window.grecaptcha || !window.grecaptcha.execute) {
        console.warn('reCAPTCHA not loaded, proceeding without verification');
        return true; // Fallback for development
      }

      // Execute reCAPTCHA v3
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });

      // Verify token with edge function
      const { data, error } = await supabase.functions.invoke('verify-captcha', {
        body: { token },
      });

      if (error) {
        console.error('CAPTCHA verification error:', error);
        return false;
      }

      // Check score threshold (reCAPTCHA v3 returns a score between 0.0 and 1.0)
      if (data?.success && data?.score >= 0.5) {
        return true;
      }

      console.warn('CAPTCHA verification failed:', data);
      return false;
    } catch (error) {
      console.error('CAPTCHA error:', error);
      return false;
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