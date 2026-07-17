CREATE TABLE public.occupations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    noc_code text,
    title text,
    province text,
    salary_low text,
    salary_median text,
    salary_high text,
    outlook text,
    source_id uuid REFERENCES public.sources(id) ON DELETE SET NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.occupations TO anon;
GRANT SELECT ON public.occupations TO authenticated;
GRANT ALL ON public.occupations TO service_role;

ALTER TABLE public.occupations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view occupations"
    ON public.occupations
    FOR SELECT
    TO anon, authenticated
    USING (true);