import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, ExternalLink, Award, AlertTriangle, GraduationCap } from "lucide-react";
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
      };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-b from-muted/40 to-background">
        <div className="container py-10 md:py-14">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
            <GraduationCap className="h-4 w-4 text-navy" />
            Canada
          </div>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold text-navy leading-tight">
            {L.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base md:text-lg text-muted-foreground">
            {L.intro}
          </p>

          {/* Warning */}
          <div className="mt-6 flex gap-3 rounded-2xl border border-[hsl(var(--crimson))]/30 bg-[hsl(var(--crimson))]/5 p-4 md:p-5">
            <AlertTriangle className="h-5 w-5 shrink-0 text-[hsl(var(--crimson))]" />
            <div>
              <p className="font-semibold text-navy">{L.warnTitle}</p>
              <p className="mt-1 text-sm text-muted-foreground">{L.warnBody}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-background sticky top-[7.5rem] z-30">
        <div className="container py-4 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="md:w-64">
            <Select value={province} onValueChange={setProvince}>
              <SelectTrigger>
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
              className="pl-9"
            />
          </div>
        </div>
      </section>

      {/* List */}
      <section className="container py-8 md:py-12">
        {loading ? (
          <p className="text-muted-foreground">{L.loading}</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground">{L.empty}</p>
        ) : (
          <div className="space-y-12">
            {grouped.map(([prov, schools]) => (
              <div key={prov}>
                <div className="mb-4 flex items-baseline justify-between border-b border-border pb-2">
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-navy">
                    {prov}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {schools.length}
                  </span>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
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

function SchoolCard({
  school,
  L,
  isEN,
}: {
  school: EnglishSchool;
  L: Record<string, string>;
  isEN: boolean;
}) {
  const notes = isEN ? school.notes_en ?? school.notes_pt : school.notes_pt ?? school.notes_en;
  const rows: { label: string; value: string | null }[] = [
    { label: L.courseTypes, value: school.course_types },
    { label: L.costPerWeek, value: school.cost_per_week },
    { label: L.examPrep, value: school.exam_prep },
    { label: L.pathway, value: school.pathway },
    { label: L.minAge, value: isEmpty(school.min_age) ? null : school.min_age },
  ];

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
      <header className="mb-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold text-navy leading-snug">
            {school.display_name || school.name}
          </h3>
          {school.languages_canada && (
            <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-navy/10 px-2 py-0.5 text-[11px] font-semibold text-navy">
              <Award className="h-3 w-3" />
              {L.languagesCanada}
            </span>
          )}
        </div>
        {school.city && (
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{L.cityLabel}:</span>{" "}
            {school.city}
          </p>
        )}
      </header>

      <dl className="space-y-2 text-sm">
        {rows
          .filter((r) => !isEmpty(r.value))
          .map((r) => (
            <div key={r.label}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {r.label}
              </dt>
              <dd className="text-foreground">{r.value}</dd>
            </div>
          ))}
      </dl>

      {!isEmpty(school.can_work) && (
        <p className="mt-3 text-xs text-muted-foreground italic">
          <span className="font-semibold not-italic">{L.canWork}:</span>{" "}
          {school.can_work}
        </p>
      )}

      {!isEmpty(notes) && (
        <p className="mt-3 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{L.notes}:</span> {notes}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {school.website && (
          <Button asChild variant="outline" size="sm">
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
            className="bg-[hsl(var(--crimson))] hover:bg-[hsl(var(--crimson))]/90 text-white"
          >
            <a
              href={school.application_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {L.apply}
            </a>
          </Button>
        )}
      </div>
    </article>
  );
}