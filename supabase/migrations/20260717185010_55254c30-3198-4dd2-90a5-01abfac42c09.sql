CREATE TABLE public.sources (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type text,
  url text,
  valid_as_of date,
  next_check_due date,
  last_checked date,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sources TO authenticated;
GRANT ALL ON public.sources TO service_role;
GRANT SELECT ON public.sources TO anon;

ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view sources"
  ON public.sources
  FOR SELECT
  TO anon, authenticated
  USING (true);