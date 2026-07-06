
-- update_updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- cip_codes
CREATE TABLE public.cip_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cip_codes TO anon, authenticated;
GRANT ALL ON public.cip_codes TO service_role;
ALTER TABLE public.cip_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view cip_codes" ON public.cip_codes FOR SELECT USING (true);
CREATE TRIGGER update_cip_codes_updated_at BEFORE UPDATE ON public.cip_codes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_cip_codes_category ON public.cip_codes(category);

-- programs
CREATE TABLE public.programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  institution TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT,
  level TEXT NOT NULL CHECK (level IN ('certificate','diploma','bachelor','master','phd')),
  field_of_study TEXT,
  duration_months INTEGER,
  tuition_cad NUMERIC(10,2),
  language TEXT,
  intake_dates TEXT[],
  requirements TEXT,
  url TEXT,
  is_pgwp_eligible BOOLEAN NOT NULL DEFAULT false,
  cip_code TEXT REFERENCES public.cip_codes(code) ON UPDATE CASCADE ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.programs TO anon, authenticated;
GRANT ALL ON public.programs TO service_role;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view programs" ON public.programs FOR SELECT USING (true);
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON public.programs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_programs_country ON public.programs(country);
CREATE INDEX idx_programs_level ON public.programs(level);
CREATE INDEX idx_programs_cip_code ON public.programs(cip_code);
