import { Flag } from "@/components/Flag";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation, Trans } from "react-i18next";
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

const KNOWN_CATEGORIES = new Set(["stem", "trade", "health", "agriculture", "transport"]);

const IRCC_PGWP_URL =
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html";

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
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  function categoryLabel(cat: string | null) {
    if (!cat) return t("pgwpChecker.categories.other");
    if (KNOWN_CATEGORIES.has(cat)) return t(`pgwpChecker.categories.${cat}`);
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  }

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
              <Flag code="canada" className="w-5 shrink-0" />
              <span>{t("pgwpChecker.hero.badge")}</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
              {t("pgwpChecker.hero.title")}
            </h1>
            <p className="mt-4 text-lg text-white/80 leading-relaxed">
              {t("pgwpChecker.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section className="container py-10 md:py-14">
        <IrccNote
          className="mb-6"
          href={IRCC_PGWP_URL}
          linkLabel={t("pgwpChecker.irccLinkLabel")}
        />
        {/* Search + filters */}
        <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("pgwpChecker.search.placeholder")}
              className="pl-9 h-11"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant={category === "all" ? "default" : "outline"}
              onClick={() => setCategory("all")}
            >
              {t("pgwpChecker.search.allCategories")}
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
              <Trans
                i18nKey="pgwpChecker.search.siglasHint"
                components={{ strong: <span className="font-medium text-foreground" /> }}
              />
            </p>
          </div>

          <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4 mt-0.5 shrink-0" />
            <p>
              <Trans
                i18nKey="pgwpChecker.search.namesHint"
                components={{ strong: <span className="font-medium text-foreground" /> }}
              />
            </p>
          </div>
        </div>

        {/* Coverage note */}
        <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4 flex items-start gap-3 text-sm">
          <Info className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
          <p className="text-foreground/90 leading-relaxed">
            <span className="font-medium text-foreground">{t("pgwpChecker.coverage.label")}</span>{" "}
            <Trans
              i18nKey="pgwpChecker.coverage.body"
              components={{
                strong: <span className="font-medium" />,
                link: (
                  <a
                    href={IRCC_PGWP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  />
                ),
              }}
            />
          </p>
        </div>

        {/* Results */}
        <div className="mt-6">
          {isLoading && (
            <p className="text-muted-foreground text-sm py-10 text-center">
              {t("pgwpChecker.results.loading")}
            </p>
          )}
          {error && (
            <p className="text-crimson text-sm py-10 text-center">
              {t("pgwpChecker.results.error")}
            </p>
          )}

          {!isLoading && !error && (
            <>
              <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                <span>
                  {t("pgwpChecker.results.count", { filtered: filtered.length, total: data?.length ?? 0 })}
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
                            {t("pgwpChecker.results.badges.eligible")}
                          </span>
                        )}
                        {status === "conditional" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-xs font-medium cursor-help">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                {t("pgwpChecker.results.badges.conditional")}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              {t("pgwpChecker.results.badges.conditionalTooltip")}
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {status === "unknown" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted text-muted-foreground px-3 py-1 text-xs font-medium">
                            {t("pgwpChecker.results.badges.unknown")}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
                {filtered.length === 0 && (
                  <li className="text-center text-muted-foreground py-10 text-sm">
                    {t("pgwpChecker.results.empty")}
                  </li>
                )}
              </ul>
            </>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-10 rounded-xl border border-border bg-muted/40 p-5 text-sm text-muted-foreground leading-relaxed">
          <p className="font-medium text-foreground mb-1">{t("pgwpChecker.disclaimer.title")}</p>
          <p>
            <Trans i18nKey="pgwpChecker.disclaimer.body" components={{ strong: <strong /> }} />
          </p>
        </div>
      </section>
    </>
  );
}