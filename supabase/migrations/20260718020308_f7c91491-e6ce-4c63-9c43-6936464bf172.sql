
CREATE TABLE public.programs_staging (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  institution_id uuid,
  credential text,
  cip_code text,
  field_area text,
  open_to_international boolean,
  campus_city text,
  min_grade text,
  prerequisites text,
  english_admission_tests jsonb,
  duration_months integer,
  tuition_intl_year numeric,
  has_coop boolean,
  pgwp_eligible boolean,
  pgwp_basis text,
  pgwp_english_clb text,
  application_url text,
  intl_office_url text,
  book_meeting_url text,
  source_id uuid,
  occupation_ids uuid[],
  review_status text NOT NULL DEFAULT 'draft' CHECK (review_status IN ('draft','needs_review','approved','rejected')),
  confidence text CHECK (confidence IS NULL OR confidence IN ('high','medium','low')),
  field_confidence jsonb,
  raw_source_url text,
  extracted_at timestamptz,
  review_notes text,
  promoted_program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Admin-only: no grants to anon or authenticated. service_role bypasses RLS by default.
GRANT ALL ON public.programs_staging TO service_role;

ALTER TABLE public.programs_staging ENABLE ROW LEVEL SECURITY;

-- No policies for anon/authenticated => RLS denies all client access. service_role bypasses RLS.

CREATE TRIGGER update_programs_staging_updated_at
BEFORE UPDATE ON public.programs_staging
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
