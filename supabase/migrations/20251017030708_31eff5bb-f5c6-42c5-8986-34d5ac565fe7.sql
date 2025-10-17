-- Create rate limiting table for server-side enforcement
CREATE TABLE IF NOT EXISTS public.rate_limit_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier text NOT NULL, -- Can be user_id, email, or IP address
  action_type text NOT NULL, -- 'login', 'signup', 'contact_request', 'captcha_verify'
  attempt_count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now(),
  blocked_until timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for fast lookups
CREATE INDEX idx_rate_limit_lookup ON public.rate_limit_attempts(identifier, action_type, window_start);

-- Enable RLS
ALTER TABLE public.rate_limit_attempts ENABLE ROW LEVEL SECURITY;

-- Users can only read their own rate limit data (for UX feedback)
CREATE POLICY "Users can view their own rate limits"
ON public.rate_limit_attempts
FOR SELECT
USING (identifier = auth.uid()::text OR identifier = auth.email());

-- Service role can manage all rate limits (for edge functions)
-- Note: Edge functions use service_role by default, so no policy needed for INSERT/UPDATE/DELETE

-- Create function to check and update rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _identifier text,
  _action_type text,
  _max_attempts integer,
  _window_ms bigint,
  _block_duration_ms bigint DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _current_time timestamp with time zone := now();
  _window_start timestamp with time zone := _current_time - (_window_ms || ' milliseconds')::interval;
  _existing_record record;
  _result jsonb;
BEGIN
  -- Find existing rate limit record within the window
  SELECT * INTO _existing_record
  FROM public.rate_limit_attempts
  WHERE identifier = _identifier
    AND action_type = _action_type
    AND window_start >= _window_start
  ORDER BY window_start DESC
  LIMIT 1;

  -- Check if currently blocked
  IF _existing_record.blocked_until IS NOT NULL AND _current_time < _existing_record.blocked_until THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'remaining_attempts', 0,
      'reset_time', extract(epoch from _existing_record.blocked_until)::bigint * 1000
    );
  END IF;

  -- If no record or window expired, create new record
  IF _existing_record IS NULL OR _current_time - _existing_record.window_start > (_window_ms || ' milliseconds')::interval THEN
    INSERT INTO public.rate_limit_attempts (identifier, action_type, attempt_count, window_start)
    VALUES (_identifier, _action_type, 1, _current_time);
    
    RETURN jsonb_build_object(
      'allowed', true,
      'remaining_attempts', _max_attempts - 1
    );
  END IF;

  -- Increment attempt count
  UPDATE public.rate_limit_attempts
  SET 
    attempt_count = attempt_count + 1,
    updated_at = _current_time,
    blocked_until = CASE 
      WHEN attempt_count + 1 > _max_attempts 
      THEN _current_time + (COALESCE(_block_duration_ms, _window_ms) || ' milliseconds')::interval
      ELSE NULL
    END
  WHERE id = _existing_record.id;

  -- Check if limit exceeded
  IF _existing_record.attempt_count + 1 > _max_attempts THEN
    _result := jsonb_build_object(
      'allowed', false,
      'remaining_attempts', 0,
      'reset_time', extract(epoch from (_current_time + (COALESCE(_block_duration_ms, _window_ms) || ' milliseconds')::interval))::bigint * 1000
    );
  ELSE
    _result := jsonb_build_object(
      'allowed', true,
      'remaining_attempts', _max_attempts - (_existing_record.attempt_count + 1)
    );
  END IF;

  RETURN _result;
END;
$$;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_rate_limit_attempts_updated_at
BEFORE UPDATE ON public.rate_limit_attempts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();