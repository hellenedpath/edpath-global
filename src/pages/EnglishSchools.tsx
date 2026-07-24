import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, SearchX, MapPin, ArrowRight, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  !v || v.trim() === "" || v.trim() === "-";

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
        (s.display_name ?? "").toLowerCase().includes(q) ||
        (s.city ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, province, query]);

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
        titleTail: " English school for your plan in Canada.",
        intro:
          "Compare schools, the real weekly cost and the pathway to college. All in one place.",
        warnTitle: "Important: an English course alone does not grant work rights",
        warnBody:
          "Taking an English course by itself does not give you the right to work in Canada. Work rights only start when you enroll in an eligible post-secondary DLI program.",
        allProvinces: "All provinces",
        searchLabel: "School or city",
        searchPh: "e.g. ILAC, Toronto",
        provinceLabel: "Province",
        searchCta: "Search",
        fromLabel: "From",
        costLabel: "Cost",
        onRequest: "On request",
        details: "See details",
        featured: "Featured schools",
        allSchools: "All schools",
        loading: "Loading…",
        empty: "No schools match your filters.",
        emptyHint: "Try clearing the filters or searching another city.",
        statSchools: "schools",
        statProvinces: "provinces",
        statCities: "cities",
      }
    : {
        eyebrow: "Canadá · Escolas de inglês",
        titleLead: "A escola de inglês ",
        titleAccent: "certa",
        titleTail: " para o seu plano no Canadá.",
        intro:
          "Compare escolas, o custo real por semana e o caminho até o college. Tudo em um lugar só.",
        warnTitle:
          "Importante: um curso de inglês, sozinho, não dá direito a trabalhar",
        warnBody:
          "Um curso de inglês, por si só, não dá direito a trabalhar no Canadá. O direito a trabalho surge só ao ingressar em um programa elegível de DLI pós-secundário.",
        allProvinces: "Todas as províncias",
        searchLabel: "Escola ou cidade",
        searchPh: "ex.: ILAC, Toronto",
        provinceLabel: "Província",
        searchCta: "Buscar",
        fromLabel: "A partir de",
        costLabel: "Custo",
        onRequest: "Sob consulta",
        details: "Ver detalhes",
        featured: "Escolas em destaque",
        allSchools: "Todas as escolas",
        loading: "Carregando…",
        empty: "Nenhuma escola encontrada com esses filtros.",
        emptyHint: "Tente limpar os filtros ou buscar outra cidade.",
        statSchools: "escolas",
        statProvinces: "províncias",
        statCities: "cidades",
      };

  const scrollToList = () =>
    document.getElementById("schools-list")?.scrollIntoView({ behavior: "smooth" });

  const hasFilters = province !== "all" || query.trim().length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* HERO — navy */}
      <header
        className="relative overflow-hidden text-white"
        style={{
          backgroundImage:
            "radial-gradient(60% 55% at 85% 0%, rgba(57,108,216,0.30) 0%, rgba(57,108,216,0) 60%), linear-gradient(160deg, #071a5e 0%, #051556 60%, #040f3d 100%)",
        }}
      >
        <div className="container max-w-5xl relative py-16 md:py-24 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/[0.18] px-3 py-1 text-xs font-semibold text-[#dfe6ff]">
            <MapPin className="h-3.5 w-3.5" />
            {L.eyebrow}
          </span>
          <h1 className="mt-6 mx-auto max-w-3xl font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
            {L.titleLead}
            <span className="text-[hsl(var(--crimson))]">{L.titleAccent}</span>
            {L.titleTail}
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-base md:text-lg text-[#c6cef0] leading-relaxed">
            {L.intro}
          </p>

          {/* SEARCH BAR */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              scrollToList();
            }}
            className="mt-8 mx-auto max-w-3xl bg-white rounded-2xl shadow-[0_20px_60px_-20px_rgba(4,15,61,0.6)] p-2 flex flex-col md:flex-row items-stretch gap-2 md:gap-0 text-left"
          >
            <div className="flex items-center gap-3 flex-1 px-4 py-2">
              <Search className="h-5 w-5 text-[hsl(var(--azul))] shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#55608a]">
                  {L.searchLabel}
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={L.searchPh}
                  className="w-full bg-transparent outline-none text-[hsl(var(--navy))] placeholder:text-[#8892b8] text-[15px]"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 md:border-l md:border-border flex-1 px-4 py-2">
              <MapPin className="h-5 w-5 text-[hsl(var(--azul))] shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#55608a]">
                  {L.provinceLabel}
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-transparent outline-none text-[hsl(var(--navy))] text-[15px]"
                >
                  <option value="all">{L.allProvinces}</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--crimson))] hover:bg-[hsl(var(--crimson)/0.92)] text-white font-semibold px-6 py-3 transition-colors"
            >
              {L.searchCta}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-sm text-[#c6cef0]">
            <span className="font-semibold text-white">{totalSchools}</span> {L.statSchools}
            {"  ·  "}
            <span className="font-semibold text-white">{totalProvinces}</span> {L.statProvinces}
            {"  ·  "}
            <span className="font-semibold text-white">{totalCities}</span> {L.statCities}
          </div>
        </div>
      </header>

      {/* WARN */}
      <section className="container max-w-6xl pt-10 md:pt-14">
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

      {/* LIST */}
      <section id="schools-list" className="bg-[#f5f7fc] mt-12 md:mt-16">
        <div className="container max-w-6xl py-12 md:py-16">
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--navy))] tracking-tight">
              {hasFilters ? L.allSchools : L.featured}
            </h2>
            <span className="text-sm text-[#55608a] shrink-0">
              <span className="font-bold text-[hsl(var(--navy))]">{filtered.length}</span>{" "}
              {L.statSchools}
            </span>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-white animate-pulse">
                <SearchX className="h-7 w-7 text-[hsl(var(--azul))]" />
              </div>
              <p className="mt-4 text-sm text-[#55608a]">{L.loading}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-white">
                <SearchX className="h-7 w-7 text-[hsl(var(--azul))]" />
              </div>
              <p className="mt-6 font-display text-xl font-bold text-[hsl(var(--navy))]">
                {L.empty}
              </p>
              <p className="mt-2 text-sm text-[#55608a]">{L.emptyHint}</p>
            </div>
          ) : (
            <div className="grid gap-6 md:gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((s) => (
                <SchoolCard key={s.id} school={s} L={L} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SchoolCard({
  school,
  L,
}: {
  school: EnglishSchool;
  L: Record<string, string>;
}) {
  const cost = !isEmpty(school.cost_per_week) ? (school.cost_per_week as string) : null;
  const hasNumericFrom = !!cost && /\d/.test(cost);
  const rawTag = !isEmpty(school.pathway)
    ? (school.pathway as string)
    : !isEmpty(school.exam_prep)
    ? (school.exam_prep as string)
    : null;
  const shortTag =
    rawTag && rawTag.length > 42 ? rawTag.slice(0, 40).trim() + "…" : rawTag;
  const linkHref = school.application_url || school.website;
  const location = [school.city, school.province].filter(Boolean).join(" · ");

  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-white p-6 md:p-7 shadow-sm transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_18px_40px_-20px_rgba(4,15,61,0.25)] hover:border-[hsl(var(--azul)/0.35)]">
      <h3 className="font-display text-[20px] font-bold text-[hsl(var(--navy))] leading-snug tracking-tight break-words">
        {school.display_name || school.name}
      </h3>
      {location && (
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#5a6488]">
          <MapPin className="h-3.5 w-3.5 text-[hsl(var(--azul))]" />
          {location}
        </p>
      )}

      <div className="mt-6">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#5a6488]">
          {hasNumericFrom ? L.fromLabel : L.costLabel}
        </div>
        <div className="mt-1 font-display font-bold text-[24px] leading-tight text-[hsl(var(--crimson))] break-words">
          {cost ?? L.onRequest}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3 mt-auto">
        {shortTag ? (
          <span className="text-[12px] font-medium text-[#5a6488] rounded-full bg-[hsl(var(--azul)/0.06)] px-2.5 py-1 truncate max-w-[60%]">
            {shortTag}
          </span>
        ) : (
          <span />
        )}
        {linkHref && (
          <a
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[hsl(var(--crimson))] hover:underline shrink-0"
          >
            {L.details}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}