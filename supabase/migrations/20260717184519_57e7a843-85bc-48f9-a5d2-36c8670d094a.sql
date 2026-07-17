DROP TABLE IF EXISTS public.programs CASCADE;

CREATE TABLE public.programs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_id uuid NOT NULL REFERENCES public.institutions(id),
  name text NOT NULL,
  credential text,
  cip_code text,
  field_area text,
  open_to_international boolean NOT NULL DEFAULT false,
  campus_city text,
  min_grade text,
  prerequisites text,
  english_admission_tests jsonb,
  duration_months integer,
  tuition_intl_year text,
  has_coop boolean NOT NULL DEFAULT false,
  pgwp_eligible text,
  pgwp_basis text,
  pgwp_english_clb integer,
  application_url text,
  intl_office_url text,
  book_meeting_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.programs TO authenticated;
GRANT ALL ON public.programs TO service_role;
GRANT SELECT ON public.programs TO anon;

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view programs"
  ON public.programs
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON public.programs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();