import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SearchX,
  MapPin,
  ArrowRight,
  AlertTriangle,
  BookOpen,
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

function cleanCost(raw: string | null | undefined, L: Record<string, any>): { label: string; value: string } {
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

function pathwayLabel(raw: string | null | undefined): string | null {
  const s = (raw ?? "").trim();
  if (!s || s === "-" || s === "—") return null;
  if (/university pathway/i.test(s)) return "University Pathway";
  if (/entrada direta|admiss[ãa]o incondicional|dispensa o teste|dispensa ielts|satisfaz.*ingl[êe]s|sem ielts|dispensa iels/i.test(s))
    return "Dispensa IELTS";
  if (/admiss[ãa]o condicional|condicional/i.test(s)) return "Admissão condicional";
  if (/eap|english for academic|academic pathways/i.test(s)) return "College EAP";
  return "College pathway";
}

export default function EnglishSchools() {
  const { i18n } = useTranslation();
  const isEN = i18n.language.startsWith("en");
  const [items, setItems] = useState<EnglishSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProvince, setActiveProvince] = useState<string>("__all__");
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

  const provinceCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of items) {
      const key = s.province || (isEN ? "Other" : "Outras");
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [items, isEN]);

  const filtered = useMemo(() => {
    if (activeProvince === "__all__") return items;
    return items.filter(
      (s) => (s.province || (isEN ? "Other" : "Outras")) === activeProvince,
    );
  }, [items, activeProvince, isEN]);

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
        exploreLabel: "Explore by province",
        all: "All",
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
        factCost: "Weekly cost",
        factExam: "Exam prep",
        factPathway: "Pathway to college",
        badgeMinAge: (n: number) => `Min. age ${n}`,
        badgePartners: (n: number) => `${n}+ partners`,
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
        exploreLabel: "Explorar por província",
        all: "Todas",
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
        factCost: "Custo por semana",
        factExam: "Preparação para provas",
        factPathway: "Caminho até o college",
        badgeMinAge: (n: number) => `Idade mín. ${n}`,
        badgePartners: (n: number) => `${n}+ parceiros`,
      };

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
          <div data-reveal className="max-w-4xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur px-3.5 py-1.5 text-[14px] font-semibold text-[hsl(var(--azul))] border border-[hsl(var(--azul)/0.2)]">
              <MapPin className="h-4 w-4" />
              {L.eyebrow}
            </span>
            <h1 className="mt-6 font-display text-4xl md:text-5xl lg:text-[54px] font-bold text-[hsl(var(--navy))] tracking-tight leading-[1.08]">
              {L.titleLead}
              <span className="text-[hsl(var(--crimson))]">{L.titleAccent}</span>
              {L.titleTail}
            </h1>
            <p className="mt-6 max-w-3xl text-lg md:text-xl text-[#5a6488] leading-relaxed">
              {L.intro}
            </p>

            <div className="mt-9 grid grid-cols-3 gap-3 md:gap-4 max-w-2xl">
              <StatCard icon={<BookOpen className="h-5 w-5" />} tone="blue" value={totalSchools} label={L.statSchools} />
              <StatCard icon={<MapIcon className="h-5 w-5" />} tone="red" value={totalProvinces} label={L.statProvinces} />
              <StatCard icon={<Building2 className="h-5 w-5" />} tone="blue" value={totalCities} label={L.statCities} />
            </div>
          </div>

          {/* PROVINCE NAV */}
          <div data-reveal className="mt-12">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#5a6488]">
              {L.exploreLabel}
            </div>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <ProvincePill
                label={L.all}
                count={totalSchools}
                active={activeProvince === "__all__"}
                onClick={() => {
                  setActiveProvince("__all__");
                  document.getElementById("schools-list")?.scrollIntoView({ behavior: "smooth" });
                }}
              />
              {provinceCounts.map(([p, n]) => (
                <ProvincePill
                  key={p}
                  label={p}
                  count={n}
                  active={activeProvince === p}
                  onClick={() => {
                    setActiveProvince(p);
                    document.getElementById("schools-list")?.scrollIntoView({ behavior: "smooth" });
                  }}
                />
              ))}
            </div>
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
            <p className="font-semibold text-[17px] text-[hsl(var(--navy))]">{L.warnTitle}</p>
            <p className="mt-1.5 text-[15px] md:text-base text-[#5a6488] leading-relaxed">
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
                      <h2 className="font-display text-2xl md:text-[30px] font-bold text-[hsl(var(--navy))] tracking-tight">
                        {province}
                      </h2>
                      <span className="ml-auto text-xs md:text-sm text-[#5a6488] bg-white border border-border rounded-full px-3 py-1">
                        {citiesPreview ? `${citiesPreview} · ` : ""}
                        <span className="font-semibold text-[hsl(var(--navy))]">
                          {schools.length}
                        </span>{" "}
                        {L.statSchools}
                      </span>
                    </div>
                    <div className="grid gap-[22px] md:grid-cols-2 lg:grid-cols-3">
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
      <div className="mt-1.5 text-[13px] text-[#5a6488]">{label}</div>
    </div>
  );
}

function ProvincePill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-[15px] font-semibold transition-all ${
        active
          ? "bg-[hsl(var(--azul))] border-[hsl(var(--azul))] text-white shadow-sm"
          : "bg-white border-border text-[hsl(var(--navy))] hover:border-[hsl(var(--azul))] hover:text-[hsl(var(--azul))]"
      }`}
    >
      <span>{label}</span>
      <span
        className={`inline-flex items-center justify-center min-w-[28px] rounded-full px-2 py-0.5 text-[12px] font-bold ${
          active
            ? "bg-white/20 text-white"
            : "bg-[hsl(var(--azul)/0.1)] text-[hsl(var(--azul))]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function SchoolCard({
  school,
  L,
  isEN,
}: {
  school: EnglishSchool;
  L: Record<string, any>;
  isEN: boolean;
}) {
  const { label: costLabel, value: costDisplay } = cleanCost(school.cost_per_week, L);
  const examList = !isEmpty(school.exam_prep)
    ? (school.exam_prep as string)
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean)
        .join(" · ")
    : null;
  const pathwayText = pathwayLabel(school.pathway);
  const courseChips = !isEmpty(school.course_types)
    ? (school.course_types as string)
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
        .slice(0, 3)
    : [];

  const linkHref = school.application_url || school.website;
  const location = [school.city, school.province].filter(Boolean).join(" · ");

  // Badge
  let badge: string | null = null;
  const partners = (school.pathway || "").match(/(\d+)\s*\+?\s*(parceir|partner)/i);
  if (partners) {
    badge = (L.badgePartners as unknown as (n: number) => string)(parseInt(partners[1], 10));
  } else if (!isEmpty(school.min_age)) {
    const m = (school.min_age as string).match(/(\d+)/);
    if (m) badge = (L.badgeMinAge as unknown as (n: number) => string)(parseInt(m[1], 10));
  }

  return (
    <article className="group h-full flex flex-col rounded-2xl border border-border bg-white p-[26px] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-20px_rgba(4,15,61,0.28)] hover:border-[hsl(var(--azul)/0.45)]">
      <div className="flex items-start gap-4">
        <div className={`${softTile} h-14 w-14 bg-[#e7f0ff] shrink-0`}>
          <BookOpen className="h-6 w-6 text-[hsl(var(--azul))]" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[18px] md:text-[19px] font-semibold text-[hsl(var(--navy))] leading-snug tracking-tight break-words">
            {school.display_name || school.name}
          </h3>
          {location && (
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-[14px] text-[#5a6488]">
              <MapPin className="h-4 w-4 text-[hsl(var(--azul))]" />
              {location}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#5a6488]">
            {costLabel === L.fromLabel ? L.factCost : L.factCost}
          </div>
          <div className="mt-1 font-display font-bold text-[22px] leading-tight text-[hsl(var(--crimson))] whitespace-nowrap">
            {costDisplay}
          </div>
        </div>

        {examList && (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#5a6488]">
              {L.factExam}
            </div>
            <div className="mt-1 text-[15px] text-[hsl(var(--navy))] break-words">{examList}</div>
          </div>
        )}

        {pathwayText && (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#5a6488]">
              {L.factPathway}
            </div>
            <div className="mt-1 text-[15px] text-[hsl(var(--navy))] leading-snug">{pathwayText}</div>
          </div>
        )}
      </div>

      {courseChips.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {courseChips.map((c) => (
            <span
              key={c}
              className="inline-flex items-center text-[12.5px] font-semibold rounded-full px-2.5 py-1"
              style={{ backgroundColor: "rgba(31,95,208,0.09)", color: "hsl(var(--azul))" }}
            >
              {c}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-3">
        {badge ? (
          <span className="inline-flex items-center text-[12px] font-semibold rounded-full px-2.5 py-1 bg-[hsl(var(--azul)/0.1)] text-[hsl(var(--azul))]">
            {badge}
          </span>
        ) : (
          <span />
        )}
        {linkHref && (
          <a
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-display text-[14px] font-semibold text-[hsl(var(--crimson))] hover:underline"
          >
            {L.details}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}