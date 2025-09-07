import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// reCAPTCHA v3 site key (public key - safe to expose)
const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Test key

export const useCaptcha = () => {
  const verifyCaptcha = useCallback(async (action: string): Promise<boolean> => {
    try {
      // Load reCAPTCHA script if not already loaded
      if (!window.grecaptcha) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
          script.async = true;
          script.defer = true;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Execute reCAPTCHA
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });

      // Verify token with our edge function
      const { data, error } = await supabase.functions.invoke('verify-captcha', {
        body: { token }
      });

      if (error) {
        console.error('CAPTCHA verification error:', error);
        return false;
      }

      return data?.success || false;
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