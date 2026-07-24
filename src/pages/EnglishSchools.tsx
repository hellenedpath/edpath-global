import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  SearchX,
  MapPin,
  Check,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Coins,
  FileCheck,
  Route,
  UserRound,
  Info,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EnglishSchool = {
  id: string;
  name: string;
  display_name: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  website: string | null;
  application_url: string | null;
  languages_canada: boolean | null;
  course_types: string | null;
  cost_per_week: string | null;
  exam_prep: string | null;
  pathway: string | null;
  can_work: string | null;
  min_age: string | null;
  email: string | null;
  phone: string | null;
  notes_pt: string | null;
  notes_en: string | null;
};

const isEmpty = (v: string | null | undefined) =>
  !v || v.trim() === "" || v.trim() === "—";

const DOT_COLORS = [
  "hsl(var(--azul))",
  "hsl(var(--crimson))",
  "hsl(var(--azul))",
];

// Soft blue-gray for secondary text (never black/near-black)
const MUTED = "text-[#4a5578]";

export default function EnglishSchools() {
  const { i18n } = useTranslation();
  const isEN = i18n.language.startsWith("en");
  const [items, setItems] = useState<EnglishSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [province, setProvince] = useState<string>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("english_schools")
        .select("*")
        .order("province")
        .order("city")
        .order("name");
      if (!error && data) setItems(data as EnglishSchool[]);
      setLoading(false);
    })();
  }, []);

  const provinces = useMemo(
    () =>
      Array.from(new Set(items.map((s) => s.province).filter(Boolean))) as string[],
    [items],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((s) => {
      if (province !== "all" && s.province !== province) return false;
      if (!q) return true;
      return (
        (s.name ?? "").toLowerCase().includes(q) ||
        (s.city ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, province, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, EnglishSchool[]>();
    for (const s of filtered) {
      const key = s.province ?? "—";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const totalSchools = items.length;
  const totalProvinces = useMemo(
    () => new Set(items.map((s) => s.province).filter(Boolean)).size,
    [items],
  );
  const totalAccredited = useMemo(
    () => items.filter((s) => s.languages_canada).length,
    [items],
  );

  const L = isEN
    ? {
        eyebrow: "Canada · English schools",
        titleLead: "Learn English in Canada with ",
        titleAccent: "honest information",
        titleTail: ".",
        intro:
          "Language schools in Canada — many accredited by Languages Canada. Neutral, honest information to compare and decide.",
        warnTitle: "Important: an English course alone does not grant work rights",
        warnBody:
          "Taking an English course by itself does not give you the right to work in Canada. Work rights only start when you enroll in an eligible post-secondary DLI program.",
        allProvinces: "All provinces",
        searchPh: "Search by name or city",
        courseTypes: "Courses",
        costPerWeek: "Cost / week",
        examPrep: "Exam prep",
        pathway: "Pathway",
        minAge: "Min. age",
        canWork: "Work",
        notes: "Notes",
        website: "Official website",
        apply: "How to apply",
        loading: "Loading…",
        empty: "No schools match your filters.",
        languagesCanada: "Languages Canada",
        statSchools: "schools",
        statProvinces: "provinces",
        statAccredited: "accredited by Languages Canada",
        resultsCount: "schools",
        emptyHint: "Try clearing the filters or searching another city.",
        ctaSee: "See schools",
        ctaHow: "How it works",
        trust1: "Zero commission",
        trust2: "Official sources",
        trust3: "Built by people who lived it",
        chip1: "from $375/wk",
        chip2: "Languages Canada",
        chip3: "Bridge to college",
        previewCostLabel: "Cost / week",
        previewExamLabel: "Exam prep",
        previewPathwayLabel: "Pathway",
        previewPathwayValue: "No IELTS",
        statZero: "commission charged",
        statAccreditedShort: "Languages Canada",
        statProvincesShort: "provinces",
        statSchoolsShort: "schools",
      }
    : {
        eyebrow: "Canadá · Escolas de inglês",
        titleLead: "Aprenda inglês no Canadá com ",
        titleAccent: "informação honesta",
        titleTail: ".",
        intro:
          "Escolas de idioma no Canadá — muitas credenciadas pela Languages Canada. Informação neutra e honesta para comparar e decidir.",
        warnTitle:
          "Importante: um curso de inglês, sozinho, não dá direito a trabalhar",
        warnBody:
          "Um curso de inglês, por si só, não dá direito a trabalhar no Canadá. O direito a trabalho surge só ao ingressar em um programa elegível de DLI pós-secundário.",
        allProvinces: "Todas as províncias",
        searchPh: "Buscar por nome ou cidade",
        courseTypes: "Cursos",
        costPerWeek: "Custo / semana",
        examPrep: "Preparação p/ exames",
        pathway: "Pathway",
        minAge: "Idade mínima",
        canWork: "Trabalho",
        notes: "Observação",
        website: "Site oficial",
        apply: "Como aplicar",
        loading: "Carregando…",
        empty: "Nenhuma escola encontrada com esses filtros.",
        languagesCanada: "Languages Canada",
        statSchools: "escolas",
        statProvinces: "províncias",
        statAccredited: "credenciadas Languages Canada",
        resultsCount: "escolas",
        emptyHint: "Tente limpar os filtros ou buscar outra cidade.",
        ctaSee: "Ver escolas",
        ctaHow: "Como funciona",
        trust1: "Comissão-zero",
        trust2: "Fontes oficiais",
        trust3: "Feito por quem viveu isso",
        chip1: "a partir de $375/sem",
        chip2: "Languages Canada",
        chip3: "Ponte pro college",
        previewCostLabel: "Custo / semana",
        previewExamLabel: "Preparação p/ exames",
        previewPathwayLabel: "Pathway",
        previewPathwayValue: "Sem IELTS",
        statZero: "comissão cobrada",
        statAccreditedShort: "Languages Canada",
        statProvincesShort: "províncias",
        statSchoolsShort: "escolas",
      };

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--azul)/0.06)] via-background to-background"
        />
        <div className="container max-w-6xl relative py-14 md:py-20">
          <div className="grid gap-10 md:gap-14 md:grid-cols-[1.1fr_1fr] items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--azul)/0.1)] px-3 py-1 text-xs font-semibold text-[hsl(var(--azul))]">
                <MapPin className="h-3.5 w-3.5" />
                {L.eyebrow}
              </span>
              <h1 className="mt-5 font-display text-4xl md:text-5xl lg:text-6xl font-bold text-navy tracking-tight leading-[1.05]">
                {L.titleLead}
                <span className="text-[hsl(var(--crimson))]">{L.titleAccent}</span>
                {L.titleTail}
              </h1>
              <p className="mt-5 max-w-[560px] text-base md:text-lg text-muted-foreground leading-relaxed">
                {L.intro}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-[hsl(var(--azul))] hover:bg-[hsl(var(--azul)/0.9)] text-white rounded-full px-6"
                  onClick={() =>
                    document
                      .getElementById("schools-list")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {L.ctaSee}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-6 border-navy/20 text-navy hover:bg-navy/5"
                  onClick={() =>
                    document
                      .getElementById("warn")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {L.ctaHow}
                </Button>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {[L.trust1, L.trust2, L.trust3].map((t) => (
                  <li key={t} className="inline-flex items-center gap-1.5">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--azul)/0.12)]">
                      <Check className="h-3 w-3 text-[hsl(var(--azul))]" strokeWidth={3} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Product preview */}
            <div className="relative flex justify-center md:justify-end">
              <div
                aria-hidden
                className="absolute inset-0 -z-10 blur-3xl opacity-80"
                style={{
                  background:
                    "radial-gradient(closest-side, hsl(var(--azul)/0.30), transparent 70%)",
                }}
              />
              <ProductPreview L={L} />
            </div>
          </div>
        </div>
      </header>

      {/* STAT BAND */}
      <section className="border-y border-border bg-background">
        <div className="container max-w-6xl py-8 md:py-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          <Stat value={totalSchools} label={L.statSchoolsShort} tone="navy" />
          <Stat value={totalProvinces} label={L.statProvincesShort} tone="azul" />
          <Stat value={totalAccredited} label={L.statAccreditedShort} tone="crimson" />
          <Stat value={0} label={L.statZero} tone="navy" />
        </div>
      </section>

      {/* WARN */}
      <section id="warn" className="container max-w-6xl pt-10 md:pt-14">
        <div className="rounded-2xl border border-[hsl(var(--amber)/0.35)] bg-[hsl(var(--amber)/0.08)] p-5 md:p-6 flex gap-4">
          <div className="shrink-0 h-10 w-10 rounded-xl bg-[hsl(var(--amber)/0.2)] inline-flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-[hsl(38_92%_35%)]" />
          </div>
          <div>
            <p className="font-semibold text-navy">{L.warnTitle}</p>
            <p className="mt-1 text-sm md:text-base text-muted-foreground leading-relaxed">
              {L.warnBody}
            </p>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section
        id="schools-list"
        className="sticky top-[7.5rem] z-30 mt-10 border-y border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      >
        <div className="container max-w-6xl py-4 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="flex flex-wrap gap-2 flex-1">
            <ProvincePill
              active={province === "all"}
              onClick={() => setProvince("all")}
            >
              {L.allProvinces}
            </ProvincePill>
            {provinces.map((p) => (
              <ProvincePill
                key={p}
                active={province === p}
                onClick={() => setProvince(p)}
              >
                {p}
              </ProvincePill>
            ))}
          </div>
          <div className="flex items-center gap-3 md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={L.searchPh}
                className="pl-9 rounded-full bg-background border-border"
              />
            </div>
            <div className="shrink-0 text-sm text-muted-foreground whitespace-nowrap">
              <span className="font-bold text-navy">{filtered.length}</span>{" "}
              {L.resultsCount}
            </div>
          </div>
        </div>
      </section>

      {/* LIST */}
      <section className="container max-w-6xl py-12 md:py-16">
        {loading ? (
          <div className="py-24 text-center">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted/60 animate-pulse">
              <SearchX className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{L.loading}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted/60">
              <SearchX className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="mt-6 font-display text-xl font-bold text-navy">
              {L.empty}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{L.emptyHint}</p>
          </div>
        ) : (
          <div className="space-y-16">
            {grouped.map(([prov, schools], idx) => (
              <div key={prov}>
                <div className="flex items-baseline gap-3">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ background: DOT_COLORS[idx % DOT_COLORS.length] }}
                  />
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-navy tracking-tight">
                    {prov}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    · {schools.length} {L.statSchoolsShort}
                  </span>
                </div>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {schools.map((s) => (
                    <SchoolCard key={s.id} school={s} L={L} isEN={isEN} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ---------- Reusable pieces ---------- */

function ProductPreview({ L }: { L: Record<string, string> }) {
  return (
    <div
      className="relative w-full max-w-[420px] rounded-[22px] border border-border bg-card p-6 shadow-[0_24px_50px_-30px_rgba(5,21,86,0.35)] transition-transform duration-500 hover:-translate-y-1"
      style={{ transform: "rotate(1.5deg)" }}
    >
      <header>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold text-navy leading-tight">
            ILAC — International Language Academy
          </h3>
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[hsl(var(--azul)/0.12)] px-2.5 py-1 text-[11px] font-semibold text-[hsl(var(--azul))]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Languages Canada
          </span>
        </div>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          Toronto
        </p>
      </header>

      <div className="mt-5 space-y-3">
        <PreviewRow
          icon={<Coins className="h-4 w-4 text-[hsl(var(--crimson))]" />}
          bg="bg-[hsl(var(--crimson)/0.1)]"
          label={L.previewCostLabel}
          value="$375–430"
          valueClass="font-bold text-[hsl(var(--crimson))]"
        />
        <PreviewRow
          icon={<FileCheck className="h-4 w-4 text-[hsl(var(--azul))]" />}
          bg="bg-[hsl(var(--azul)/0.1)]"
          label={L.previewExamLabel}
          value="IELTS · Cambridge"
        />
        <PreviewRow
          icon={<ArrowUpRight className="h-4 w-4 text-navy" />}
          bg="bg-navy/10"
          label={L.previewPathwayLabel}
          value={L.previewPathwayValue}
        />
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <button
          type="button"
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[hsl(var(--crimson))] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {L.apply}
        </button>
      </div>
    </div>
  );
}

function PreviewRow({
  icon,
  bg,
  label,
  value,
  valueClass,
}: {
  icon: React.ReactNode;
  bg: string;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", bg)}>
        {icon}
      </span>
      <div className="flex flex-1 items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className={cn("text-sm font-bold text-navy", valueClass)}>{value}</span>
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  tone,
}: {
  value: number | string;
  label: string;
  tone: "navy" | "azul" | "crimson";
}) {
  const color =
    tone === "azul"
      ? "text-[hsl(var(--azul))]"
      : tone === "crimson"
      ? "text-[hsl(var(--crimson))]"
      : "text-navy";
  return (
    <div>
      <div className={cn("font-display font-bold text-4xl md:text-5xl leading-none", color)}>
        {value}
      </div>
      <div className="mt-2 text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function ProvincePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-navy text-white border-navy"
          : "bg-background text-navy border-border hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

function Fact({
  icon,
  tint,
  label,
  value,
  valueClass,
}: {
  icon: React.ReactNode;
  tint: "azul" | "crimson" | "navy" | "muted";
  label: string;
  value: string;
  valueClass?: string;
}) {
  const bg =
    tint === "azul"
      ? "bg-[hsl(var(--azul)/0.1)]"
      : tint === "crimson"
      ? "bg-[hsl(var(--crimson)/0.1)]"
      : tint === "navy"
      ? "bg-navy/10"
      : "bg-muted";
  return (
    <div className="flex items-start gap-3">
      <span className={cn("shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-lg", bg)}>
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </div>
        <div className={cn("mt-0.5 text-sm text-navy leading-snug break-words", valueClass)}>
          {value}
        </div>
      </div>
    </div>
  );
}

function SchoolCard({
  school,
  L,
  isEN,
}: {
  school: EnglishSchool;
  L: Record<string, string>;
  isEN: boolean;
}) {
  const notes = isEN
    ? school.notes_en ?? school.notes_pt
    : school.notes_pt ?? school.notes_en;

  const tags = !isEmpty(school.course_types)
    ? (school.course_types as string)
        .split(/[·,;/|]/)
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 5)
    : [];

  return (
    <article className="group flex flex-col rounded-[20px] border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--azul)/0.5)] hover:shadow-[0_16px_40px_-16px_hsl(var(--azul)/0.35)]">
      <header>
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-[20px] md:text-[21px] font-bold text-navy leading-snug tracking-tight">
            {school.display_name || school.name}
          </h3>
          {school.languages_canada && (
            <span
              className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[hsl(var(--azul)/0.1)] px-2.5 py-1 text-[11px] font-semibold text-[hsl(var(--azul))]"
              title={L.languagesCanada}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              {L.languagesCanada}
            </span>
          )}
        </div>
        {school.city && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {school.city}
          </p>
        )}
      </header>

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((t, i) => (
            <span
              key={i}
              className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-navy"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
        {!isEmpty(school.cost_per_week) && (
          <Fact
            icon={<Coins className="h-4 w-4 text-[hsl(var(--crimson))]" />}
            tint="crimson"
            label={L.costPerWeek}
            value={school.cost_per_week as string}
            valueClass="font-bold text-[hsl(var(--crimson))]"
          />
        )}
        {!isEmpty(school.exam_prep) && (
          <Fact
            icon={<FileCheck className="h-4 w-4 text-[hsl(var(--azul))]" />}
            tint="azul"
            label={L.examPrep}
            value={school.exam_prep as string}
          />
        )}
        {!isEmpty(school.pathway) && (
          <Fact
            icon={<Route className="h-4 w-4 text-navy" />}
            tint="navy"
            label={L.pathway}
            value={school.pathway as string}
          />
        )}
        {!isEmpty(school.min_age) && (
          <Fact
            icon={<UserRound className="h-4 w-4 text-muted-foreground" />}
            tint="muted"
            label={L.minAge}
            value={school.min_age as string}
          />
        )}
      </div>

      {(!isEmpty(notes) || !isEmpty(school.can_work)) && (
        <div className="mt-5 space-y-2 text-xs text-muted-foreground leading-relaxed">
          {!isEmpty(notes) && (
            <p className="flex gap-2">
              <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>
                <span className="font-semibold text-navy">{L.notes}:</span> {notes}
              </span>
            </p>
          )}
          {!isEmpty(school.can_work) && (
            <p className="flex gap-2">
              <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>
                <span className="font-semibold text-navy">{L.canWork}:</span>{" "}
                {school.can_work}
              </span>
            </p>
          )}
        </div>
      )}

      {(school.website || school.application_url) && (
        <div className="mt-6 pt-5 border-t border-border flex flex-wrap items-center gap-3 mt-auto">
          {school.application_url && (
            <a
              href={school.application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--crimson))] px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              {L.apply}
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          )}
          {school.website && (
            <a
              href={school.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-navy hover:bg-muted"
            >
              {L.website}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      )}
    </article>
  );
}