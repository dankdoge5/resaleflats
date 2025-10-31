-- Insert all 23 featured properties from the home page
-- All properties are apartments as requested
-- Each property is unique with different characteristics

INSERT INTO public.properties (
  title, price, location, bedrooms, bathrooms, area_sqft, 
  property_type, furnished_status, description, is_active, owner_id
) VALUES
('Modern 2BHK in Bandra West', 5500000, 'Bandra West, Mumbai', 2, 2, 950, 'apartment', 'semi-furnished', 'Stunning modern 2BHK apartment in prime Bandra West location with contemporary finishes and amenities', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Spacious 3BHK in Koramangala', 7500000, 'Koramangala, Bangalore', 3, 3, 1350, 'apartment', 'furnished', 'Luxurious 3BHK with premium furnishings in the heart of Koramangala tech hub', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Cozy 1BHK in Andheri', 3800000, 'Andheri East, Mumbai', 1, 1, 650, 'apartment', 'unfurnished', 'Compact yet comfortable 1BHK perfect for singles or couples in bustling Andheri', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Comfortable 2BHK in Whitefield', 4800000, 'Whitefield, Bangalore', 2, 2, 1050, 'apartment', 'semi-furnished', 'Well-designed 2BHK apartment in Whitefield IT corridor with modern amenities', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Modern 3BHK in Indiranagar', 8200000, 'Indiranagar, Bangalore', 3, 2, 1400, 'apartment', 'furnished', 'Premium 3BHK in upscale Indiranagar with top-tier furnishings and facilities', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Affordable 1BHK in Electronic City', 3200000, 'Electronic City, Bangalore', 1, 1, 600, 'apartment', 'unfurnished', 'Budget-friendly 1BHK in Electronic City tech park vicinity, ideal for IT professionals', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Spacious 2BHK in HSR Layout', 5800000, 'HSR Layout, Bangalore', 2, 2, 1100, 'apartment', 'semi-furnished', 'Generous 2BHK apartment in family-friendly HSR Layout neighborhood', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Premium 3BHK in Jayanagar', 7800000, 'Jayanagar, Bangalore', 3, 3, 1500, 'apartment', 'furnished', 'Elegant 3BHK in prestigious Jayanagar with premium finishes and amenities', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Compact 1BHK in Marathahalli', 3500000, 'Marathahalli, Bangalore', 1, 1, 580, 'apartment', 'unfurnished', 'Efficient 1BHK layout in Marathahalli near major tech parks', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Beautiful 2BHK in Bellandur', 5200000, 'Bellandur, Bangalore', 2, 2, 1000, 'apartment', 'semi-furnished', 'Attractive 2BHK apartment in serene Bellandur area with lake views', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Elegant 3BHK in Sarjapur Road', 6800000, 'Sarjapur Road, Bangalore', 3, 2, 1350, 'apartment', 'furnished', 'Sophisticated 3BHK on rapidly developing Sarjapur Road corridor', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Cozy 1BHK in BTM Layout', 3600000, 'BTM Layout, Bangalore', 1, 1, 620, 'apartment', 'unfurnished', 'Comfortable 1BHK in vibrant BTM Layout with excellent connectivity', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Luxurious 2BHK in JP Nagar', 6200000, 'JP Nagar, Bangalore', 2, 2, 1150, 'apartment', 'furnished', 'High-end 2BHK in established JP Nagar locality with premium amenities', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Spacious 3BHK in Banashankari', 7200000, 'Banashankari, Bangalore', 3, 3, 1450, 'apartment', 'semi-furnished', 'Roomy 3BHK in family-oriented Banashankari neighborhood', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Affordable 1BHK in Yelahanka', 3000000, 'Yelahanka, Bangalore', 1, 1, 550, 'apartment', 'unfurnished', 'Budget-conscious 1BHK in emerging Yelahanka residential area', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Modern 2BHK in Hebbal', 5400000, 'Hebbal, Bangalore', 2, 2, 1080, 'apartment', 'semi-furnished', 'Contemporary 2BHK near Hebbal flyover with excellent transport links', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Premium 3BHK in Malleshwaram', 8500000, 'Malleshwaram, Bangalore', 3, 3, 1550, 'apartment', 'furnished', 'Exclusive 3BHK in heritage Malleshwaram with traditional charm and modern comforts', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Compact 1BHK in Ramamurthy Nagar', 3400000, 'Ramamurthy Nagar, Bangalore', 1, 1, 590, 'apartment', 'unfurnished', 'Smart 1BHK in developing Ramamurthy Nagar area', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Stylish 2BHK in RT Nagar', 5000000, 'RT Nagar, Bangalore', 2, 2, 1020, 'apartment', 'semi-furnished', 'Trendy 2BHK in well-connected RT Nagar locality', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Spacious 3BHK in Rajajinagar', 7600000, 'Rajajinagar, Bangalore', 3, 2, 1420, 'apartment', 'furnished', 'Generous 3BHK in central Rajajinagar with mature neighborhood amenities', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Budget 1BHK in Hoodi', 2800000, 'Hoodi, Bangalore', 1, 1, 540, 'apartment', 'unfurnished', 'Economical 1BHK in Hoodi perfect for first-time buyers', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Comfortable 2BHK in Kalyan Nagar', 5600000, 'Kalyan Nagar, Bangalore', 2, 2, 1120, 'apartment', 'semi-furnished', 'Pleasant 2BHK in upscale Kalyan Nagar with park-facing views', true, '81162bdb-9dc1-4a1a-82d6-23482b717585'),
('Elegant 3BHK in Sahakara Nagar', 7000000, 'Sahakara Nagar, Bangalore', 3, 3, 1380, 'apartment', 'furnished', 'Refined 3BHK in peaceful Sahakara Nagar residential community', true, '81162bdb-9dc1-4a1a-82d6-23482b717585');