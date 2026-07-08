import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, AlertTriangle, Search, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import IrccNote from "@/components/IrccNote";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CipCode = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  category: string | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  stem: "STEM / Ciências e Tecnologia",
  trade: "Trades / Ofícios",
  health: "Saúde",
  agriculture: "Agricultura",
  transport: "Transporte",
};

function categoryLabel(cat: string | null) {
  if (!cat) return "Outros";
  return CATEGORY_LABELS[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1);
}

function eligibilityFromDescription(desc: string | null) {
  const d = (desc ?? "").toLowerCase();
  if (d.includes("conditional")) return "conditional" as const;
  if (d.includes("eligible")) return "eligible" as const;
  return "unknown" as const;
}

function normalize(str: string | null | undefined) {
  return (str ?? "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

// Dicionário português → inglês para busca nos títulos oficiais dos CIP codes.
// Fácil de expandir: basta adicionar novas entradas (chave em português normalizado,
// valor = array de termos em inglês a serem procurados também).
const PT_EN_SYNONYMS: Record<string, string[]> = {
  fisica: ["physics"],
  quimica: ["chemistry"],
  matematica: ["mathematics", "math"],
  engenharia: ["engineering"],
  computacao: ["computer", "computing", "information technology"],
  ti: ["information technology", "computer"],
  tecnologia: ["technology"],
  enfermagem: ["nursing"],
  saude: ["health"],
  negocios: ["business", "management"],
  administracao: ["business", "management", "administration"],
  educacao: ["education"],
  biologia: ["biology", "biological"],
  som: ["acoustics", "sound"],
  acustica: ["acoustics"],
  ambiental: ["environmental"],
  agricultura: ["agriculture", "agricultural"],
  eletricidade: ["electrical"],
  eletrica: ["electrical"],
  mecanica: ["mechanical", "mechanics"],
  construcao: ["construction"],
  transporte: ["transport", "transportation"],
};

function expandToken(token: string): string[] {
  const extras = PT_EN_SYNONYMS[token];
  return extras && extras.length ? [token, ...extras.map(normalize)] : [token];
}

export default function PgwpChecker() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["cip_codes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cip_codes")
        .select("id, code, title, description, category")
        .range(0, 999)
        .order("title", { ascending: true });
      if (error) throw error;
      return data as CipCode[];
    },
  });

  const categories = useMemo(() => {
    const set = new Set<string>();
    (data ?? []).forEach((r) => r.category && set.add(r.category));
    return Array.from(set).sort();
  }, [data]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    const tokens = q.split(" ").filter(Boolean);
    return (data ?? []).filter((r) => {
      if (category !== "all" && r.category !== category) return false;
      if (tokens.length === 0) return true;
      const haystack =
        normalize(r.title) +
        " " +
        normalize(r.code) +
        " " +
        normalize(r.description) +
        " " +
        normalize(r.category);
      // Cada token deve bater (ele mesmo OU qualquer sinônimo em inglês)
      return tokens.every((t) =>
        expandToken(t).some((variant) => haystack.includes(variant))
      );
    });
  }, [data, query, category]);

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="container py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/70 mb-4">
              <span className="text-lg leading-none">🇨🇦</span>
              <span>Verificador PGWP</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
              Sua área de estudo dá direito ao PGWP?
            </h1>
            <p className="mt-4 text-lg text-white/80 leading-relaxed">
              Descubra, em geral, se um campo de estudo costuma ser elegível
              para a permissão de trabalho pós-graduação (PGWP), com base na
              lista oficial do governo canadense. Esta é uma orientação — não
              confirma o seu caso específico.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-10 md:py-14">
        <IrccNote
          className="mb-6"
          href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html"
          linkLabel="Regras oficiais do PGWP no IRCC"
        />
        {/* Search + filters */}
        <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busque por área (ex.: nursing, engineering, business)"
              className="pl-9 h-11"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant={category === "all" ? "default" : "outline"}
              onClick={() => setCategory("all")}
            >
              Todas as categorias
            </Button>
            {categories.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={category === c ? "default" : "outline"}
                onClick={() => setCategory(c)}
              >
                {categoryLabel(c)}
              </Button>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4 mt-0.5 shrink-0" />
            <p>
              Siglas entre parênteses (ex.:{" "}
              <span className="font-medium text-foreground">BArch, MArch, DArch, PhD</span>)
              indicam as titulações acadêmicas oferecidas na área — bacharelado,
              mestrado, doutorado e equivalentes.
            </p>
          </div>

          <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4 mt-0.5 shrink-0" />
            <p>
              As áreas aparecem com o nome técnico oficial usado pelo governo
              canadense, muitas vezes em inglês. Se você não reconhecer um termo,
              ele pode ser o nome técnico da sua área.{" "}
              <span className="font-medium text-foreground">Dica:</span> tente
              buscar em português (ex.:{" "}
              <span className="font-medium text-foreground">"física", "engenharia"</span>)
              ou confirme o nome do seu programa com a instituição.
            </p>
          </div>
        </div>

        {/* Coverage note */}
        <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4 flex items-start gap-3 text-sm">
          <Info className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
          <p className="text-foreground/90 leading-relaxed">
            <span className="font-medium text-foreground">Cobertura atual dos dados:</span>{" "}
            esta ferramenta cobre atualmente as áreas de{" "}
            <span className="font-medium">STEM, Trades e Transporte</span>. Estamos adicionando
            outras categorias, como Saúde, Educação e Agricultura. Se você não
            encontrar sua área, ela pode ainda não ter sido incluída —{" "}
            <span className="font-medium">isso não significa que ela não seja elegível</span>.
            Confirme sempre na{" "}
            <a
              href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              lista oficial do IRCC
            </a>.
          </p>
        </div>

        {/* Results */}
        <div className="mt-6">
          {isLoading && (
            <p className="text-muted-foreground text-sm py-10 text-center">
              Carregando áreas de estudo...
            </p>
          )}
          {error && (
            <p className="text-crimson text-sm py-10 text-center">
              Erro ao carregar dados. Tente novamente.
            </p>
          )}

          {!isLoading && !error && (
            <>
              <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                <span>
                  {filtered.length} de {data?.length ?? 0} áreas
                </span>
              </div>

              <ul className="space-y-3">
                {filtered.map((r) => {
                  const status = eligibilityFromDescription(r.description);
                  return (
                    <li
                      key={r.id}
                      className="rounded-xl border border-border bg-card p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <span className="font-mono">{r.code}</span>
                          <span>•</span>
                          <span>{categoryLabel(r.category)}</span>
                        </div>
                        <h3 className="font-medium text-foreground leading-snug">
                          {r.title}
                        </h3>
                      </div>
                      <div className="shrink-0">
                        {status === "eligible" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Elegível para PGWP
                          </span>
                        )}
                        {status === "conditional" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-xs font-medium cursor-help">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                Elegibilidade condicional
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              Depende de requisitos específicos (instituição,
                              duração, nível ou credencial).
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {status === "unknown" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted text-muted-foreground px-3 py-1 text-xs font-medium">
                            Verificar
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
                {filtered.length === 0 && (
                  <li className="text-center text-muted-foreground py-10 text-sm">
                    Nenhuma área encontrada para esta busca.
                  </li>
                )}
              </ul>
            </>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-10 rounded-xl border border-border bg-muted/40 p-5 text-sm text-muted-foreground leading-relaxed">
          <p className="font-medium text-foreground mb-1">Aviso importante</p>
          <p>
            Esta informação é baseada na lista oficial de campos de estudo
            elegíveis para PGWP do IRCC e serve como <strong>orientação geral</strong>.
            Em geral, a elegibilidade final também depende da instituição
            (DLI), da duração do programa e do idioma. Esta ferramenta{" "}
            <strong>não confirma o seu caso específico</strong>. Confirme sempre
            nas fontes oficiais do IRCC e, para decisões de imigração, consulte
            um consultor RCIC licenciado.
          </p>
        </div>
      </section>
    </>
  );
}