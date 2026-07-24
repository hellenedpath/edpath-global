import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  SearchX,
  MapPin,
  ArrowRight,
  AlertTriangle,
  BookOpen,
  GraduationCap,
  Building2,
  Map as MapIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useReveal } from "@/hooks/use-reveal";

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
  !v || v.trim() === "" || v.trim() === "-" || v.trim() === "—";

function cleanCost(raw: string | null | undefined, L: Record<string, string>): { label: string; value: string } {
  const s = (raw ?? "").trim();
  if (!s || /sob\s+or[çc]amento|n[ãa]o\s+publicado|sob\s+consulta|consulte/i.test(s)) {
    return { label: L.costLabel, value: L.onRequest };
  }
  let out = s
    .replace(/~/g, "")
    .replace(/\([^)]*\)/g, "")
    .split(";")[0]
    .replace(/^\s*(a partir de|intensivo)\s+/i, "")
    .replace(/\/\s*semana/gi, "/sem")
    .replace(/\s+por\s+semana/gi, "/sem")
    .replace(/\bsemana\b/gi, "/sem")
    .replace(/\/\s*week/gi, "/wk")
    .replace(/\s+/g, " ")
    .trim();
  const label = /\d/.test(out) ? L.fromLabel : L.costLabel;
  return { label, value: out };
}

const softTile =
  "inline-flex items-center justify-center rounded-2xl shadow-[4px_4px_9px_rgba(5,21,86,0.11),-4px_-4px_8px_rgba(255,255,255,0.95)]";

export default function EnglishSchools() {
  const { i18n } = useTranslation();
  const isEN = i18n.language.startsWith("en");
  const [items, setItems] = useState<EnglishSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  useReveal();

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (s) =>
        (s.name ?? "").toLowerCase().includes(q) ||
        (s.display_name ?? "").toLowerCase().includes(q) ||
        (s.city ?? "").toLowerCase().includes(q),
    );
  }, [items, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, EnglishSchool[]>();
    for (const s of filtered) {
      const key = s.province || (isEN ? "Other" : "Outras");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return Array.from(map.entries())
      .map(([province, schools]) => ({
        province,
        schools: schools.slice().sort((a, b) => {
          const c = (a.city ?? "").localeCompare(b.city ?? "");
          return c !== 0 ? c : (a.name ?? "").localeCompare(b.name ?? "");
        }),
      }))
      .sort((a, b) => b.schools.length - a.schools.length);
  }, [filtered, isEN]);

  const totalSchools = items.length;
  const totalProvinces = useMemo(
    () => new Set(items.map((s) => s.province).filter(Boolean)).size,
    [items],
  );
  const totalCities = useMemo(
    () => new Set(items.map((s) => s.city).filter(Boolean)).size,
    [items],
  );

  const L = isEN
    ? {
        eyebrow: "Canada · English schools",
        titleLead: "The ",
        titleAccent: "right",
        titleTail: " English school for your plan in Canada",
        intro:
          "Compare schools, real weekly cost and the pathway to college. All in one place.",
        warnTitle: "Important: an English course alone does not grant work rights",
        warnBody:
          "An English course by itself does not give you the right to work in Canada. Work rights only start when you enroll in an eligible post-secondary DLI program.",
        findTitle: "Find my school",
        searchLabel: "School or city",
        searchPh: "e.g. Vancouver, ILSC",
        searchCta: "Search schools",
        browseHint: "or browse by province below",
        fromLabel: "From",
        costLabel: "Cost",
        onRequest: "On request",
        details: "See details",
        loading: "Loading…",
        empty: "No schools match your search.",
        emptyHint: "Try another city or clear the search.",
        statSchools: "schools",
        statProvinces: "provinces",
        statCities: "cities",
      }
    : {
        eyebrow: "Canadá · Escolas de inglês",
        titleLead: "A escola de inglês ",
        titleAccent: "certa",
        titleTail: " para o seu plano no Canadá",
        intro:
          "Compare escolas, o custo real por semana e o caminho até o college. Tudo em um lugar só.",
        warnTitle:
          "Importante: um curso de inglês, sozinho, não dá direito a trabalhar",
        warnBody:
          "Um curso de inglês, por si só, não dá direito a trabalhar no Canadá. O direito a trabalhar surge só ao ingressar em um programa elegível de DLI pós-secundário.",
        findTitle: "Encontrar minha escola",
        searchLabel: "Escola ou cidade",
        searchPh: "ex.: Vancouver, ILSC",
        searchCta: "Buscar escolas",
        browseHint: "ou navegue por província logo abaixo",
        fromLabel: "A partir de",
        costLabel: "Custo",
        onRequest: "Sob consulta",
        details: "Ver detalhes",
        loading: "Carregando…",
        empty: "Nenhuma escola encontrada.",
        emptyHint: "Tente outra cidade ou limpe a busca.",
        statSchools: "escolas",
        statProvinces: "províncias",
        statCities: "cidades",
      };

  const scrollToList = () =>
    document.getElementById("schools-list")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-white">
      {/* HERO BAND */}
      <header
        className="relative overflow-hidden border-b border-border"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 90% 0%, rgba(57,108,216,0.14) 0%, rgba(57,108,216,0) 60%), linear-gradient(180deg, #e8eefe 0%, #ffffff 85%)",
        }}
      >
        <div className="container max-w-6xl relative py-14 md:py-20">
          <div className="grid gap-10 md:gap-12 md:grid-cols-[1.25fr_.75fr] items-start">
            <div data-reveal>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur px-3 py-1 text-xs font-semibold text-[hsl(var(--azul))] border border-[hsl(var(--azul)/0.2)]">
                <MapPin className="h-3.5 w-3.5" />
                {L.eyebrow}
              </span>
              <h1 className="mt-5 font-display text-4xl md:text-5xl lg:text-[54px] font-bold text-[hsl(var(--navy))] tracking-tight leading-[1.08]">
                {L.titleLead}
                <span className="text-[hsl(var(--crimson))]">{L.titleAccent}</span>
                {L.titleTail}
              </h1>
              <p className="mt-5 max-w-xl text-base md:text-lg text-[#55608a] leading-relaxed font-body">
                {L.intro}
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3 md:gap-4 max-w-xl">
                <StatCard icon={<BookOpen className="h-5 w-5" />} tone="blue" value={totalSchools} label={L.statSchools} />
                <StatCard icon={<MapIcon className="h-5 w-5" />} tone="red" value={totalProvinces} label={L.statProvinces} />
                <StatCard icon={<Building2 className="h-5 w-5" />} tone="blue" value={totalCities} label={L.statCities} />
              </div>
            </div>

            <form
              data-reveal
              onSubmit={(e) => {
                e.preventDefault();
                scrollToList();
              }}
              className="bg-white rounded-2xl border border-border shadow-[0_20px_50px_-24px_rgba(4,15,61,0.22)] p-6"
            >
              <h2 className="font-display text-lg font-bold text-[hsl(var(--navy))]">
                {L.findTitle}
              </h2>
              <label className="block mt-4 text-[11px] font-semibold uppercase tracking-wider text-[#55608a]">
                {L.searchLabel}
              </label>
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 focus-within:border-[hsl(var(--azul))] transition-colors">
                <Search className="h-4 w-4 text-[hsl(var(--azul))] shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={L.searchPh}
                  className="w-full bg-transparent outline-none text-[hsl(var(--navy))] placeholder:text-[#8892b8] text-[15px]"
                />
              </div>
              <button
                type="submit"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--crimson))] hover:bg-[hsl(var(--crimson)/0.92)] text-white font-semibold px-5 py-3 transition-colors"
              >
                {L.searchCta}
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 text-xs text-[#55608a] text-center">{L.browseHint}</p>
            </form>
          </div>
        </div>
      </header>

      {/* WARN */}
      <section className="container max-w-6xl pt-10 md:pt-14" data-reveal>
        <div className="rounded-2xl border border-border border-l-4 border-l-[hsl(var(--crimson))] bg-white p-5 md:p-6 flex gap-4 shadow-sm">
          <div className="shrink-0 h-10 w-10 rounded-xl bg-[hsl(var(--crimson)/0.1)] inline-flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-[hsl(var(--crimson))]" />
          </div>
          <div>
            <p className="font-semibold text-[hsl(var(--navy))]">{L.warnTitle}</p>
            <p className="mt-1 text-sm md:text-base text-[#55608a] leading-relaxed">
              {L.warnBody}
            </p>
          </div>
        </div>
      </section>

      {/* LIST — by province */}
      <section id="schools-list" className="mt-12 md:mt-16">
        <div className="container max-w-6xl pb-16 md:pb-24">
          {loading ? (
            <div className="py-24 text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-white animate-pulse border border-border">
                <SearchX className="h-7 w-7 text-[hsl(var(--azul))]" />
              </div>
              <p className="mt-4 text-sm text-[#55608a]">{L.loading}</p>
            </div>
          ) : grouped.length === 0 ? (
            <div className="py-24 text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-white border border-border">
                <SearchX className="h-7 w-7 text-[hsl(var(--azul))]" />
              </div>
              <p className="mt-6 font-display text-xl font-bold text-[hsl(var(--navy))]">
                {L.empty}
              </p>
              <p className="mt-2 text-sm text-[#55608a]">{L.emptyHint}</p>
            </div>
          ) : (
            <div className="space-y-14 md:space-y-16">
              {grouped.map(({ province, schools }) => {
                const cities = Array.from(
                  new Set(schools.map((s) => s.city).filter(Boolean) as string[]),
                );
                const citiesPreview = cities.slice(0, 3).join(" · ");
                return (
                  <div key={province} data-reveal>
                    <div className="flex items-center gap-4 mb-6 flex-wrap">
                      <div className={`${softTile} h-12 w-12 bg-[#e9f0fe]`}>
                        <MapPin className="h-5 w-5 text-[hsl(var(--azul))]" />
                      </div>
                      <h2 className="font-display text-2xl md:text-[27px] font-bold text-[hsl(var(--navy))] tracking-tight">
                        {province}
                      </h2>
                      <span className="ml-auto text-xs md:text-sm text-[#55608a] bg-white border border-border rounded-full px-3 py-1">
                        {citiesPreview ? `${citiesPreview} · ` : ""}
                        <span className="font-semibold text-[hsl(var(--navy))]">
                          {schools.length}
                        </span>{" "}
                        {L.statSchools}
                      </span>
                    </div>
                    <div className="grid gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {schools.map((s, i) => (
                        <div
                          key={s.id}
                          data-reveal
                          style={{ transitionDelay: `${Math.min(i, 6) * 60}ms` }}
                        >
                          <SchoolCard school={s} L={L} isEN={isEN} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  tone,
  value,
  label,
}: {
  icon: React.ReactNode;
  tone: "blue" | "red";
  value: number;
  label: string;
}) {
  const bg = tone === "blue" ? "bg-[#e9f0fe]" : "bg-[#fdeef1]";
  const fg = tone === "blue" ? "text-[hsl(var(--azul))]" : "text-[hsl(var(--crimson))]";
  return (
    <div className="rounded-2xl bg-white border border-border p-4 shadow-sm">
      <div className={`${softTile} h-10 w-10 ${bg} ${fg}`}>{icon}</div>
      <div className="mt-3 font-display text-2xl md:text-3xl font-bold text-[hsl(var(--navy))] leading-none">
        {value}
      </div>
      <div className="mt-1 text-xs text-[#55608a]">{label}</div>
    </div>
  );
}

function pathwayLabel(raw: string | null | undefined, isEN: boolean): string | null {
  if (isEmpty(raw)) return null;
  const s = raw as string;
  if (/university pathway/i.test(s)) return "University Pathway";
  if (/entrada direta|admissão incondicional|dispensa o teste|dispensa ielts|satisfaz.*inglês|sem ielts/i.test(s))
    return isEN ? "Waives IELTS" : "Dispensa IELTS";
  if (/admissão condicional|conditional/i.test(s))
    return isEN ? "Conditional admission" : "Admissão condicional";
  if (/eap|english for academic|academic pathways/i.test(s)) return "College EAP";
  return "College pathway";
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
  const rawCost = school.cost_per_week?.trim() ?? "";
  const onRequestPatterns = /(sob\s+or[çc]amento|n[ãa]o\s+publicado|sob\s+consulta|consulte)/i;
  const isOnRequest = isEmpty(rawCost) || onRequestPatterns.test(rawCost);
  const costDisplay = isOnRequest
    ? L.onRequest
    : rawCost.replace(/\/\s*semana/gi, "/sem").replace(/\/\s*week/gi, "/wk");
  const hasNumericFrom = !isOnRequest && /\d/.test(rawCost);

  const pathwayTag = pathwayLabel(school.pathway, isEN);
  const examList = !isEmpty(school.exam_prep)
    ? (school.exam_prep as string)
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean)
        .slice(0, 2)
        .join(" · ")
    : null;

  const linkHref = school.application_url || school.website;

  return (
    <article className="group h-full flex flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(4,15,61,0.25)] hover:border-[hsl(var(--azul)/0.4)]">
      <div className="flex items-start gap-3">
        <div className={`${softTile} h-12 w-12 bg-[#e9f0fe] shrink-0`}>
          <BookOpen className="h-5 w-5 text-[hsl(var(--azul))]" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[17px] font-semibold text-[hsl(var(--navy))] leading-snug tracking-tight break-words">
            {school.display_name || school.name}
          </h3>
          {school.city && (
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-[#55608a]">
              <MapPin className="h-3.5 w-3.5 text-[hsl(var(--azul))]" />
              {school.city}
            </p>
          )}
        </div>
      </div>

      {(pathwayTag || examList) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {pathwayTag && (
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold rounded-full px-2.5 py-1 bg-[hsl(var(--azul)/0.10)] text-[#2b52a8]">
              <GraduationCap className="h-3.5 w-3.5" />
              {pathwayTag}
            </span>
          )}
          {examList && (
            <span className="inline-flex items-center text-[12px] font-medium rounded-full px-2.5 py-1 bg-white border border-border text-[#26336f]">
              {examList}
            </span>
          )}
        </div>
      )}

      <div className="mt-5">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#55608a]">
          {hasNumericFrom ? L.fromLabel : L.costLabel}
        </div>
        <div className="mt-1 font-display font-bold text-[24px] leading-tight text-[hsl(var(--crimson))] break-words">
          {costDisplay}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border flex items-center justify-end gap-3 mt-auto">
        {linkHref && (
          <a
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-display text-sm font-semibold text-[hsl(var(--crimson))] hover:underline"
          >
            {L.details}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}