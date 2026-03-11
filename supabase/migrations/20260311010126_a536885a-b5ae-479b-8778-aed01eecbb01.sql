
-- Fix Thane 1BHK: ₹35L is too low, bump to ₹62L with realistic area
UPDATE public.properties SET price = 6200000, area_sqft = 580 WHERE title = 'Affordable 1BHK in Thane';

-- Fix Powai Penthouse: ₹3.5Cr exceeds range, bring to ₹2.95Cr, reduce area
UPDATE public.properties SET price = 29500000, area_sqft = 2100, bedrooms = 4, bathrooms = 3 WHERE title = 'Luxury 4BHK Penthouse in Powai';

-- Fix Navi Mumbai 1BHK: ₹28L is too low, bump to ₹68L with realistic area
UPDATE public.properties SET price = 6800000, area_sqft = 540, property_age = '5-10 years' WHERE title = 'Budget 1BHK in Navi Mumbai';

-- Worli 3BHK at ₹2.8Cr is fine but area 1800sqft is a bit large for 2.8Cr in Worli resale, adjust to 1450sqft
UPDATE public.properties SET area_sqft = 1450 WHERE title = 'Modern 3BHK in Worli';

-- Bandra 2BHK at ₹1.2Cr with 950sqft is realistic ✓
-- Andheri 3BHK at ₹85L with 1200sqft is realistic ✓
-- Malad 2BHK at ₹65L with 800sqft is realistic ✓
-- Lonavala Villa at ₹1.5Cr with 2200sqft is realistic ✓
