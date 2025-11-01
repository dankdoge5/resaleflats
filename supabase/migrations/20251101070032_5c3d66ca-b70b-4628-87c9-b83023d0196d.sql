-- Remove non-apartment property types to ensure all listings are apartments
DELETE FROM public.properties 
WHERE property_type IN ('duplex', 'studio', 'penthouse');