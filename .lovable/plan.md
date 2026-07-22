# Inspeção do CSV de salários (ESDC 2025) — só relatório

Fonte baixada: `2a71-das-wage2025opendata-esdc-all-19nov2025-vf.csv` (Open Government, revisão 2025-11-19).

## 1. Arquivo

- Tamanho: **17.981.889 bytes (~17,2 MB)**
- Linhas: **44.377** (44.376 de dados + 1 cabeçalho)
- Encoding: UTF-8 com BOM
- Delimitador: `,`
- Colunas: **22**, nomes exatos:

```
1  NOC_CNP
2  NOC_Title_eng
3  NOC_Title_fra
4  prov
5  ER_Code_Code_RE
6  ER_Name
7  Nom_RE
8  Low_Wage_Salaire_Minium
9  Median_Wage_Salaire_Median
10 High_Wage_Salaire_Maximal
11 Average_Wage_Salaire_Moyen
12 Quartile1_Wage_Salaire_Quartile1
13 Quartile3_Wage_Salaire_Quartile3
14 Source2025_NHQ
15 Data_Source_E
16 Data_Source_F
17 Reference_Period
18 Revision_Date_Date_revision
19 Annual_Wage_Flag_Salaire_annuel
20 Wage_Comment_E
21 Wage_Comment_F
22 EmployeesWithNonWageBenefit_Pct
```

## 2. Amostra crua (5 primeiras linhas de dados)

```
NOC_00010,Legislators,Membres des corps législatifs,NAT,ER00,Canada,Canada,32867,84000,184000,97600,54400,132000,Census 2021 CAN NOC5,2021 Census,Recensement 2021,2021,2025-11-19,1,Wages for this occupation are presented at an annual rate...,Pour cette profession sont présentés au taux annuel...,63.1
NOC_00010,Legislators,Membres des corps législatifs,NL,ER10,Newfoundland and Labrador,Terre-Neuve-et-Labrador,,99000,,90000,,,Census 2021 PR NOC5,2021 Census,Recensement 2021,2021,2025-11-19,1,Wages for this occupation are presented at an annual rate...,...,
NOC_00010,Legislators,Membres des corps législatifs,NL,ER1010,Avalon Peninsula,Avalon Peninsula,,,,,,,N/A,NA,NA,NA,2025-11-19,0,"Due to data limitations, the wage for this occupation cannot be published...",...,
NOC_00010,Legislators,Membres des corps législatifs,NL,ER1020,South Coast--Burin Peninsula,Côte-sud--Burin Peninsula,,,,,,,N/A,NA,NA,NA,2025-11-19,0,"Due to data limitations...",...,
NOC_00010,Legislators,Membres des corps législatifs,NL,ER1030,West Coast--Northern Peninsula--Labrador,Côte-ouest--Northern Peninsula--Labrador,,,,,,,N/A,NA,NA,NA,2025-11-19,0,"Due to data limitations...",...,
```

## 3. Respostas específicas

**Código NOC** — coluna `NOC_CNP`, formato `NOC_XXXXX` com prefixo literal `NOC_` + **5 dígitos com zero à esquerda** (ex.: `NOC_00010`, `NOC_22310`). Nosso banco guarda só os 5 dígitos, então o join precisa de `substr(NOC_CNP, 5)`.

**Salários low / median / high** — `Low_Wage_Salaire_Minium`, `Median_Wage_Salaire_Median`, `High_Wage_Salaire_Maximal` (numéricos, inteiros; podem vir vazios quando a linha é suprimida por limite estatístico). Bônus disponível: `Average_Wage_Salaire_Moyen`, `Quartile1_Wage_Salaire_Quartile1`, `Quartile3_Wage_Salaire_Quartile3`.

**Hora vs anual** — coluna `Annual_Wage_Flag_Salaire_annuel` marca o modo: `0` = valores por **hora**, `1` = valores **anuais**. Só dois valores distintos no dataset. Alguns NOCs (ex.: legisladores, executivos, professores universitários) vêm como anuais mesmo quando os pares vêm por hora — não dá para assumir uniformidade.

**Regiões** — três níveis conviventes na mesma tabela, distinguíveis pela combinação `prov` × `ER_Code_Code_RE`:

- **Nacional:** `prov = 'NAT'`, `ER_Code = 'ER00'`, `ER_Name = 'Canada'`.
- **Provincial:** `prov ∈ {AB, BC, MB, NB, NL, NS, NU, NWT, ON, PEI, QC, SK, YK}` (14 códigos, incluindo `NAT`) e `ER_Code` de 4 caracteres (`ER10`, `ER35`, `ER59`, …). Ex.: Ontário inteiro = `prov='ON', ER_Code='ER35', ER_Name='Ontario'`.
- **Regional (ERs):** mesmo `prov`, mas `ER_Code` de 6 caracteres (`ER3510`, `ER3530`, …). Ex.: Ottawa, Toronto, Halifax aparecem como linhas próprias com ER_Name específico.

Regra prática: `length(ER_Code) = 4` → província inteira; `length(ER_Code) = 6` → região econômica; `prov='NAT'` → Canadá inteiro. `Nom_RE` traz o mesmo nome em francês.

**Período de referência** — colunas `Reference_Period` (`2021`, `2023-2024`, `2024`, `NA`) e `Revision_Date_Date_revision` (todos `2025-11-19` neste dump). `Source2025_NHQ` e `Data_Source_E`/`Data_Source_F` explicam a fonte da linha (Census 2021, EPA, ESDC etc.), útil para gravar em `sources`.

**Bilíngue** — sim, EN e FR conviventes: `NOC_Title_eng`/`NOC_Title_fra`, `ER_Name`/`Nom_RE`, `Data_Source_E`/`Data_Source_F`, `Wage_Comment_E`/`Wage_Comment_F`. Códigos (`NOC_CNP`, `prov`, `ER_Code`, valores numéricos, `Annual_Wage_Flag`) são neutros.

## 4. Cruzamento com nosso banco

- `public.occupations` tem **102 NOCs distintos**.
- **102 de 102** aparecem no CSV. **Zero faltantes.**
- Cobertura por linha depende ainda de província/região: várias linhas provinciais e regionais vêm com wage em branco e comentário "Due to data limitations, the wage for this occupation cannot be published. Please refer to the wage published for this occupation at the provincial level." — precisamos decidir fallback (região → província → nacional) na próxima etapa.

## Pontos que exigem decisão antes de carregar

- Unidade: nossa coluna `wage_unit` hoje é livre. O CSV mistura hora e anual por NOC — vamos gravar `Annual_Wage_Flag` como `hourly`/`annual` em `wage_unit`, sem conversão.
- Granularidade: nosso `UNIQUE (noc_code, province)` só comporta nível provincial. O CSV traz também nacional e regional. Precisamos decidir: (a) importar só provincial + nacional, (b) ampliar o schema para armazenar ER_Code também.
- Supressão: quando a linha provincial vem vazia, adotar fallback nacional? Ou deixar nulo e mostrar o link do Job Bank como hoje?

Aguardando aprovação para partir para o desenho do importador na próxima rodada.
