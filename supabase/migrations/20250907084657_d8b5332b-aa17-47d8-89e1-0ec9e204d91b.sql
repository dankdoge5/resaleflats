-- Fix critical privacy vulnerability by removing direct phone access
-- Replace the overly permissive policy that exposes phone numbers
DROP POLICY IF EXISTS "Property owners can view contact info of interested users" ON public.profiles;

-- Create a contact request system instead of direct phone access
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(property_id, requester_id)
);

-- Enable RLS on contact_requests
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Property owners can view contact requests for their properties
CREATE POLICY "Property owners can view contact requests for their properties"
ON public.contact_requests
FOR SELECT
USING (auth.uid() = property_owner_id);

-- Users can create contact requests
CREATE POLICY "Users can create contact requests"
ON public.contact_requests
FOR INSERT
WITH CHECK (auth.uid() = requester_id);

-- Property owners can update contact request status
CREATE POLICY "Property owners can update contact request status"
ON public.contact_requests
FOR UPDATE
USING (auth.uid() = property_owner_id);

-- Users can view their own contact requests
CREATE POLICY "Users can view their own contact requests"
ON public.contact_requests
FOR SELECT
USING (auth.uid() = requester_id);

-- Add trigger for updated_at
CREATE TRIGGER update_contact_requests_updated_at
BEFORE UPDATE ON public.contact_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create a secure function to get contact info only when approved
CREATE OR REPLACE FUNCTION public.get_approved_contact_info(contact_request_id uuid)
RETURNS TABLE(full_name text, phone text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT p.full_name, p.phone 
  FROM public.profiles p
  JOIN public.contact_requests cr ON p.user_id = cr.requester_id
  WHERE cr.id = contact_request_id
  AND cr.status = 'approved'
  AND cr.property_owner_id = auth.uid();
$function$;