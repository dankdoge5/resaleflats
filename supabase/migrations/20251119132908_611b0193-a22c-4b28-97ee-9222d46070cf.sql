-- Add new columns to properties table for advanced filtering
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS amenities text[],
ADD COLUMN IF NOT EXISTS property_age text,
ADD COLUMN IF NOT EXISTS has_parking boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_balcony boolean DEFAULT false;

-- Drop and recreate the public_properties view to include new columns
DROP VIEW IF EXISTS public.public_properties;

CREATE VIEW public.public_properties AS
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
  amenities,
  property_age,
  has_parking,
  has_balcony,
  is_active,
  created_at,
  updated_at
FROM public.properties
WHERE is_active = true;