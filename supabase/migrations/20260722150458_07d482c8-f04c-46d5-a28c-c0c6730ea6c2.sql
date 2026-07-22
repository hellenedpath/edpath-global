
-- 1) Merge de duplicatas por (noc_code, province)
-- Único grupo duplicado: NOC 32123 Ontario. Ambos idênticos em título/salário/outlook.
-- Mantém 1e7d8c1d... (tem 1 programa vinculado); remove 444432a7... (0 programas, sem impacto em programs.occupation_ids).
DELETE FROM public.occupations
WHERE id = '444432a7-a41e-4503-9009-03646a02dc45';

-- 2) Novas colunas numéricas de salário
ALTER TABLE public.occupations
  ADD COLUMN wage_low numeric,
  ADD COLUMN wage_median numeric,
  ADD COLUMN wage_high numeric,
  ADD COLUMN wage_unit text,
  ADD COLUMN wage_region text,
  ADD COLUMN wage_updated_at timestamptz;

-- 3) Migração dos salários existentes (formato "$XX.XX/hour" -> numérico)
UPDATE public.occupations
SET wage_low  = NULLIF(regexp_replace(COALESCE(salary_low,   ''), '[^0-9.]', '', 'g'), '')::numeric,
    wage_median = NULLIF(regexp_replace(COALESCE(salary_median,''), '[^0-9.]', '', 'g'), '')::numeric,
    wage_high = NULLIF(regexp_replace(COALESCE(salary_high,  ''), '[^0-9.]', '', 'g'), '')::numeric,
    wage_unit = 'hourly',
    wage_region = province,
    wage_updated_at = now()
WHERE (salary_low    IS NOT NULL AND salary_low    <> '')
   OR (salary_median IS NOT NULL AND salary_median <> '')
   OR (salary_high   IS NOT NULL AND salary_high   <> '');

-- 4) Constraint de dedup
ALTER TABLE public.occupations
  ADD CONSTRAINT occupations_noc_province_unique UNIQUE (noc_code, province);
