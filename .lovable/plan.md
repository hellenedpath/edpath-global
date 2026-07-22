# Diagnóstico — filtro do quiz sobre `programs`

Base: **249 programas**, todos de Ontário, todos com `pgwp_eligible='yes'` (exceto 1 nulo). Só 3 instituições reais representadas (Conestoga/Algonquin/uma outra), o que explica a repetição extrema nos campos abaixo.

## 1. Requisito de inglês
- Coluna: `english_admission_tests` (JSONB). Chaves fixas: `IELTS_Academic`, `TOEFL_iBT`, `Duolingo`, `PTE_Academic`, `CAEL`, `Cambridge`.
- Preenchimento: **249/249** têm todas as chaves. Mas os **valores são texto livre** (não número comparável).
- IELTS: só **6 strings distintas**, todas variantes de "6.0" ou "6.5" com nota de banda mínima. Regex-parseable com esforço mínimo.
  - `6.5 (nenhuma banda abaixo de 6.0)` — 100
  - `6.0 (nenhuma banda abaixo de 5.5)` — 83
  - `6.0 geral (nenhuma banda abaixo de 5.5)` — 33
  - `6.5 geral (nenhuma banda abaixo de 6.0)` — 28
  - `6.0 (no band less than 5.5)` — 4
  - `6.5 (no band less than 6.0)` — 1
- TOEFL e Duolingo: idem, texto livre com o padrão Conestoga ("80 total…") ou Algonquin.
- **Filtrável?** Sim para IELTS com um parser trivial (extrair o primeiro número). TOEFL/Duolingo idem, mas exigem parser separado por teste. Não há campo numérico canônico — é o parser ou nada.

## 2. Área / categoria
- Coluna: `field_area` (texto livre).
- Preenchida em **66/249** (183 nulos = 73 % vazio).
- 9 valores distintos, sem taxonomia: `IT` (18), `trades` (15), `health` (12), `other` (10), `business` (6), `Applied Computer Science & Information Technology` (2), `Trades & Apprenticeship` (1), `Health & Life Sciences` (1), `Business - Accounting` (1).
- **Filtrável?** Não de forma confiável — 73 % nulos e mistura de rótulos curtos com rótulos longos (o extractor mudou de convenção entre lotes). Para um filtro de área, o CIP (via `cip_code` + tabela `cip_codes.area_group`/`category`) é mais consistente.

## 3. Custo (tuition internacional)
- Coluna: `tuition_intl_year` (TEXT). Preenchida em **249/249**, **0 numéricas**.
- Apenas **4 strings distintas** no banco todo:
  - `CAD $15.026 (2 semestres, 2025-26)…` — 86
  - `CAD $16.319 (2 semestres, 2025-26)…` — 67
  - `CAD $17.225 a $22.000 por ano letivo (8 meses)…` — 61 (Algonquin, faixa)
  - `CAD $16.440 (2 semestres, 2025-26)…` — 35
- Unidade: não há coluna. A string mistura "por ano letivo (8 meses)" e "2 semestres" — na prática ambos são um ano acadêmico. Uma linha traz faixa (`$17.225 a $22.000`), não valor único.
- **Filtrável?** Só com parser regex do primeiro valor CAD. Comparação "≤ $20.000" funciona nos 3 valores únicos; a faixa da Algonquin precisa de decisão (usar o piso? o teto?). Não há campo numérico.

## 4. Nível / credencial
- Preenchida em **249/249**. 5 valores distintos e limpos:
  - Ontario College Graduate Certificate — 79
  - Ontario College Diploma — 65
  - Ontario College Certificate — 39
  - Degree — 34
  - Ontario College Advanced Diploma — 32
- **Filtrável?** Sim, direto. Único campo realmente pronto.

## 5. Província e cidade
- `institutions.province`: **249/249 = Ontario**. Uma província só.
- `campus_city`: **249/249** preenchido.
- **Filtrável?** Tecnicamente sim, mas hoje não segmenta nada — todos são ON.

## 6. PGWP
- `pgwp_eligible`: 248 = `yes`, 1 = nulo. Nenhum `no`, nenhum `unknown`.
- **Filtrável?** Sim, mas o filtro é degenerado — praticamente todo o catálogo é elegível.

## 7. Teste de realidade do filtro
Consulta pedida: saúde + college + IELTS≤6.5 + tuition≤$20.000/ano + Ontário + PGWP elegível.

- Sem parser de inglês nem tuition, aplicando apenas os campos estruturados (`field_area ILIKE '%health%'` + `credential ILIKE '%diploma%'` + `pgwp='yes'` + `province='Ontario'`): **10 programas**.
- IELTS ≤ 6.5 exclui 0 (todos os valores no banco são 6.0 ou 6.5) → continua **10**.
- Tuition ≤ $20.000/ano exclui os 61 programas da Algonquin com faixa $17.225–$22.000 se o teto for usado; senão, 0 exclusões. Nos 10 candidatos de saúde, quase todos são Conestoga com $15–16k → provavelmente **~10** permanecem.
- Sem o filtro de inglês: **mesmos 10** (o filtro de inglês não muda nada neste catálogo).

**Impacto real do campo de inglês no filtro hoje: zero.** O catálogo inteiro cabe em duas notas IELTS (6.0/6.5) e qualquer piso ≥6.5 zera; qualquer piso ≤6.5 mantém tudo.

## Veredito por campo
| Campo | Serve para filtrar hoje? |
|---|---|
| credential | Sim |
| province | Sim, mas trivial (100 % ON) |
| pgwp_eligible | Sim, mas trivial (100 % yes) |
| campus_city | Sim |
| IELTS (parseado) | Tecnicamente sim, na prática não discrimina |
| tuition | Só com parser regex e uma regra para faixa; 4 valores no banco |
| field_area | **Não** — 73 % nulos e taxonomia incoerente. Use CIP. |
| TOEFL/Duolingo/PTE/CAEL/Cambridge | Só com parser dedicado por teste |

## Recomendação (para conversar antes de codar)
1. Um filtro de quiz honesto hoje entrega variação real apenas em **credential** e (via CIP) **área**. Os demais são teatro.
2. Se quisermos filtro de inglês/tuition/área que valha a pena, o próximo passo é normalizar em colunas dedicadas: `ielts_min NUMERIC`, `toefl_min NUMERIC`, `tuition_intl_year_cad_min/max NUMERIC`, `tuition_period TEXT`, e mapear `field_area` a partir de `cip_codes.area_group`. Sem isso, qualquer filtro depende de parser em runtime.
3. Enquanto só houver Ontário e PGWP=yes no catálogo, esses dois filtros devem ser omitidos da UI para não dar falsa sensação de escolha.

Este é o relatório. Sem alterações no código nem no banco.