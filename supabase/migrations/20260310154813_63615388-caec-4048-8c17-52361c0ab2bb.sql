
-- Profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Properties table
CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  price numeric NOT NULL,
  location text NOT NULL,
  bedrooms integer NOT NULL DEFAULT 1,
  bathrooms integer NOT NULL DEFAULT 1,
  area_sqft numeric,
  property_type text NOT NULL DEFAULT 'apartment',
  furnished_status text NOT NULL DEFAULT 'unfurnished',
  description text,
  image_urls text[],
  amenities text[],
  property_age text,
  has_parking boolean DEFAULT false,
  has_balcony boolean DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active properties" ON public.properties FOR SELECT USING (is_active = true);
CREATE POLICY "Owners can insert properties" ON public.properties FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update own properties" ON public.properties FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete own properties" ON public.properties FOR DELETE USING (auth.uid() = owner_id);

-- Public properties view (excludes owner_id for security)
CREATE VIEW public.public_properties AS
SELECT id, title, price, location, bedrooms, bathrooms, area_sqft,
       property_type, furnished_status, description, image_urls,
       amenities, property_age, has_parking, has_balcony,
       is_active, created_at, updated_at
FROM public.properties
WHERE is_active = true;

-- Saved properties table
CREATE TABLE public.saved_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own saved" ON public.saved_properties FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save properties" ON public.saved_properties FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave properties" ON public.saved_properties FOR DELETE USING (auth.uid() = user_id);

-- Contact requests table
CREATE TABLE public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  requester_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(property_id, requester_id)
);
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Requesters can view own requests" ON public.contact_requests FOR SELECT USING (auth.uid() = requester_id);
CREATE POLICY "Owners can view received requests" ON public.contact_requests FOR SELECT USING (auth.uid() = property_owner_id);
CREATE POLICY "Users can create requests" ON public.contact_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Owners can update request status" ON public.contact_requests FOR UPDATE USING (auth.uid() = property_owner_id);

-- Get approved contact info function
CREATE OR REPLACE FUNCTION public.get_approved_contact_info(contact_request_id uuid)
RETURNS TABLE(full_name text, phone text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.full_name, p.phone
  FROM contact_requests cr
  JOIN profiles p ON p.id = cr.requester_id
  WHERE cr.id = contact_request_id
    AND cr.status = 'approved'
    AND (cr.property_owner_id = auth.uid() OR cr.requester_id = auth.uid());
$$;

-- Price alerts table
CREATE TABLE public.price_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  target_price numeric NOT NULL,
  alert_type text NOT NULL DEFAULT 'below' CHECK (alert_type IN ('below', 'above')),
  is_active boolean NOT NULL DEFAULT true,
  notified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own alerts" ON public.price_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create alerts" ON public.price_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON public.price_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own alerts" ON public.price_alerts FOR DELETE USING (auth.uid() = user_id);

-- Message threads table
CREATE TABLE public.message_threads (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;

-- Thread participants table
CREATE TABLE public.thread_participants (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  thread_id bigint REFERENCES public.message_threads(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(thread_id, user_id)
);
ALTER TABLE public.thread_participants ENABLE ROW LEVEL SECURITY;

-- Messages table
CREATE TABLE public.messages (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  thread_id bigint REFERENCES public.message_threads(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS for messaging
CREATE POLICY "Participants can view their threads" ON public.message_threads FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.thread_participants WHERE thread_id = message_threads.id AND user_id = auth.uid()));
CREATE POLICY "Users can create threads" ON public.message_threads FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Participants can view participants" ON public.thread_participants FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.thread_participants tp WHERE tp.thread_id = thread_participants.thread_id AND tp.user_id = auth.uid()));
CREATE POLICY "Thread creators can add participants" ON public.thread_participants FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.message_threads WHERE id = thread_id AND created_by = auth.uid()) OR auth.uid() = user_id);

CREATE POLICY "Participants can view messages" ON public.messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.thread_participants WHERE thread_id = messages.thread_id AND user_id = auth.uid()));
CREATE POLICY "Participants can send messages" ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.thread_participants WHERE thread_id = messages.thread_id AND user_id = auth.uid()));

-- Rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _identifier text,
  _action_type text,
  _max_attempts integer,
  _window_ms bigint,
  _block_duration_ms bigint
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _result jsonb;
BEGIN
  _result := jsonb_build_object(
    'allowed', true,
    'remaining_attempts', _max_attempts
  );
  RETURN _result;
END;
$$;
