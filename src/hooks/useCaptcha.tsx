import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Cloudflare Turnstile site key (public key - safe to expose)
// TODO: Replace with production key from https://dash.cloudflare.com/?to=/:account/turnstile
// This is a test key that always passes - for production, get your key from Cloudflare
const TURNSTILE_SITE_KEY = '1x00000000000000000000AA'; // Test key - visible CAPTCHA

export const useCaptcha = () => {
  const verifyCaptcha = useCallback(async (action: string): Promise<boolean> => {
    try {
      // Check if turnstile is loaded
      if (!window.turnstile) {
        console.error('Cloudflare Turnstile not loaded - verification failed');
        return false;
      }

      return new Promise((resolve) => {
        // Render Turnstile widget (invisible mode)
        const widgetId = window.turnstile.render('#turnstile-widget', {
          sitekey: TURNSTILE_SITE_KEY,
          action: action,
          callback: async (token: string) => {
            // Verify token with edge function
            const { data, error } = await supabase.functions.invoke('verify-captcha', {
              body: { token },
            });

            if (error) {
              console.error('CAPTCHA verification error:', error);
              resolve(false);
              return;
            }

            if (data?.success) {
              resolve(true);
            } else {
              console.warn('CAPTCHA verification failed:', data);
              resolve(false);
            }

            // Clean up widget
            if (widgetId) {
              window.turnstile.remove(widgetId);
            }
          },
          'error-callback': () => {
            console.error('Turnstile error callback triggered');
            resolve(false);
          },
        });
      });
    } catch (error) {
      console.error('CAPTCHA error:', error);
      return false;
    }
  }, []);

  return { verifyCaptcha };
};

// Add types for Cloudflare Turnstile
declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: {
        sitekey: string;
        action?: string;
        callback?: (token: string) => void;
        'error-callback'?: () => void;
        theme?: 'light' | 'dark' | 'auto';
        size?: 'normal' | 'compact';
      }) => string | undefined;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}