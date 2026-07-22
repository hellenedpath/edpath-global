import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation, Trans } from "react-i18next";
import { CheckCircle2, AlertTriangle, Search, Info, ArrowRight, Compass, GraduationCap, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import IrccNote from "@/components/IrccNote";
import SourceBadge from "@/components/SourceBadge";
import VerificationNote from "@/components/VerificationNote";
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

const KNOWN_CATEGORIES = new Set([
  "stem",
  "trade",
  "health_care",
  "education",
  "agriculture",
  "transport",
]);

const IRCC_PGWP_URL =
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html";

function eligibilityFromDescription(desc: string | null) {
  const d = normalize(desc);
  if (
    d.includes("conditional") ||
    d.includes("condicionada") ||
    d.includes("condicional")
  ) {
    return "conditional" as const;
  }
  return "eligible" as const;
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

// Additional PT→EN synonyms for fields Brazilian students search most.
Object.assign(PT_EN_SYNONYMS, {
  enfermeiro: ["nurse", "nursing"],
  enfermeira: ["nurse", "nursing"],
  tecnico: ["technician", "technology"],
  tecnica: ["technician", "technology"],
  programacao: ["programming", "programmer", "computer"],
  programador: ["programming", "programmer", "computer"],
  dados: ["data", "analytics"],
  redes: ["network", "networking"],
  seguranca: ["security", "safety"],
  nutricao: ["nutrition", "dietetics", "food"],
  odontologia: ["dental", "dentistry"],
  dentista: ["dental", "dentistry"],
  farmacia: ["pharmacy", "pharmaceutical"],
  fisioterapia: ["physical therapy", "physiotherapy"],
  terapia: ["therapy", "therapist"],
  soldagem: ["welding", "welder"],
  soldador: ["welding", "welder"],
  soldadura: ["welding"],
  encanador: ["plumbing", "plumber"],
  eletricista: ["electrical", "electrician"],
  carpintaria: ["carpentry", "woodworking"],
  culinaria: ["culinary", "food", "cook"],
  gastronomia: ["culinary", "food", "cook"],
  chef: ["culinary", "food", "cook"],
  hotelaria: ["hospitality", "hotel"],
  logistica: ["logistics", "supply chain"],
  contabilidade: ["accounting", "accountant"],
  marketing: ["marketing", "advertising", "digital"],
  design: ["design", "graphic"],
  infantil: ["child", "early childhood"],
  crianca: ["child", "early childhood"],
  social: ["social", "human services"],
  veterinaria: ["veterinary", "animal"],
  aviacao: ["aviation", "aircraft", "pilot"],
  piloto: ["aviation", "aircraft", "pilot"],
});

// English & Portuguese suffix stripping, longest-first. Only strip when
// the resulting stem is at least 4 chars; never stem tokens shorter than 5.
const SUFFIXES: Array<[string, string]> = [
  // Portuguese (longest first)
  ["ologist", ""],
  ["ology", ""],
  ["mento", ""],
  ["coes", ""],
  ["ches", ""],
  ["agem", ""],
  ["dade", ""],
  ["ista", ""],
  ["eiro", ""],
  ["eira", ""],
  ["ando", ""],
  ["endo", ""],
  ["aria", ""],
  ["cao", ""],
  // English
  ["ance", ""],
  ["ence", ""],
  ["tion", ""],
  ["sion", ""],
  ["ment", ""],
  ["ing", ""],
  ["ity", ""],
  ["ies", "y"],
  ["ist", ""],
  ["er", ""],
  ["or", ""],
  ["es", ""],
  ["s", ""],
];

function stem(token: string): string {
  if (token.length < 5) return token;
  for (const [suf, rep] of SUFFIXES) {
    if (token.length - suf.length >= 4 && token.endsWith(suf)) {
      return token.slice(0, token.length - suf.length) + rep;
    }
  }
  return token;
}

function buildHaystack(...parts: Array<string | null | undefined>): string {
  const raw = parts.map((p) => normalize(p)).join(" ");
  const stems = raw
    .split(" ")
    .filter(Boolean)
    .map(stem)
    .join(" ");
  return raw + " " + stems;
}

function expandToken(token: string): string[] {
  const extras = PT_EN_SYNONYMS[token];
  return extras && extras.length ? [token, ...extras.map(normalize)] : [token];
}

export default function PgwpChecker() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [onlyWithPrograms, setOnlyWithPrograms] = useState(false);

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

  // Program counts per CIP code (independent cache)
  const { data: programCounts } = useQuery({
    queryKey: ["cip_program_counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("cip_code, institution_id")
        .not("cip_code", "is", null)
        .range(0, 9999);
      if (error) throw error;
      const map = new Map<string, { programs: number; insts: Set<string> }>();
      (data ?? []).forEach((row: { cip_code: string | null; institution_id: string | null }) => {
        const code = row.cip_code;
        if (!code) return;
        let entry = map.get(code);
        if (!entry) {
          entry = { programs: 0, insts: new Set() };
          map.set(code, entry);
        }
        entry.programs += 1;
        if (row.institution_id) entry.insts.add(row.institution_id);
      });
      const out = new Map<string, { programs: number; institutions: number }>();
      map.forEach((v, k) => out.set(k, { programs: v.programs, institutions: v.insts.size }));
      return out;
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
    const rows = (data ?? []).filter((r) => {
      if (category !== "all" && r.category !== category) return false;
      if (onlyWithPrograms && !programCounts?.has(r.code)) return false;
      if (tokens.length === 0) return true;
      const haystack = buildHaystack(r.title, r.code, r.description, r.category);
      // Each token must match: itself, a PT→EN synonym, or the stem of either.
      return tokens.every((tok) =>
        expandToken(tok).some((variant) => {
          if (haystack.includes(variant)) return true;
          const s = stem(variant);
          return s !== variant && haystack.includes(s);
        })
      );
    });
    // When toggle OFF, sort codes-with-programs first, then alphabetically
    if (!onlyWithPrograms && programCounts) {
      return [...rows].sort((a, b) => {
        const ha = programCounts.has(a.code) ? 0 : 1;
        const hb = programCounts.has(b.code) ? 0 : 1;
        if (ha !== hb) return ha - hb;
        return (a.title ?? "").localeCompare(b.title ?? "");
      });
    }
    return rows;
  }, [data, query, category, onlyWithPrograms, programCounts]);

  const codesWithProgramsCount = useMemo(() => {
    if (!data || !programCounts) return 0;
    return data.filter((r) => programCounts.has(r.code)).length;
  }, [data, programCounts]);

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="container py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/70 mb-4">
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

          <label className="mt-5 flex items-center gap-3 rounded-xl border border-navy/15 bg-navy/[0.03] px-4 py-3 cursor-pointer">
            <Switch checked={onlyWithPrograms} onCheckedChange={setOnlyWithPrograms} />
            <span className="text-sm font-medium text-navy">
              {t("pgwpChecker.filters.withProgramsOnly")}
            </span>
            <span className="text-xs text-muted-foreground ml-auto">
              {t("pgwpChecker.filters.withProgramsCount", { count: codesWithProgramsCount })}
            </span>
          </label>
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
                  const pc = programCounts?.get(r.code);
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
                        {pc ? (
                          <Link
                            to={`/canada/programas?cip=${encodeURIComponent(r.code)}`}
                            className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-navy hover:text-[hsl(var(--crimson))] transition-colors group"
                          >
                            {t("pgwpChecker.programsLine.hasPrograms", {
                              count: pc.programs,
                              institutions: pc.institutions,
                            })}
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
                          </Link>
                        ) : (
                          <p className="mt-1.5 text-xs text-muted-foreground italic">
                            {t("pgwpChecker.programsLine.none")}
                          </p>
                        )}
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
                              {r.description ?? t("pgwpChecker.results.badges.conditionalTooltip")}
                            </TooltipContent>
                          </Tooltip>
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

        {/* Next steps */}
        <div className="mt-10 rounded-2xl border border-navy/15 bg-navy/[0.03] p-6 md:p-8">
          <h2 className="font-display text-xl md:text-2xl font-semibold text-navy">
            {t("pgwpChecker.nextSteps.title")}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {t("pgwpChecker.nextSteps.subtitle")}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link
              to="/canada/programas"
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-[hsl(var(--crimson))] transition-colors"
            >
              <GraduationCap className="h-5 w-5 text-navy shrink-0" strokeWidth={1.5} />
              <span className="font-medium text-navy flex-1">
                {t("pgwpChecker.nextSteps.seePrograms")}
              </span>
              <ArrowRight className="h-4 w-4 text-navy transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
            </Link>
            <Link
              to="/canada/meu-caminho?country=canada"
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-[hsl(var(--crimson))] transition-colors"
            >
              <Compass className="h-5 w-5 text-navy shrink-0" strokeWidth={1.5} />
              <span className="font-medium text-navy flex-1">
                {t("pgwpChecker.nextSteps.findPath")}
              </span>
              <ArrowRight className="h-4 w-4 text-navy transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
            </Link>
          </div>
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("edpath:open-assistant"))
            }
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
            {t("pgwpChecker.nextSteps.askAssistant")}
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 rounded-xl border border-border bg-muted/40 p-5 text-sm text-muted-foreground leading-relaxed">
          <p className="font-medium text-foreground mb-1">{t("pgwpChecker.disclaimer.title")}</p>
          <p>
            <Trans i18nKey="pgwpChecker.disclaimer.body" components={{ strong: <strong /> }} />
          </p>
        </div>

        <div className="mt-6 max-w-3xl">
          <SourceBadge
            variant="block"
            url={IRCC_PGWP_URL}
            validAsOf="2026-07-17"
          />
        </div>

        <VerificationNote className="mt-8" />
      </section>
    </>
  );
}