import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  MapPin,
  Search,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Program = {
  id: string;
  name: string;
  credential: string | null;
  field_area: string | null;
  campus_city: string | null;
  min_grade: string | null;
  prerequisites: string | null;
  english_admission_tests: Record<string, unknown> | null;
  duration_months: number | null;
  tuition_intl_year: string | null;
  has_coop: boolean;
  pgwp_eligible: string | null;
  pgwp_basis: string | null;
  application_url: string | null;
  intl_office_url: string | null;
  occupation_ids: string[] | null;
  institution_id: string;
  institutions: {
    id: string;
    name: string;
    display_name: string | null;
    city: string | null;
    province: string | null;
  } | null;
};

type Occupation = {
  id: string;
  noc_code: string | null;
  title: string | null;
  salary_low: string | null;
  salary_median: string | null;
  salary_high: string | null;
  outlook: string | null;
};

const AREA_OPTIONS = [
  { value: "health", en: "Health", pt: "Saúde" },
  { value: "it", en: "IT / Advanced technology", pt: "TI / Tecnologia avançada" },
  { value: "trades", en: "Trades", pt: "Trades / Ofícios técnicos" },
];

function normalize(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function inferArea(p: Program): string | null {
  if (p.field_area) {
    const f = p.field_area.toLowerCase();
    if (f.includes("health")) return "health";
    if (f.includes("trade")) return "trades";
    if (f.includes("it") || f.includes("tech") || f.includes("comput") || f.includes("cyber"))
      return "it";
  }
  const name = (p.name || "").toLowerCase();
  if (/nurs|health|dental|paramedic|radiation|medic|pharma|therap/.test(name)) return "health";
  if (/comput|program|cyber|network|software|data|it |game|web/.test(name)) return "it";
  if (/electric|hvac|heating|plumb|mechan|construc|weld|carpent|technician|automot|refriger/.test(name))
    return "trades";
  return null;
}

function outlookMeta(outlook: string | null, lang: string) {
  const o = (outlook || "").toLowerCase();
  if (o.includes("good") || o.includes("very good")) {
    return {
      label: lang === "pt" ? "Perspectiva boa" : "Good outlook",
      className: "bg-emerald-100 text-emerald-800",
    };
  }
  if (o.includes("moderate") || o.includes("fair")) {
    return {
      label: lang === "pt" ? "Perspectiva moderada" : "Moderate outlook",
      className: "bg-amber-100 text-amber-900",
    };
  }
  if (o.includes("limited") || o.includes("undetermined")) {
    return {
      label: lang === "pt" ? "Perspectiva limitada" : "Limited outlook",
      className: "bg-rose-100 text-rose-800",
    };
  }
  return null;
}

function formatEnglishTests(tests: Record<string, unknown> | null): string[] {
  if (!tests || typeof tests !== "object") return [];
  return Object.entries(tests).map(([k, v]) => {
    if (v && typeof v === "object") {
      const obj = v as Record<string, unknown>;
      const parts = Object.entries(obj)
        .map(([kk, vv]) => `${kk}: ${vv}`)
        .join(", ");
      return `${k.toUpperCase()} — ${parts}`;
    }
    return `${k.toUpperCase()}: ${String(v)}`;
  });
}

export default function Programs() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("pt") ? "pt" : "en";
  const T = (pt: string, en: string) => (lang === "pt" ? pt : en);

  const [query, setQuery] = useState("");
  const [area, setArea] = useState<string>("all");
  const [credential, setCredential] = useState<string>("all");
  const [onlyPgwp, setOnlyPgwp] = useState(false);
  const [selected, setSelected] = useState<Program | null>(null);

  const { data: programs, isLoading, error } = useQuery({
    queryKey: ["programs-full"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select(
          "id, name, credential, field_area, campus_city, min_grade, prerequisites, english_admission_tests, duration_months, tuition_intl_year, has_coop, pgwp_eligible, pgwp_basis, application_url, intl_office_url, occupation_ids, institution_id, institutions(id, name, display_name, city, province)"
        )
        .order("name", { ascending: true });
      if (error) throw error;
      return data as unknown as Program[];
    },
  });

  const { data: occupations } = useQuery({
    queryKey: ["occupations-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("occupations")
        .select("id, noc_code, title, salary_low, salary_median, salary_high, outlook");
      if (error) throw error;
      return data as Occupation[];
    },
  });

  const occById = useMemo(() => {
    const m = new Map<string, Occupation>();
    (occupations ?? []).forEach((o) => m.set(o.id, o));
    return m;
  }, [occupations]);

  const credentials = useMemo(() => {
    const set = new Set<string>();
    (programs ?? []).forEach((p) => p.credential && set.add(p.credential));
    return Array.from(set).sort();
  }, [programs]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return (programs ?? []).filter((p) => {
      if (onlyPgwp && p.pgwp_eligible !== "yes") return false;
      if (credential !== "all" && p.credential !== credential) return false;
      if (area !== "all" && inferArea(p) !== area) return false;
      if (!q) return true;
      const hay = `${p.name} ${p.institutions?.name ?? ""} ${p.campus_city ?? ""}`;
      return normalize(hay).includes(q);
    });
  }, [programs, query, area, credential, onlyPgwp]);

  const isComplete = (p: Program) => !!p.tuition_intl_year;

  const salaryRange = (p: Program) => {
    const ids = p.occupation_ids ?? [];
    for (const id of ids) {
      const o = occById.get(id);
      if (o && (o.salary_low || o.salary_high || o.salary_median)) return o;
    }
    return null;
  };

  const selectedOccupations: Occupation[] = useMemo(() => {
    if (!selected) return [];
    return (selected.occupation_ids ?? [])
      .map((id) => occById.get(id))
      .filter((x): x is Occupation => !!x);
  }, [selected, occById]);

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-[1320px] px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/70 mb-4">
              <span>{T("Programas", "Programs")}</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
              {T("Encontre o programa certo para seu caminho", "Find the program that fits your path")}
            </h1>
            <p className="mt-5 text-lg text-white/80 leading-relaxed max-w-2xl">
              {T(
                "Programas verificados em fontes oficiais das instituições, com informações de admissão, custos e mercado de trabalho.",
                "Programs verified against official institution sources, with admission, cost and labour-market information."
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-6 py-10 md:py-14">
        {/* Filters */}
        <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={T("Buscar por nome, instituição ou cidade", "Search by name, institution or city")}
              className="pl-9 h-11"
            />
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {T("Área", "Field")}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={area === "all" ? "default" : "outline"}
                  onClick={() => setArea("all")}
                >
                  {T("Todas", "All")}
                </Button>
                {AREA_OPTIONS.map((a) => (
                  <Button
                    key={a.value}
                    size="sm"
                    variant={area === a.value ? "default" : "outline"}
                    onClick={() => setArea(a.value)}
                  >
                    {a[lang as "pt" | "en"]}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {T("Credencial", "Credential")}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={credential === "all" ? "default" : "outline"}
                  onClick={() => setCredential("all")}
                >
                  {T("Todas", "All")}
                </Button>
                {credentials.map((c) => (
                  <Button
                    key={c}
                    size="sm"
                    variant={credential === c ? "default" : "outline"}
                    onClick={() => setCredential(c)}
                    className="max-w-[220px] truncate"
                  >
                    {c}
                  </Button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 cursor-pointer">
              <Switch checked={onlyPgwp} onCheckedChange={setOnlyPgwp} />
              <span className="text-sm font-medium">
                {T("Só elegíveis a PGWP", "PGWP-eligible only")}
              </span>
            </label>
          </div>
        </div>

        {/* Results */}
        <div className="mt-6">
          {isLoading && (
            <p className="text-muted-foreground text-sm py-10 text-center">
              {T("Carregando programas…", "Loading programs…")}
            </p>
          )}
          {error && (
            <p className="text-crimson text-sm py-10 text-center">
              {T("Não foi possível carregar os programas.", "Could not load programs.")}
            </p>
          )}

          {!isLoading && !error && (
            <>
              <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                <span>
                  {T(
                    `${filtered.length} de ${programs?.length ?? 0} programas`,
                    `${filtered.length} of ${programs?.length ?? 0} programs`
                  )}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => {
                  const complete = isComplete(p);
                  const inst = p.institutions;
                  const occ = salaryRange(p);
                  const out = occ ? outlookMeta(occ.outlook, lang) : null;
                  return (
                    <button
                      key={p.id}
                      onClick={() => complete && setSelected(p)}
                      className={`group text-left rounded-2xl border border-border bg-card p-5 flex flex-col gap-3 transition-all ${
                        complete
                          ? "hover:border-crimson hover:shadow-md cursor-pointer"
                          : "cursor-default opacity-95"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-display font-semibold text-navy leading-snug line-clamp-2">
                            {p.name}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                              {inst?.display_name || inst?.name || "—"}
                            </span>
                          </p>
                        </div>
                        {p.pgwp_eligible === "yes" && (
                          <Badge className="shrink-0 bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0 gap-1">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            PGWP
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {p.campus_city && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {p.campus_city}
                          </span>
                        )}
                        {p.credential && (
                          <span className="inline-flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {p.credential}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto pt-3 border-t border-border/60 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Briefcase className="h-3.5 w-3.5" />
                            {T("Salário", "Salary")}
                          </span>
                          {complete && occ ? (
                            <span className="font-medium text-navy">
                              {occ.salary_low && occ.salary_high
                                ? `${occ.salary_low} – ${occ.salary_high}`
                                : occ.salary_median || occ.salary_low || occ.salary_high}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">
                              {T("Detalhes em breve", "Details coming soon")}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-1.5">
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <TrendingUp className="h-3.5 w-3.5" />
                            {T("Perspectiva", "Outlook")}
                          </span>
                          {complete && out ? (
                            <span className={`px-2 py-0.5 rounded-full font-medium ${out.className}`}>
                              {out.label}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">
                              {T("Detalhes em breve", "Details coming soon")}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <p className="text-center text-muted-foreground py-16 text-sm">
                  {T("Nenhum programa encontrado com esses filtros.", "No programs match these filters.")}
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <DialogTitle className="font-display text-2xl text-navy">
                      {selected.name}
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-base">
                      {selected.institutions?.display_name || selected.institutions?.name}
                      {selected.campus_city ? ` · ${selected.campus_city}` : ""}
                    </DialogDescription>
                  </div>
                  {selected.pgwp_eligible === "yes" && (
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0 gap-1">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      PGWP
                    </Badge>
                  )}
                </div>
              </DialogHeader>

              <div className="mt-4 space-y-6 text-sm">
                <div className="grid gap-3 sm:grid-cols-3">
                  {selected.credential && (
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {T("Credencial", "Credential")}
                      </p>
                      <p className="font-medium text-navy mt-0.5">{selected.credential}</p>
                    </div>
                  )}
                  {selected.duration_months && (
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {T("Duração", "Duration")}
                      </p>
                      <p className="font-medium text-navy mt-0.5">
                        {selected.duration_months} {T("meses", "months")}
                      </p>
                    </div>
                  )}
                  {selected.tuition_intl_year && (
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {T("Anuidade internacional", "International tuition / year")}
                      </p>
                      <p className="font-medium text-navy mt-0.5">{selected.tuition_intl_year}</p>
                    </div>
                  )}
                </div>

                {(selected.min_grade || selected.prerequisites) && (
                  <div>
                    <h4 className="font-display font-semibold text-navy mb-2">
                      {T("Requisitos de admissão", "Admission requirements")}
                    </h4>
                    {selected.min_grade && (
                      <p className="mb-2 leading-relaxed">
                        <span className="font-medium">{T("Nota mínima: ", "Minimum grade: ")}</span>
                        {selected.min_grade}
                      </p>
                    )}
                    {selected.prerequisites && (
                      <p className="leading-relaxed text-muted-foreground">{selected.prerequisites}</p>
                    )}
                  </div>
                )}

                {formatEnglishTests(selected.english_admission_tests).length > 0 && (
                  <div>
                    <h4 className="font-display font-semibold text-navy mb-2">
                      {T("Testes de inglês aceitos", "Accepted English tests")}
                    </h4>
                    <ul className="space-y-1">
                      {formatEnglishTests(selected.english_admission_tests).map((line) => (
                        <li key={line} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selected.pgwp_eligible && (
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
                    <div className="flex items-center gap-2 font-medium text-emerald-900">
                      <ShieldCheck className="h-4 w-4" />
                      {T("Elegibilidade PGWP", "PGWP eligibility")}: {selected.pgwp_eligible}
                    </div>
                    {selected.pgwp_basis && (
                      <p className="mt-1 text-sm text-emerald-900/80">{selected.pgwp_basis}</p>
                    )}
                  </div>
                )}

                {selectedOccupations.length > 0 && (
                  <div>
                    <h4 className="font-display font-semibold text-navy mb-2">
                      {T("Mercado de trabalho", "Labour market")}
                    </h4>
                    <div className="space-y-2">
                      {selectedOccupations.map((o) => {
                        const out = outlookMeta(o.outlook, lang);
                        return (
                          <div
                            key={o.id}
                            className="rounded-lg border border-border p-3 flex flex-wrap items-center justify-between gap-2"
                          >
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
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${out.className}`}>
                                {out.label}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {selected.application_url && (
                    <Button asChild className="bg-crimson hover:bg-crimson/90 text-white">
                      <a href={selected.application_url} target="_blank" rel="noopener noreferrer">
                        {T("Aplicar no site oficial", "Apply on official site")}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {selected.intl_office_url && (
                    <Button asChild variant="outline">
                      <a href={selected.intl_office_url} target="_blank" rel="noopener noreferrer">
                        {T("Escritório internacional", "International office")}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>

                <div className="rounded-lg bg-muted/60 border border-border p-3 flex items-start gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    {T(
                      "Informação verificada em fonte oficial — não confirma seu caso de imigração.",
                      "Information verified against official sources — does not confirm your immigration case."
                    )}
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
