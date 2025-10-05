-- Remove the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON public.properties;

-- Create a policy that allows users to view their own properties (with owner_id)
CREATE POLICY "Users can view their own properties with all details"
ON public.properties
FOR SELECT
USING (auth.uid() = owner_id);

-- Create a secure public view that excludes sensitive owner information
CREATE OR REPLACE VIEW public.public_properties AS
SELECT 
  id,
  title,
  description,
  location,
  price,
  bedrooms,
  bathrooms,
  area_sqft,
  property_type,
  furnished_status,
  image_urls,
  is_active,
  created_at,
  updated_at
FROM public.properties
WHERE is_active = true;

-- Grant SELECT permission on the view to everyone
GRANT SELECT ON public.public_properties TO anon, authenticated;

-- Add comment for documentation
COMMENT ON VIEW public.public_properties IS 'Public view of properties that excludes owner_id to protect owner privacy and prevent competitor scraping';