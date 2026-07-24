import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  ExternalLink,
  AlertTriangle,
  GraduationCap,
  MapPin,
  Coins,
  FileCheck,
  Milestone,
  Users,
  Info,
  BadgeCheck,
  Building2,
  Globe2,
  Sparkles,
  Loader2,
  SearchX,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        title: "English schools in Canada",
        intro:
          "Language schools in Canada — many are accredited by Languages Canada. EdPath shows neutral, honest information so you can compare and decide.",
        warnTitle: "Important: an English course alone does not grant work rights",
        warnBody:
          "Taking an English course by itself does not give you the right to work in Canada. Work rights only start when you enroll in an eligible post-secondary DLI program.",
        allProvinces: "All provinces",
        searchPh: "Search by name or city",
        cityLabel: "City",
        courseTypes: "Courses",
        costPerWeek: "Cost per week",
        examPrep: "Exam preparation",
        pathway: "Pathway / bridge to college",
        minAge: "Minimum age",
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
      }
    : {
        title: "Escolas de inglês no Canadá",
        intro:
          "Escolas de idioma no Canadá — muitas são credenciadas pela Languages Canada. A EdPath mostra informação neutra e honesta para você comparar e decidir.",
        warnTitle:
          "Importante: um curso de inglês, sozinho, não dá direito a trabalhar",
        warnBody:
          "Um curso de inglês, por si só, não dá direito a trabalhar no Canadá. O direito a trabalho surge só ao ingressar em um programa elegível de DLI pós-secundário.",
        allProvinces: "Todas as províncias",
        searchPh: "Buscar por nome ou cidade",
        cityLabel: "Cidade",
        courseTypes: "Cursos",
        costPerWeek: "Custo por semana",
        examPrep: "Preparação para exames",
        pathway: "Pathway / ponte para college",
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
        statAccredited: "credenciadas pela Languages Canada",
        resultsCount: "escolas",
        emptyHint: "Tente limpar os filtros ou buscar outra cidade.",
      };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(160deg, hsl(var(--navy)) 0%, hsl(var(--azul)) 55%, hsl(var(--background)) 100%)",
          }}
        />
        <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.08]" style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, white 1px, transparent 1.5px), radial-gradient(circle at 70% 60%, white 1px, transparent 1.5px)",
          backgroundSize: "36px 36px, 52px 52px",
        }} />
        <div className="container py-14 md:py-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/90 ring-1 ring-white/25">
            <GraduationCap className="h-3.5 w-3.5" />
            Canada
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold text-white leading-[1.05] max-w-4xl">
            {L.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base md:text-lg text-white/85">
            {L.intro}
          </p>

          {/* Stat chips */}
          <div className="mt-8 flex flex-wrap gap-3">
            <StatChip
              icon={<Building2 className="h-4 w-4" />}
              value={totalSchools}
              label={L.statSchools}
              tone="white"
            />
            <StatChip
              icon={<Globe2 className="h-4 w-4" />}
              value={totalProvinces}
              label={L.statProvinces}
              tone="white"
            />
            <StatChip
              icon={<BadgeCheck className="h-4 w-4" />}
              value={totalAccredited}
              label={L.statAccredited}
              tone="gold"
            />
          </div>
        </div>
      </section>

      {/* Warning */}
      <section className="container -mt-6 md:-mt-8 relative z-10">
        <div className="flex gap-3 rounded-2xl border-l-4 border-[hsl(var(--crimson))] bg-[hsl(var(--crimson))]/8 backdrop-blur ring-1 ring-[hsl(var(--crimson))]/20 shadow-lg p-4 md:p-5">
          <AlertTriangle className="h-5 w-5 shrink-0 text-[hsl(var(--crimson))]" />
          <div>
            <p className="font-semibold text-navy">{L.warnTitle}</p>
            <p className="mt-1 text-sm text-muted-foreground">{L.warnBody}</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-gradient-to-b from-[hsl(var(--azul))]/5 to-background sticky top-[7.5rem] z-30 backdrop-blur mt-8">
        <div className="container py-4 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="md:w-64">
            <Select value={province} onValueChange={setProvince}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{L.allProvinces}</SelectItem>
                {provinces.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={L.searchPh}
              className="pl-9 bg-background"
            />
          </div>
          <div className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-navy/5 px-3 py-1.5 text-xs font-semibold text-navy">
            <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--azul))]" />
            {filtered.length} {L.resultsCount}
          </div>
        </div>
      </section>

      {/* List */}
      <section className="container py-8 md:py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--azul))]" />
            <p className="mt-3 text-sm">{L.loading}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="rounded-full bg-muted p-4">
              <SearchX className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mt-4 font-display text-lg font-semibold text-navy">{L.empty}</p>
            <p className="mt-1 text-sm text-muted-foreground">{L.emptyHint}</p>
          </div>
        ) : (
          <div className="space-y-14">
            {grouped.map(([prov, schools]) => (
              <div key={prov}>
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--azul))]/10 text-[hsl(var(--azul))]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-navy">
                      {prov}
                    </h2>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold text-navy">
                    {schools.length} {L.resultsCount}
                  </span>
                </div>
                <div
                  aria-hidden
                  className="mb-6 h-[3px] w-full rounded-full bg-gradient-to-r from-[hsl(var(--azul))]/40 via-[hsl(var(--crimson))]/30 to-transparent"
                />
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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

function StatChip({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  tone: "white" | "gold";
}) {
  const toneCls =
    tone === "gold"
      ? "bg-[hsl(var(--amber))]/15 text-white ring-[hsl(var(--amber))]/50"
      : "bg-white/12 text-white ring-white/25";
  return (
    <div
      className={`inline-flex items-center gap-2.5 rounded-2xl px-4 py-2.5 ring-1 backdrop-blur ${toneCls}`}
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
        {icon}
      </span>
      <span className="font-display text-lg font-bold leading-none">{value}</span>
      <span className="text-xs text-white/85">{label}</span>
    </div>
  );
}

function Chip({
  icon,
  label,
  value,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "default" | "gold";
}) {
  const toneCls =
    tone === "gold"
      ? "bg-[hsl(var(--amber))]/12 ring-[hsl(var(--amber))]/30 text-navy"
      : "bg-muted/60 ring-border text-navy";
  const iconTone =
    tone === "gold" ? "text-[hsl(var(--amber))]" : "text-[hsl(var(--azul))]";
  return (
    <div className={`flex items-start gap-2.5 rounded-xl ring-1 px-3 py-2 ${toneCls}`}>
      <span className={`mt-0.5 shrink-0 ${iconTone}`}>{icon}</span>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="text-sm font-medium leading-snug break-words">{value}</div>
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

  return (
    <article className="group flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[hsl(var(--azul))]/50">
      <header className="mb-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold text-navy leading-snug">
            {school.display_name || school.name}
          </h3>
          {school.languages_canada && (
            <span
              className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[hsl(var(--amber))]/15 px-2.5 py-1 text-[11px] font-semibold text-[hsl(38_92%_30%)] ring-1 ring-[hsl(var(--amber))]/40"
              title={L.languagesCanada}
            >
              <BadgeCheck className="h-3.5 w-3.5" />
              {L.languagesCanada}
            </span>
          )}
        </div>
        {school.city && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-[hsl(var(--azul))]" />
            {school.city}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 gap-2">
        {!isEmpty(school.cost_per_week) && (
          <Chip
            tone="gold"
            icon={<Coins className="h-4 w-4" />}
            label={L.costPerWeek}
            value={school.cost_per_week as string}
          />
        )}
        {!isEmpty(school.exam_prep) && (
          <Chip
            icon={<FileCheck className="h-4 w-4" />}
            label={L.examPrep}
            value={school.exam_prep as string}
          />
        )}
        {!isEmpty(school.pathway) && (
          <Chip
            icon={<Milestone className="h-4 w-4" />}
            label={L.pathway}
            value={school.pathway as string}
          />
        )}
        {!isEmpty(school.min_age) && (
          <Chip
            icon={<Users className="h-4 w-4" />}
            label={L.minAge}
            value={school.min_age as string}
          />
        )}
      </div>

      {!isEmpty(school.course_types) && (
        <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-navy">{L.courseTypes}:</span>{" "}
          {school.course_types}
        </p>
      )}

      {!isEmpty(notes) && (
        <div className="mt-4 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-navy">{L.notes}:</span> {notes}
        </div>
      )}

      {!isEmpty(school.can_work) && (
        <p className="mt-3 inline-flex items-start gap-1.5 text-xs text-muted-foreground italic">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[hsl(var(--azul))]" />
          <span>
            <span className="font-semibold not-italic text-navy">{L.canWork}:</span>{" "}
            {school.can_work}
          </span>
        </p>
      )}

      {(school.website || school.application_url) && (
        <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-border/70">
          {school.website && (
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <a href={school.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                {L.website}
              </a>
            </Button>
          )}
          {school.application_url && (
            <Button
              asChild
              size="sm"
              className="gap-1.5 bg-[hsl(var(--crimson))] hover:bg-[hsl(var(--crimson))]/90 text-white shadow-[0_6px_18px_-6px_hsl(var(--crimson)/0.6)]"
            >
              <a
                href={school.application_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {L.apply}
              </a>
            </Button>
          )}
        </div>
      )}
    </article>
  );
}