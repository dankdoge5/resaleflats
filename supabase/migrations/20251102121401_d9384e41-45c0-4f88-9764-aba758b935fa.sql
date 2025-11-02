-- Allow public read access to active properties
CREATE POLICY "Anyone can view active properties"
ON public.properties
FOR SELECT
USING (is_active = true);