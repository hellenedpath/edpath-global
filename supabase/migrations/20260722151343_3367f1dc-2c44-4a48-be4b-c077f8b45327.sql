
-- 1. New wages table
CREATE TABLE public.wages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  noc_code text NOT NULL,
  geo_level text NOT NULL CHECK (geo_level IN ('national','provincial','region')),
  prov_code text,
  er_code text,
  region_name_en text,
  region_name_fr text,
  wage_low numeric,
  wage_median numeric,
  wage_high numeric,
  wage_average numeric,
  wage_q1 numeric,
  wage_q3 numeric,
  wage_unit text NOT NULL CHECK (wage_unit IN ('hourly','annual')),
  reference_period text,
  data_source_en text,
  wage_comment_en text,
  revision_date date,
  imported_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX wages_noc_prov_er_uniq
  ON public.wages (noc_code, COALESCE(prov_code,''), COALESCE(er_code,''));

CREATE INDEX wages_noc_idx ON public.wages (noc_code);
CREATE INDEX wages_noc_prov_idx ON public.wages (noc_code, prov_code);

GRANT SELECT ON public.wages TO anon, authenticated;
GRANT ALL ON public.wages TO service_role;

ALTER TABLE public.wages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view wages"
  ON public.wages FOR SELECT
  TO anon, authenticated
  USING (true);

-- 2. Drop redundant wage columns from occupations
ALTER TABLE public.occupations
  DROP COLUMN IF EXISTS wage_low,
  DROP COLUMN IF EXISTS wage_median,
  DROP COLUMN IF EXISTS wage_high,
  DROP COLUMN IF EXISTS wage_unit,
  DROP COLUMN IF EXISTS wage_region,
  DROP COLUMN IF EXISTS wage_updated_at;
