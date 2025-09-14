-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('property-images', 'property-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']);

-- Create RLS policies for property images bucket
CREATE POLICY "Anyone can view property images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own property images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own property images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add areas/localities table for better location data
CREATE TABLE public.areas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  area_name TEXT NOT NULL,
  pincode TEXT,
  state TEXT NOT NULL DEFAULT 'Maharashtra',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on areas table
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;

-- Create policy for areas to be viewable by everyone
CREATE POLICY "Areas are viewable by everyone" 
ON public.areas 
FOR SELECT 
USING (true);

-- Insert popular areas in major cities
INSERT INTO public.areas (city, area_name, pincode, state) VALUES
-- Mumbai areas
('Mumbai', 'Andheri West', '400058', 'Maharashtra'),
('Mumbai', 'Bandra West', '400050', 'Maharashtra'),
('Mumbai', 'Juhu', '400049', 'Maharashtra'),
('Mumbai', 'Powai', '400076', 'Maharashtra'),
('Mumbai', 'Malad West', '400064', 'Maharashtra'),
('Mumbai', 'Goregaon West', '400062', 'Maharashtra'),
('Mumbai', 'Kandivali West', '400067', 'Maharashtra'),
('Mumbai', 'Borivali West', '400092', 'Maharashtra'),
('Mumbai', 'Thane West', '400606', 'Maharashtra'),
('Mumbai', 'Navi Mumbai', '400614', 'Maharashtra'),

-- Delhi areas  
('Delhi', 'Dwarka', '110075', 'Delhi'),
('Delhi', 'Gurgaon', '122001', 'Haryana'),
('Delhi', 'Noida', '201301', 'Uttar Pradesh'),
('Delhi', 'Greater Noida', '201308', 'Uttar Pradesh'),
('Delhi', 'Faridabad', '121001', 'Haryana'),
('Delhi', 'Rohini', '110085', 'Delhi'),
('Delhi', 'Pitampura', '110034', 'Delhi'),
('Delhi', 'Janakpuri', '110058', 'Delhi'),

-- Bangalore areas
('Bangalore', 'Koramangala', '560095', 'Karnataka'),
('Bangalore', 'Indiranagar', '560038', 'Karnataka'),
('Bangalore', 'Whitefield', '560066', 'Karnataka'),
('Bangalore', 'Electronic City', '560100', 'Karnataka'),
('Bangalore', 'HSR Layout', '560102', 'Karnataka'),
('Bangalore', 'Marathahalli', '560037', 'Karnataka'),
('Bangalore', 'BTM Layout', '560068', 'Karnataka'),
('Bangalore', 'JP Nagar', '560078', 'Karnataka'),

-- Pune areas
('Pune', 'Hinjewadi', '411057', 'Maharashtra'),
('Pune', 'Baner', '411045', 'Maharashtra'),
('Pune', 'Wakad', '411057', 'Maharashtra'),
('Pune', 'Kharadi', '411014', 'Maharashtra'),
('Pune', 'Magarpatta', '411028', 'Maharashtra'),
('Pune', 'Viman Nagar', '411014', 'Maharashtra'),
('Pune', 'Aundh', '411007', 'Maharashtra');

-- Add some sample realistic properties
INSERT INTO public.properties (
  title, price, location, bedrooms, bathrooms, area_sqft, property_type, 
  furnished_status, description, owner_id, image_urls
) VALUES 
-- Get the first user ID for seeding
(
  'Spacious 2BHK in Andheri West with Modern Amenities',
  8500000,
  'Andheri West, Mumbai',
  2,
  2, 
  950,
  'apartment',
  'semi-furnished',
  'Beautiful 2BHK apartment in prime Andheri West location. Close to metro station, shopping malls, and IT parks. Building amenities include gym, swimming pool, and 24/7 security. Perfect for working professionals.',
  (SELECT id FROM auth.users LIMIT 1),
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1560449752-d9c7c4e7cc5e?w=800']
),
(
  'Luxury 3BHK Penthouse in Bandra West Sea Facing',
  25000000,
  'Bandra West, Mumbai', 
  3,
  3,
  1400,
  'apartment',
  'fully-furnished',
  'Stunning sea-facing penthouse with panoramic views of the Arabian Sea. Premium building with world-class amenities including concierge, valet parking, and rooftop garden. Prime Bandra location near Linking Road.',
  (SELECT id FROM auth.users LIMIT 1),
  ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800']
),
(
  'Modern 1BHK Studio in Powai IT Hub',
  4200000,
  'Powai, Mumbai',
  1,
  1,
  580,
  'apartment', 
  'furnished',
  'Compact yet spacious 1BHK perfect for young professionals. Located in the heart of Powai IT corridor, walking distance from major tech companies. Building has modern amenities and excellent connectivity.',
  (SELECT id FROM auth.users LIMIT 1),
  ARRAY['https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800']
),
(
  'Spacious 4BHK Villa in Koramangala Bangalore',
  15000000,
  'Koramangala, Bangalore',
  4,
  3,
  2200,
  'villa',
  'semi-furnished',
  'Independent villa with private garden and parking for 2 cars. Prime Koramangala location with easy access to restaurants, cafes, and shopping centers. Perfect for families looking for space and privacy.',
  (SELECT id FROM auth.users LIMIT 1),
  ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800']
),
(
  'Premium 2BHK in Gurgaon with Golf Course View',
  12000000,
  'Gurgaon, Delhi',
  2,
  2,
  1100,
  'apartment',
  'fully-furnished',
  'Luxury apartment with golf course views in premium Gurgaon society. State-of-the-art amenities including clubhouse, spa, and sports facilities. Excellent connectivity to Cyber City and Delhi.',
  (SELECT id FROM auth.users LIMIT 1),
  ARRAY['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800', 'https://images.unsplash.com/photo-1560448076-0ab8b2cb9233?w=800']
),
(
  'Cozy 1BHK in HSR Layout near Tech Parks',
  3800000,
  'HSR Layout, Bangalore',
  1,
  1,
  650,
  'apartment',
  'furnished',
  'Well-maintained 1BHK apartment in popular HSR Layout. Close to major IT companies, restaurants, and shopping areas. Building has good amenities and 24/7 security. Great investment opportunity.',
  (SELECT id FROM auth.users LIMIT 1),
  ARRAY['https://images.unsplash.com/photo-1560448075-bb485b067938?w=800']
),
(
  'Elegant 3BHK in Hinjewadi IT City Pune',
  9500000,
  'Hinjewadi, Pune',
  3,
  2,
  1250,
  'apartment',
  'semi-furnished',
  'Modern 3BHK apartment in Pune IT capital. Premium society with swimming pool, gym, children play area, and landscaped gardens. Excellent connectivity to major IT companies and highways.',
  (SELECT id FROM auth.users LIMIT 1),
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1560449752-d9c7c4e7cc5e?w=800']
),
(
  'Affordable 2BHK in Thane with Railway Connectivity', 
  6800000,
  'Thane West, Mumbai',
  2,
  2,
  850,
  'apartment',
  'unfurnished',
  'Value for money 2BHK apartment in well-connected Thane location. Close to railway station and major highways. Building has basic amenities and is perfect for first-time home buyers.',
  (SELECT id FROM auth.users LIMIT 1),
  ARRAY['https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800']
);