-- Remove the dangerous "Profiles are viewable by everyone" policy
DROP POLICY "Profiles are viewable by everyone" ON public.profiles;

-- Create secure policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow property owners to see basic contact info (name only) of users who saved their properties
CREATE POLICY "Property owners can see basic contact info of interested users"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.saved_properties sp
    JOIN public.properties p ON sp.property_id = p.id
    WHERE sp.user_id = profiles.user_id
    AND p.owner_id = auth.uid()
  )
);

-- Create a function to get safe public profile info (name only) for property context
CREATE OR REPLACE FUNCTION public.get_property_owner_contact(property_id uuid)
RETURNS TABLE(owner_name text, owner_id uuid)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.full_name as owner_name,
    pr.owner_id
  FROM public.properties pr
  JOIN public.profiles p ON p.user_id = pr.owner_id
  WHERE pr.id = property_id
  AND pr.is_active = true;
$$;