
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Officer profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  badge_number TEXT,
  rank TEXT,
  station TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Police stations
CREATE TABLE public.police_stations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  officers INTEGER NOT NULL DEFAULT 0,
  contact TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.police_stations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view stations" ON public.police_stations FOR SELECT TO authenticated USING (true);

-- Call records
CREATE TABLE public.call_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  caller_name TEXT,
  duration TEXT,
  transcript TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  location_address TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'analyzed', 'flagged')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.call_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view calls" ON public.call_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert calls" ON public.call_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update calls" ON public.call_records FOR UPDATE TO authenticated USING (true);
CREATE TRIGGER update_call_records_updated_at BEFORE UPDATE ON public.call_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SMS records
CREATE TABLE public.sms_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  sender_name TEXT,
  message TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  location_address TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'analyzed', 'flagged')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sms_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view sms" ON public.sms_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert sms" ON public.sms_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update sms" ON public.sms_records FOR UPDATE TO authenticated USING (true);
CREATE TRIGGER update_sms_records_updated_at BEFORE UPDATE ON public.sms_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Crime alerts
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_code TEXT NOT NULL UNIQUE,
  crime_type TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('critical', 'high', 'medium', 'low')),
  summary TEXT NOT NULL,
  ai_analysis TEXT,
  source TEXT NOT NULL CHECK (source IN ('call', 'sms')),
  source_id UUID,
  phone_number TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  location_address TEXT NOT NULL,
  assigned_station_id UUID REFERENCES public.police_stations(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
  assigned_officer_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view alerts" ON public.alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert alerts" ON public.alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update alerts" ON public.alerts FOR UPDATE TO authenticated USING (true);
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON public.alerts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;

-- Seed police stations
INSERT INTO public.police_stations (name, address, lat, lng, officers, contact) VALUES
  ('Connaught Place PS', 'Connaught Place, New Delhi', 28.6315, 77.2167, 45, '011-23741000'),
  ('Paharganj PS', 'Paharganj, New Delhi', 28.6448, 77.2132, 32, '011-23581000'),
  ('Karol Bagh PS', 'Karol Bagh, New Delhi', 28.6519, 77.1905, 38, '011-25720000'),
  ('Sarojini Nagar PS', 'Sarojini Nagar, New Delhi', 28.5744, 77.2000, 28, '011-26100000'),
  ('Hauz Khas PS', 'Hauz Khas, New Delhi', 28.5494, 77.2001, 35, '011-26962000');

-- Seed sample call records
INSERT INTO public.call_records (phone_number, caller_name, duration, transcript, lat, lng, location_address, status) VALUES
  ('+91-9876543210', 'Unknown Caller', '4:23', 'Let us meet tonight at the warehouse to sell the stuff. Bring the cash.', 28.6448, 77.2132, 'Paharganj, New Delhi', 'flagged'),
  ('+91-8765432109', 'Informant R12', '2:15', 'They are planning to kidnap the businessman near Green Park metro station tomorrow morning.', 28.5594, 77.2090, 'Green Park, New Delhi', 'flagged'),
  ('+91-7654321098', 'Regular Caller', '1:45', 'Just checking in about the delivery schedule for tomorrow.', 28.6315, 77.2167, 'Connaught Place, New Delhi', 'analyzed');

-- Seed sample SMS records
INSERT INTO public.sms_records (phone_number, sender_name, message, lat, lng, location_address, status) VALUES
  ('+91-9988776655', 'Unknown', 'Pay 50 lakh or face consequences. We know where your family lives.', 28.6519, 77.1905, 'Karol Bagh, New Delhi', 'flagged'),
  ('+91-8877665544', 'Unknown', 'Transfer the money to the account by tonight. Don''t involve police.', 28.5744, 77.2000, 'Sarojini Nagar, New Delhi', 'flagged'),
  ('+91-7766554433', 'Known Contact', 'Meeting confirmed for tomorrow at 3pm at the office.', 28.6315, 77.2167, 'Connaught Place, New Delhi', 'analyzed');

-- Seed sample alerts
INSERT INTO public.alerts (alert_code, crime_type, risk_level, summary, ai_analysis, source, phone_number, lat, lng, location_address, status, assigned_station_id) VALUES
  ('ALT-001', 'Drug Trafficking', 'critical', 'Suspected drug deal planned at warehouse in Paharganj area tonight', 'AI Analysis: High confidence drug trafficking activity detected. Keywords: "sell the stuff", "bring the cash", "warehouse". Pattern matches known drug operation terminology. Recommend immediate surveillance deployment.', 'call', '+91-9876543210', 28.6448, 77.2132, 'Paharganj, New Delhi', 'active', (SELECT id FROM public.police_stations WHERE name = 'Paharganj PS')),
  ('ALT-002', 'Extortion', 'high', 'Extortion threat targeting local businessman in Karol Bagh', 'AI Analysis: Extortion with explicit threats to family. Demand: 50 lakh. Threat level: HIGH. Recommend immediate victim protection and trace on sender number.', 'sms', '+91-9988776655', 28.6519, 77.1905, 'Karol Bagh, New Delhi', 'active', (SELECT id FROM public.police_stations WHERE name = 'Karol Bagh PS')),
  ('ALT-003', 'Kidnapping', 'high', 'Planned kidnapping near Green Park metro station', 'AI Analysis: Premeditated kidnapping plot targeting businessman. Location: Green Park metro. Timeline: Tomorrow morning. Source reliability: Informant R12 (verified). Recommend plainclothes deployment.', 'call', '+91-8765432109', 28.5594, 77.2090, 'Green Park, New Delhi', 'active', (SELECT id FROM public.police_stations WHERE name = 'Hauz Khas PS')),
  ('ALT-004', 'Financial Fraud', 'medium', 'Suspicious money transfer demand via SMS', 'AI Analysis: Financial fraud pattern detected. Coercive language used. Warning against police involvement suggests awareness of criminal liability. Recommend financial trail investigation.', 'sms', '+91-8877665544', 28.5744, 77.2000, 'Sarojini Nagar, New Delhi', 'acknowledged', (SELECT id FROM public.police_stations WHERE name = 'Sarojini Nagar PS')),
  ('ALT-005', 'Suspicious Activity', 'low', 'Routine delivery mentioned in intercepted call - flagged for review', 'AI Analysis: Low confidence criminal activity. Conversation appears routine but flagged due to pattern matching with known logistics routes used for contraband. Recommend passive monitoring.', 'call', '+91-7654321098', 28.6315, 77.2167, 'Connaught Place, New Delhi', 'resolved', (SELECT id FROM public.police_stations WHERE name = 'Connaught Place PS'));
