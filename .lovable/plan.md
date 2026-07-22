
# Teste de viabilidade Job Bank — relato honesto

## 1. NOCs testados

- `21231` — Software Engineer / Designer
- `31303` — Registered Nurse
- `41300` — Social Worker

Todos os 3 estão sem salário no banco (dos 100 restantes).

## 2. Acesso à URL "por NOC"

**A URL `https://www.jobbank.gc.ca/marketreport/occupation/{noc_code}` NÃO funciona.**

Todas as 3 retornaram HTTP 404 com o mesmo `<h1>HTTP Error 404 - Not Found</h1>`. Também testei outras variantes com o NOC direto no path (`/marketreport/summary-occupation/{noc}/ON`, `/marketreport/wages-occupation/{noc}/on`, `/marketreport/summary/{noc}/on`, `/marketreport/wages/{noc}/on`): **todas 404**.

Ou seja, o link "Job Bank" que o próprio site do EdPath usa hoje como fallback (`https://www.jobbank.gc.ca/marketreport/occupation/{noc_code}`, adicionado na última refatoração da página Programs) **está quebrado** — leva o usuário a uma página de erro.

## 3. URL real da página de salários

O Job Bank usa **IDs internos opacos**, não o NOC, na URL. Descobri o padrão testando um ID conhecido (`17786`):

- **`https://www.jobbank.gc.ca/wagereport/occupation/{internal_id}`** — página nacional com tabela completa por província/região. Server-rendered.
- **`https://www.jobbank.gc.ca/marketreport/wages-occupation/{internal_id}/{loc_code}`** — mesma tabela filtrada por local. `loc_code` = `ON`, `QC`… ou `geo9219` (Toronto), `geo9193` (Ottawa) etc.

O `internal_id` **não é o NOC**. Exemplo real: `17786` corresponde ao NOC **75119** ("Electric cable network installer helper"). Um NOC pode ter vários `internal_id` (uma linha por título de trabalho específico dentro do NOC).

**Não descobri um endpoint público que aceite `?noc=XXXXX` e devolva o `internal_id` em JSON.** O formulário `/trend-analysis/search-wages?noc=21231&province=ON` só devolve o form em branco — o preenchimento é via typeahead JS que chama um endpoint que ainda não localizei. O endpoint `/jobsearch/jobsuggest` também deu 404.

**Caminhos possíveis** (para você decidir):
- **(a) Dataset oficial Open Government** — a própria página do Job Bank aponta para `https://open.canada.ca/data/en/dataset/adad580f-76b0-4502-bd05-20c125de9116` como fonte de "Historical wage data and more statistics". Provavelmente contém a tabela NOC → salário sem precisar raspar HTML.
- **(b) Engenharia reversa do typeahead** de `search-wages` (achar o endpoint XHR que o JS chama).
- **(c) Mapeamento manual** do subconjunto de NOCs que interessam (~100 linhas — uma vez, à mão).

## 4. Render: server-side ou JS?

**Server-side.** A tabela HTML da `/wagereport/occupation/17786` vem completa no primeiro fetch, sem JavaScript. Exemplo real do HTML (linhas 68–79 da resposta, província Ontário e regiões):

```html
<th class="province sub_header">Ontario</th>
<td class="province align-center" headers="... header_min">17.60</td>
<td class="province align-center" headers="... header_avg">23.00</td>
<td class="province align-center aaaaa" headers="... header_max">38.96</td>
...
<th ...>Toronto Region</th>
<td ...>17.85</td> <td ...>24.00</td> <td ...>44.23</td>
<th ...>Ottawa Region</th>
<td ...>17.60</td> <td ...>23.00</td> <td ...>35.48</td>
```

Cada linha vem também com um `<section>` de nota que diz literalmente: `Reference period: 2023-2024. Source: Employment Insurance Survey Data`. Data de atualização no cabeçalho: `These wages were updated on November 19, 2025`.

Parse trivial com regex ou HTML parser. Alternativa mais limpa: usar `fetch_website` em modo markdown — o próprio Firecrawl/renderer já entrega uma tabela markdown navegável (a versão em markdown que testei tinha as 13 províncias + ~60 regiões, cada linha com Low/Median/High/Note).

## 5. robots.txt e termos

**robots.txt** de `https://www.jobbank.gc.ca/robots.txt`:

```
User-agent: *
Crawl-delay: 5
```

Nenhum `Disallow`. **Tecnicamente permitido**, com pedido explícito de 5s entre requests.

**Termos de uso:** não fui verificar o texto integral dos Terms. O Job Bank é um site do Governo do Canadá; a página do dataset Open Government (linkada dentro da própria página de salários) é distribuída sob licença Open Government (permite reuso com atribuição). Antes de rodar um crawl grande em produção, o correto é ler a página `https://www.jobbank.gc.ca/aboutsite/terms-conditions` — não fiz isso ainda porque você disse para não contornar sem consultar.

## Recomendação

**Não conseguimos ir do NOC direto para os salários pela URL.** Existe uma barreira real de mapeamento NOC → internal_id que precisa ser resolvida antes de qualquer pipeline.

**Antes de construir extrator, preciso saber qual caminho seguir:**

1. Investigar o **dataset Open Government** (opção (a)) — se tiver os salários por NOC direto em CSV/JSON, o "extrator" vira um simples download + parse, sem raspar HTML e sem crawl-delay. **É o caminho mais limpo se der certo.**
2. **Engenharia reversa** do typeahead do search-wages (opção (b)) — mais frágil, depende de endpoint interno não documentado.
3. **Mapeamento manual** dos ~100 NOCs (opção (c)) — 1–2 horas de trabalho humano, resultado permanente.

Qual caminho quer que eu explore primeiro? (Sugiro (a).)
