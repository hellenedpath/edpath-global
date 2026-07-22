## Diagnóstico — só leitura, nenhuma alteração

### 1. Onde vive NOC + salário

Dois relacionamentos:

- `public.programs.occupation_ids uuid[]` → lista de UUIDs em `public.occupations`.
- `public.occupations` (10 colunas):
  - `id uuid`, `noc_code text`, `title text`, `province text`
  - `salary_low text`, `salary_median text`, `salary_high text` (todos texto, ex.: `"$28.00/hour"`)
  - `outlook text` (`good` / `moderate` / `limited` — usados em `outlookMeta` no front)
  - `source_id uuid` → `public.sources`
  - `created_at timestamptz` (**não tem `updated_at`**)

`public.sources` (usada como origem/versão do dado): `id`, `type`, `url`, `valid_as_of date`, `next_check_due`, `last_checked`, `notes`, `created_at`. **Não existe** coluna `publisher` nem `title` — a descrição da fonte fica em `notes`.

### 2. Cobertura atual (dados reais)

Programs:
- Total: **249**
- Com pelo menos 1 NOC em `occupation_ids`: **248** (≈ 99,6%)
- Programs cujos NOCs ligados têm salário preenchido (`salary_low IS NOT NULL`): **138** (≈ 55%)

Occupations:
- Total de linhas: **104**
- Ligadas a algum program: **89** (15 occupations existem no banco mas nenhum program as referencia)
- Com `salary_low`: **35** · com `salary_high`: **35** · com `salary_median`: **4** · com `outlook`: **35** · com `source_id`: **104**

Ou seja: **~69 occupations (66%) estão sem qualquer salário** — é a lacuna principal, não o NOC. E `salary_median` está quase sempre vazio (só 4 linhas).

### 3. Origem do dado salarial

Todos os salários vieram do **Job Bank do Canadá** (`sources.type = 'job_bank'`), com URL da página `jobbank.gc.ca/marketreport/...`, `valid_as_of = 2026-07-17` e `notes` descrevendo NOC, região (predominantemente Ottawa/Ontário) e a data de atualização ESDC (fev/2026 na maioria).

- Rastreabilidade: `occupations.source_id → sources.id` (por linha de occupation, não por campo salarial individual).
- Datas de verificação: `sources.valid_as_of`, `sources.last_checked`, `sources.next_check_due`.
- `occupations` **não** tem `updated_at` próprio — a "frescura" do salário depende só da linha em `sources`.
- Escopo geográfico: **quase tudo é Ottawa/Ontário**. Faltam cobertura para outras províncias, mesmo para NOCs já cadastrados.

### 4. Onde o card renderiza "Mercado de trabalho"

Arquivo: `src/pages/Programs.tsx`, dentro do diálogo de detalhe do programa (linhas 1311–1349). Trecho:

```tsx
{selectedOccupations.length > 0 && (
  <div>
    <h4 className="font-display font-semibold text-navy mb-2">
      {T("Mercado de trabalho", "Labour market")}
    </h4>
    <div className="space-y-2">
      {selectedOccupations.map((o) => {
        const out = outlookMeta(o.outlook, lang);
        return (
          <div key={o.id} className="rounded-lg border border-border p-3 …">
            <div>
              <p className="font-medium text-navy">
                {o.title}
                {o.noc_code && (
                  <span className="ml-2 text-xs text-muted-foreground font-mono">
                    NOC {o.noc_code}
                  </span>
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {o.salary_low && o.salary_high
                  ? `${o.salary_low} – ${o.salary_high}`
                  : o.salary_median || "—"}
              </p>
            </div>
            {out && (
              <span className={`… ${out.className}`}>{out.label}</span>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}
```

Contexto de dados na mesma página:
- Query das occupations (linhas 448–455): `select id, noc_code, title, salary_low, salary_median, salary_high, outlook` — **não seleciona `source_id`, `province` nem faz join em `sources`**, então a UI atual não expõe nem a região nem a fonte/data do salário.
- `selectedOccupations` é montado em `useMemo` (linhas 536–541) a partir de `selected.occupation_ids` mapeados pelo `Map` construído em `occById`.
- Existe também `salaryRange(p)` (linhas 527–534) usado nos cards da grid, que pega a primeira occupation com qualquer salário.

### Observações honestas (sem propor mudanças)

- A UI mostra a faixa como texto direto do banco (ex.: `"$28.00/hour – $37.05/hour"`). Não há normalização, nem indicação de que é dado por hora, nem de qual província/região aquele número reflete.
- Não há badge de fonte/data no bloco "Mercado de trabalho" — diferente de outras seções do site que usam `SourceBadge`.
- 15 occupations existem mas não estão referenciadas por nenhum program (dado órfão) e ~66% das occupations estão sem salário.

Se quiser, o próximo passo pode ser um plano para (a) aumentar cobertura de salário, (b) expor fonte/data/região no card, ou (c) ambos. Só me diga a direção.