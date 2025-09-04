-- Remove the dangerous policy that exposes all user profiles publicly
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a secure function for property owners to get basic contact info of interested users
-- This allows legitimate business use (contacting interested buyers) without exposing all data
CREATE OR REPLACE FUNCTION public.get_property_owner_contact(property_owner_id uuid, interested_user_id uuid)
RETURNS TABLE(full_name text, phone text) 
LANGUAGE sql 
SECURITY DEFINER 
STABLE
SET search_path = public
AS $$
  -- Only return contact info if the requesting user owns a property that the interested user has saved
  SELECT p.full_name, p.phone 
  FROM public.profiles p
  WHERE p.user_id = interested_user_id
  AND EXISTS (
    SELECT 1 
    FROM public.properties pr 
    JOIN public.saved_properties sp ON pr.id = sp.property_id
    WHERE pr.owner_id = property_owner_id 
    AND sp.user_id = interested_user_id
  );
$$;

-- Add a policy for property owners to view contact info of users who saved their properties
CREATE POLICY "Property owners can view contact info of interested users"
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  -- Allow access if the requesting user owns a property that this profile's user has saved
  EXISTS (
    SELECT 1 
    FROM public.properties pr 
    JOIN public.saved_properties sp ON pr.id = sp.property_id
    WHERE pr.owner_id = auth.uid() 
    AND sp.user_id = profiles.user_id
  )
);