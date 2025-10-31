-- Remove villa property (not apartments)
DELETE FROM properties WHERE property_type = 'villa';

-- Add more diverse apartment listings
INSERT INTO properties (owner_id, title, description, location, price, bedrooms, bathrooms, area_sqft, property_type, furnished_status, image_urls) VALUES
-- Mumbai properties
('81162bdb-9dc1-4a1a-82d6-23482b717585', 'Stunning 3BHK in Juhu with Sea View', 'Luxurious apartment with panoramic sea views, modern kitchen, and premium fittings. Close to beaches and entertainment hubs.', 'Juhu, Mumbai', 32000000, 3, 3, 1800, 'apartment', 'furnished', ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267']),

('81162bdb-9dc1-4a1a-82d6-23482b717585', 'Compact 1BHK in Dadar East', 'Affordable starter apartment perfect for young professionals. Well-connected by rail and road.', 'Dadar East, Mumbai', 5500000, 1, 1, 550, 'apartment', 'semi-furnished', ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2']),

('81162bdb-9dc1-4a1a-82d6-23482b717585', 'Spacious 4BHK Duplex in Worli', 'Ultra-luxury duplex apartment with private terrace, modular kitchen, and stunning city views. Premium society amenities.', 'Worli, Mumbai', 55000000, 4, 4, 3200, 'duplex', 'furnished', ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750']),

('81162bdb-9dc1-4a1a-82d6-23482b717585', 'Cozy 2BHK in Kandivali West', 'Family-friendly apartment in peaceful locality with parks, schools, and shopping centers nearby.', 'Kandivali West, Mumbai', 7200000, 2, 2, 950, 'apartment', 'semi-furnished', ARRAY['https://images.unsplash.com/photo-1515263487990-61b07816b324']),

('81162bdb-9dc1-4a1a-82d6-23482b717585', 'Premium Penthouse in Lower Parel', 'Exclusive penthouse with private pool, gym access, and 24/7 concierge service. Modern corporate hub location.', 'Lower Parel, Mumbai', 48000000, 3, 3, 2500, 'penthouse', 'furnished', ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9']),

-- Pune properties
('81162bdb-9dc1-4a1a-82d6-23482b717585', 'Modern 2BHK in Baner', 'Contemporary apartment with smart home features, clubhouse, and swimming pool. Near IT parks.', 'Baner, Pune', 8500000, 2, 2, 1100, 'apartment', 'furnished', ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688']),

('81162bdb-9dc1-4a1a-82d6-23482b717585', 'Elegant 3BHK in Koregaon Park', 'Sophisticated apartment in upscale neighborhood with rooftop garden and gym facilities.', 'Koregaon Park, Pune', 14500000, 3, 2, 1650, 'apartment', 'furnished', ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c']),

('81162bdb-9dc1-4a1a-82d6-23482b717585', 'Affordable 1BHK in Wakad', 'Budget-friendly apartment for first-time buyers. Good connectivity to Hinjewadi IT hub.', 'Wakad, Pune', 3900000, 1, 1, 600, 'apartment', 'unfurnished', ARRAY['https://images.unsplash.com/photo-1493809842364-78817add7ffb']),

-- Bangalore properties
('81162bdb-9dc1-4a1a-82d6-23482b717585', 'Luxurious 3BHK in Indiranagar', 'Premium apartment in prime Bangalore location with high-end finishes and 24/7 security.', 'Indiranagar, Bangalore', 18500000, 3, 3, 1900, 'apartment', 'furnished', ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c']),

('81162bdb-9dc1-4a1a-82d6-23482b717585', 'Spacious 2BHK in Whitefield', 'Tech-friendly apartment near major IT companies with excellent amenities and metro connectivity.', 'Whitefield, Bangalore', 9800000, 2, 2, 1250, 'apartment', 'semi-furnished', ARRAY['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea']),

('81162bdb-9dc1-4a1a-82d6-23482b717585', 'Studio Apartment in MG Road', 'Compact studio perfect for singles or young couples in the heart of Bangalore.', 'MG Road, Bangalore', 5200000, 1, 1, 480, 'studio', 'furnished', ARRAY['https://images.unsplash.com/photo-1600210492493-0946911123ea']),

-- Delhi NCR properties
('81162bdb-9dc1-4a1a-82d6-23482b717585', 'Premium 3BHK in Vasant Kunj', 'Upscale apartment with modular kitchen, wooden flooring, and access to premium clubhouse.', 'Vasant Kunj, Delhi', 22000000, 3, 3, 2100, 'apartment', 'furnished', ARRAY['https://images.unsplash.com/photo-1600607687644-c7171b42498f']),

('81162bdb-9dc1-4a1a-82d6-23482b717585', 'Modern 2BHK in Noida Sector 62', 'Well-maintained apartment with parking, power backup, and close to metro station.', 'Noida Sector 62, Delhi', 7800000, 2, 2, 1050, 'apartment', 'semi-furnished', ARRAY['https://images.unsplash.com/photo-1600585154526-990dced4db0d']),

-- Hyderabad properties
('81162bdb-9dc1-4a1a-82d6-23482b717585', 'Spacious 3BHK in Gachibowli', 'Modern apartment in IT corridor with contemporary design and excellent ventilation.', 'Gachibowli, Hyderabad', 11500000, 3, 2, 1550, 'apartment', 'semi-furnished', ARRAY['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde']),

('81162bdb-9dc1-4a1a-82d6-23482b717585', 'Elegant 2BHK in Banjara Hills', 'Premium location with vaastu-compliant layout, marble flooring, and gated community security.', 'Banjara Hills, Hyderabad', 16000000, 2, 2, 1400, 'apartment', 'furnished', ARRAY['https://images.unsplash.com/photo-1600585154363-67eb9e2e2099']);