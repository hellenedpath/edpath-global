
# Diagnóstico — só leitura, nenhuma alteração

## 1. Extrator já existente

Sim. Uma edge function: **`supabase/functions/extract-programs/index.ts`** (387 linhas).

- **O que extrai hoje:** dados estruturados de páginas de programas de colleges canadenses (nome, credencial, campus, duração, co-op, tuition internacional, requisitos de inglês, pré-requisitos, statement PGWP da página, application_url, CIP).
- **Fontes:** páginas HTML de sites institucionais (piloto Conestoga; suporta qualquer college via `institution_id`).
- **Grava em:** `programs_staging` (nunca direto em `programs`).
- **IA:** Anthropic (`ANTHROPIC_API_KEY`), dois prompts — extração de campos + seleção de CIP.
- **Fluxo de fontes:** faz upsert em `sources` e vincula `source_id` na linha de staging.
- **Suporta:** `dry_run`, delete escopado por `institution_id`.

Existe também `edpath-assistant` (chat), sem função de extração.

## 2. Capacidade de fetch externo

**Sim.** A função usa `fetch(url, { headers: { "User-Agent": "Mozilla/5.0 EdPathBot/1.0" } })` para baixar HTML de URLs arbitrárias (linha 64). Não há restrição de domínio — dá para apontar para Job Bank sem mudanças de infra.

## 3. Occupations sem salário

**Correção do número:** são **100** sem salário (não 69), de **104** totais. Apenas **4** têm salário preenchido (não 35).

Lista completa dos 100 salvos em `/tmp/sem_salario.txt`. Primeiros 65 exibidos acima; os 35 restantes (truncados no output) posso listar na próxima resposta se quiser — ou dumpar para CSV em `/mnt/documents/`.

Distribuição de província entre os 100:
- `Ontario` — maioria absoluta
- `Ontario (Ottawa region)` — ~10
- `Canada` — 2 casos (`21223`, `32104`)

Observação: há duplicatas de `noc_code` com títulos ligeiramente diferentes (ex.: `22310` aparece 2x, `32123` aparece 2x). Isso vai afetar a lógica de upsert do extrator de salários — precisa decidir se a chave natural é `(noc_code, province)` ou `(noc_code, province, title)`.

## 4. Formato dos 4 salários existentes

Padrão uniforme: **string `$XX.XX/hour`** (hora, não anual), com 2 casas decimais e sufixo `/hour`.

| noc_code | province | low | median | high |
|---|---|---|---|---|
| 32111 | Ontario (Ottawa region) | `$35.00/hour` | `$45.00/hour` | `$51.00/hour` |
| 22220 | Ontario | `$21.00/hour` | `$36.00/hour` | `$55.00/hour` |
| 72300 | Ontario (Ottawa region) | `$25.00/hour` | `$34.38/hour` | `$46.60/hour` |
| 63200 | Ontario (Ottawa region) | `$17.20/hour` | `$19.00/hour` | `$23.00/hour` |

(Só 4 registros existem — não há um 5º para amostrar.)

Colunas são `text`, não numéricas. `outlook` e `source_id` também existem por linha.

## 5. Padrões da tabela `sources`

Colunas: `id, type, url, valid_as_of (date), next_check_due (date), last_checked (date), notes (text), created_at`.

Padrões observados em produção:

- **`type`** — enum informal em uso: `institution_site`, `job_bank`, `ircc`.
- **`valid_as_of`** — data em que a página foi verificada manualmente (formato `YYYY-MM-DD`).
- **`notes`** — frase em português, descritiva, mencionando o que a página cobre e ressalvas importantes (ex.: "Anuidade inclui seguro-saude, U-Pass...", "Valores por programa ficam nas páginas individuais").
- **`url`** — URL canônica da página verificada (não a raiz do domínio).
- **`next_check_due` / `last_checked`** — nem sempre preenchidos nos registros atuais.

Já existe **1 registro `job_bank`** genérico (`https://www.jobbank.gc.ca/explore-careers`, valid_as_of 2026-07-22, nota em português explicando NOC 2021 e que salário varia por província). Para extração de salários, o padrão natural seria uma linha `sources` **por página consultada** (URL específica de ocupação, ex.: `.../marketreport/wages-occupation/{id}/{location}`), com `type='job_bank'` e nota curta em pt-BR.

## Pontos que valem decisão antes de construir

- Confirmar se salário deve continuar como string `$XX.XX/hour` (por consistência com os 4 existentes) ou migrar para numérico.
- Definir chave natural para dedup: `(noc_code, province)` vs incluir `title`.
- Decidir granularidade de `sources`: uma linha por ocupação-província, ou reutilizar a linha `job_bank` genérica.
