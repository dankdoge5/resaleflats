import { useState, useCallback } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
}

interface RateLimitState {
  attempts: number;
  firstAttemptTime: number;
  blockedUntil: number | null;
}

const rateLimitState = new Map<string, RateLimitState>();

export const useRateLimit = (key: string, config: RateLimitConfig) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(config.maxAttempts);

  const checkRateLimit = useCallback((): { allowed: boolean; remainingAttempts: number; resetTime?: number } => {
    const now = Date.now();
    const state = rateLimitState.get(key);

    // Check if currently blocked
    if (state?.blockedUntil && now < state.blockedUntil) {
      setIsBlocked(true);
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: state.blockedUntil,
      };
    }

    // Initialize or reset state if window expired
    if (!state || now - state.firstAttemptTime > config.windowMs) {
      rateLimitState.set(key, {
        attempts: 1,
        firstAttemptTime: now,
        blockedUntil: null,
      });
      setIsBlocked(false);
      setRemainingAttempts(config.maxAttempts - 1);
      return { allowed: true, remainingAttempts: config.maxAttempts - 1 };
    }

    // Increment attempts
    state.attempts += 1;
    const remaining = Math.max(0, config.maxAttempts - state.attempts);
    setRemainingAttempts(remaining);

    // Check if limit exceeded
    if (state.attempts > config.maxAttempts) {
      const blockDuration = config.blockDurationMs || config.windowMs;
      state.blockedUntil = now + blockDuration;
      setIsBlocked(true);
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: state.blockedUntil,
      };
    }

    setIsBlocked(false);
    return { allowed: true, remainingAttempts: remaining };
  }, [key, config]);

  const reset = useCallback(() => {
    rateLimitState.delete(key);
    setIsBlocked(false);
    setRemainingAttempts(config.maxAttempts);
  }, [key, config.maxAttempts]);

  return { checkRateLimit, reset, isBlocked, remainingAttempts };
};
