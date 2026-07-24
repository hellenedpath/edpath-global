import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, MapPin, Check, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
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
        eyebrow: "Canada · English schools",
        title: "English schools in Canada",
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
      }
    : {
        eyebrow: "Canadá · Escolas de inglês",
        title: "Escolas de inglês no Canadá",
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
      };

  return (
    <div className="min-h-screen bg-background">
      {/* Header — editorial */}
      <header className="border-b border-border">
        <div className="container max-w-5xl py-14 md:py-20">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {L.eyebrow}
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl font-bold text-navy tracking-tight leading-[1.05]">
            {L.title}
          </h1>
          <p className="mt-5 max-w-[640px] text-base md:text-lg text-muted-foreground leading-relaxed">
            {L.intro}
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            <span className="font-semibold text-navy">{totalSchools}</span>{" "}
            {L.statSchools} ·{" "}
            <span className="font-semibold text-navy">{totalProvinces}</span>{" "}
            {L.statProvinces} ·{" "}
            <span className="font-semibold text-navy">{totalAccredited}</span>{" "}
            {L.statAccredited}
          </p>
        </div>
      </header>

      {/* Work warning — hairline rule */}
      <section className="border-b border-border">
        <div className="container max-w-5xl py-6">
          <div className="border-l-2 border-[hsl(var(--crimson))] pl-4">
            <p className="text-sm font-semibold text-navy">{L.warnTitle}</p>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              {L.warnBody}
            </p>
          </div>
        </div>
      </section>

      {/* Filters — sticky, plain */}
      <section className="sticky top-[7.5rem] z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container max-w-5xl py-3 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="md:w-56">
            <Select value={province} onValueChange={setProvince}>
              <SelectTrigger className="bg-background border-border">
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
              className="pl-9 bg-background border-border"
            />
          </div>
          <div className="shrink-0 text-sm text-muted-foreground md:ml-2">
            <span className="font-semibold text-navy">{filtered.length}</span>{" "}
            {L.resultsCount}
          </div>
        </div>
      </section>

      {/* List */}
      <section className="container max-w-5xl py-12 md:py-16">
        {loading ? (
          <p className="py-24 text-center text-sm text-muted-foreground">
            {L.loading}
          </p>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-xl font-semibold text-navy">
              {L.empty}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{L.emptyHint}</p>
          </div>
        ) : (
          <div className="space-y-20">
            {grouped.map(([prov, schools]) => (
              <div key={prov}>
                <div className="flex items-baseline gap-3 border-b border-border pb-3">
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-navy tracking-tight">
                    {prov}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {schools.length}
                  </span>
                </div>
                <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-x-10 md:gap-y-10">
                  {schools.map((s) => (
                    <SchoolRow key={s.id} school={s} L={L} isEN={isEN} />
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm text-navy leading-snug">{value}</div>
    </div>
  );
}

function SchoolRow({
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
    <article className="group border border-border rounded-sm p-6 transition-colors hover:border-navy/40">
      <header>
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-lg md:text-xl font-bold text-navy leading-snug tracking-tight">
            {school.display_name || school.name}
          </h3>
          {school.languages_canada && (
            <span
              className="shrink-0 inline-flex items-center gap-1 text-[11px] font-medium text-[hsl(38_75%_32%)]"
              title={L.languagesCanada}
            >
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              {L.languagesCanada}
            </span>
          )}
        </div>
        {school.city && (
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {school.city}
          </p>
        )}
      </header>

      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
        {!isEmpty(school.cost_per_week) && (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {L.costPerWeek}
            </div>
            <div className="mt-1 text-sm font-semibold text-navy leading-snug">
              {school.cost_per_week}
            </div>
          </div>
        )}
        {!isEmpty(school.exam_prep) && (
          <Field label={L.examPrep} value={school.exam_prep as string} />
        )}
        {!isEmpty(school.pathway) && (
          <Field label={L.pathway} value={school.pathway as string} />
        )}
        {!isEmpty(school.min_age) && (
          <Field label={L.minAge} value={school.min_age as string} />
        )}
      </div>

      {!isEmpty(school.course_types) && (
        <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
          <span className="text-navy">{L.courseTypes}:</span> {school.course_types}
        </p>
      )}

      {(!isEmpty(notes) || !isEmpty(school.can_work)) && (
        <div className="mt-4 space-y-1.5 text-xs text-muted-foreground leading-relaxed">
          {!isEmpty(notes) && (
            <p>
              <span className="font-semibold text-navy">{L.notes}:</span> {notes}
            </p>
          )}
          {!isEmpty(school.can_work) && (
            <p>
              <span className="font-semibold text-navy">{L.canWork}:</span>{" "}
              {school.can_work}
            </p>
          )}
        </div>
      )}

      {(school.website || school.application_url) && (
        <div className="mt-6 pt-5 border-t border-border flex flex-wrap items-center gap-x-6 gap-y-3">
          {school.application_url && (
            <a
              href={school.application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--crimson))] hover:gap-2.5 transition-all"
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
              className="text-sm text-navy hover:underline underline-offset-4"
            >
              {L.website}
            </a>
          )}
        </div>
      )}
    </article>
  );
}