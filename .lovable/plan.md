# Diagnóstico das traduções

## 1. Idiomas disponíveis

Arquivos em `src/i18n/locales/`:

- `pt.ts` — 691 linhas, idioma padrão (`lng: "pt"`, `fallbackLng: "pt"`).
- `en.ts` — 61 linhas.

Apenas dois idiomas registrados em `src/i18n/index.ts` (`pt` e `en`). O seletor de idiomas na UI menciona Espanhol e Francês como "em breve", mas não há arquivos para eles.

## 2. Cobertura do inglês (`en.ts`) vs português (`pt.ts`)

O `en.ts` cobre **apenas 1 das 12 seções** do `pt.ts`.

Seções presentes em PT:

`nav`, `langs`, `home`, `countries`, `pages`, `before`, `about`, `costs`, `family`, `work`, `footer`, `programs`.

Seções presentes em EN:

`programs` apenas (e mesmo assim sem a subseção `category`… na verdade tem, mas o resto do site em inglês cai no fallback PT).

Como `fallbackLng` está definido como `"pt"`, ao trocar para inglês **todo o site continua em português**, exceto a página `/programas`. Faltam traduções em inglês de:

- `nav` (menu superior)
- `langs` (rótulos do seletor de idioma)
- `home` (página inicial)
- `countries` (seletor de destinos, portal do Canadá)
- `pages` (títulos genéricos)
- `before` (Antes de Começar — checks, scams, disclaimer)
- `about` (Sobre)
- `costs` (Custos)
- `family` (Família — saúde por província, níveis de atendimento, etc.)
- `work` (Trabalho e Moradia)
- `footer`

## 3. Páginas que usam i18n vs. textos fixos em português

### Já usam `useTranslation` / `t()`

- `src/pages/About.tsx`
- `src/pages/Before.tsx`
- `src/pages/Canada.tsx`
- `src/pages/Costs.tsx`
- `src/pages/Family.tsx`
- `src/pages/Index.tsx`
- `src/pages/PagePlaceholder.tsx`
- `src/pages/Programs.tsx`
- `src/pages/Work.tsx`
- `src/components/layout/CanadaNav.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Header.tsx`

Observação: mesmo essas páginas só ficarão em inglês depois que as seções correspondentes forem adicionadas ao `en.ts` (hoje, ao trocar idioma, elas continuam em PT via fallback).

### Ainda com textos fixos em português (NÃO usam `t()`)

- `src/pages/FinancialSimulator.tsx` — todo o conteúdo hardcoded em PT (avisos, rótulos do simulador, disclaimers).
- `src/pages/Institutions.tsx` — hero, subtítulos, rótulos de filtro, badges "Universidade"/"College", nota explicativa, todos em PT no código.
- `src/pages/PathQuiz.tsx` — todo o quiz (perguntas, opções, seções, resultados) hardcoded em PT.
- `src/pages/PgwpChecker.tsx` — verificador do PGWP inteiro hardcoded em PT (formulário, mensagens, disclaimers).
- `src/pages/NotFound.tsx` — texto curto, sem i18n (não tem PT visível, mas também não está internacionalizado).
- `src/components/IrccNote.tsx` — textos fixos em PT ("Informação geral, não confirma seu caso", "Ver página oficial do IRCC").

## Resumo executivo

- Existem **2 idiomas** (PT e EN); Espanhol/Francês são só rótulos no seletor.
- O inglês está **~8% completo** — apenas a página `/programas` foi traduzida. Todo o resto do site em EN é fallback PT.
- **9 páginas + 3 componentes de layout** já estão preparados com `t()`, mas dependem de chaves em `en.ts` que ainda não existem.
- **5 páginas + 1 componente** têm texto português hardcoded no código e precisam ser refatoradas para `t()` antes de poderem ser traduzidas: `FinancialSimulator`, `Institutions`, `PathQuiz`, `PgwpChecker`, `NotFound`, `IrccNote`.

Nenhum arquivo foi alterado.
