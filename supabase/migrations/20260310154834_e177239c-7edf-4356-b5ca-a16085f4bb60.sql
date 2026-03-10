
-- Fix security definer view by setting security_invoker
ALTER VIEW public.public_properties SET (security_invoker = on);
