import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  GraduationCap,
  ExternalLink,
  Mail,
  Home,
  Award,
  Info,
  Bed,
  Compass,
  Wallet,
  FileText,
  Stamp,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SourceBadge from "@/components/SourceBadge";
import VerificationNote from "@/components/VerificationNote";

type HighSchool = {
  id: string;
  name: string;
  city: string | null;
  province: string | null;
  region: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  application_fee: string | null;
  tuition_annual: string | null;
  tuition_pt: string | null;
  tuition_en: string | null;
  diploma: string | null;

  diploma_pt: string | null;
  diploma_en: string | null;
  grades: string | null;
  homestay: string | null;
  homestay_pt: string | null;
  homestay_en: string | null;
  boarding: string | null;
  boarding_pt: string | null;
  boarding_en: string | null;
  school_type: string | null;
  notes: string | null;
  notes_pt: string | null;
  notes_en: string | null;
};



export default function HighSchools() {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith("en");
  const [items, setItems] = useState<HighSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<string>("all");
  const [schoolType, setSchoolType] = useState<"all" | "public" | "private">(
    "all",
  );
  const [query, setQuery] = useState("");


  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("high_schools")
        .select("*")
        .order("region", { ascending: true })
        .order("name", { ascending: true });

      if (!error && data) setItems(data as HighSchool[]);
      setLoading(false);
    })();
  }, []);


  const regions = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => it.region && set.add(it.region));
    return Array.from(set).sort();
  }, [items]);

  const regionLabel = (r: string) =>
    t(`highSchools.regions.${r}`, { defaultValue: r });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (region !== "all" && it.region !== region) return false;
      if (schoolType !== "all" && it.school_type !== schoolType) return false;
      if (q) {
        const hay = `${it.name} ${it.city ?? ""} ${it.region ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, region, schoolType, query]);

  const cardNotes = (it: HighSchool) =>
    isEnglish ? it.notes_en : it.notes_pt;

  const cardBoarding = (it: HighSchool) =>
    isEnglish ? it.boarding_en : it.boarding_pt;

  const cardDiploma = (it: HighSchool) =>
    isEnglish ? it.diploma_en : it.diploma_pt;

  const cardHomestay = (it: HighSchool) =>
    isEnglish ? it.homestay_en : it.homestay_pt;

  const cardTuition = (it: HighSchool) => {
    const active = isEnglish ? it.tuition_en : it.tuition_pt;
    if (active) return active;
    return it.tuition_en || it.tuition_pt || null;
  };

  const formatTuition = (value: string | null) => {
    if (!value) return t("highSchools.card.tuitionMissing");
    return value;
  };


  const typeOptions: Array<{ value: "all" | "public" | "private"; label: string }> = [

    { value: "all", label: t("highSchools.filters.allTypes") },
    { value: "public", label: t("highSchools.filters.public") },
    { value: "private", label: t("highSchools.filters.private") },
  ];

  const typeBadge = (type: string | null) => {
    const isPrivate = type === "private";
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
          isPrivate
            ? "bg-[hsl(var(--crimson))]/10 text-[hsl(var(--crimson))] border-[hsl(var(--crimson))]/20"
            : "bg-[hsl(var(--azul))]/10 text-[hsl(var(--azul))] border-[hsl(var(--azul))]/20"
        }`}
      >
        {isPrivate ? t("highSchools.card.type.private") : t("highSchools.card.type.public")}
      </span>
    );
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="container py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/70 mb-4">
              <span>{t("highSchools.hero.badge")}</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
              {t("highSchools.hero.title")}
            </h1>
            <p className="mt-5 text-lg text-white/80 leading-relaxed max-w-2xl">
              {t("highSchools.hero.subtitle")}
            </p>
            <p className="mt-4 text-sm text-white/70 leading-relaxed max-w-2xl">
              {t("highSchools.hero.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Context note */}
      <section className="container pt-8">
        <div className="flex items-start gap-3 rounded-lg border border-[hsl(var(--azul))]/30 bg-[hsl(var(--azul))]/5 p-4 text-sm leading-relaxed text-navy max-w-4xl">
          <Info className="h-4 w-4 mt-0.5 shrink-0 text-[hsl(var(--azul))]" />
          <div>
            <p>
              <span className="font-medium">{t("highSchools.context.title")}</span>{" "}
              {t("highSchools.context.body")}
            </p>
            <p className="mt-2">
              {t("highSchools.context.boardingNote")}
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container pt-10">
        <div className="max-w-4xl">
          <h2 className="font-display text-2xl font-semibold text-navy">
            {t("highSchools.howItWorks.title")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {t("highSchools.howItWorks.subtitle")}
          </p>
        </div>
        <ol className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {(
            t("highSchools.howItWorks.steps", { returnObjects: true }) as Array<{
              title: string;
              desc: string;
            }>
          ).map((step, i) => {
            const Icon = [Compass, Wallet, FileText, Stamp][i] ?? Compass;
            return (
              <li key={i} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-navy" strokeWidth={1.5} />
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display text-base font-semibold text-navy leading-snug">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Public vs private */}
      <section className="container pt-12">
        <div className="max-w-4xl">
          <h2 className="font-display text-2xl font-semibold text-navy">
            {t("highSchools.publicVsPrivate.title")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {t("highSchools.publicVsPrivate.subtitle")}
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {(["public", "private"] as const).map((kind) => {
            const data = t(`highSchools.publicVsPrivate.${kind}`, {
              returnObjects: true,
            }) as {
              label: string;
              cost: string;
              admission: string;
              housing: string;
              diploma: string;
            };
            return (
              <div
                key={kind}
                className="rounded-xl border border-border bg-card p-6"
              >
                <h3 className="font-display text-lg font-semibold text-navy">
                  {data.label}
                </h3>
                <dl className="mt-4 space-y-3 text-sm">
                  {(
                    ["cost", "admission", "housing", "diploma"] as const
                  ).map((row) => (
                    <div key={row}>
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                        {t(`highSchools.labels.${row}`)}
                      </dt>
                      <dd className="mt-0.5 text-foreground leading-relaxed">
                        {data[row]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground italic max-w-4xl">
          {t("highSchools.publicVsPrivate.note")}
        </p>
      </section>

      {/* Filters */}
      <section className="container py-8">
        <div className="flex flex-col gap-4">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("highSchools.filters.searchPlaceholder")}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground mr-1">
              {t("highSchools.filters.typeLabel")}
            </span>
            {typeOptions.map((opt) => {
              const active = schoolType === opt.value;
              return (
                <Button
                  key={opt.value}
                  variant={active ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSchoolType(opt.value)}
                  className={
                    active
                      ? "bg-[hsl(var(--azul))] hover:bg-[hsl(var(--azul))]/90 text-white border-transparent"
                      : ""
                  }
                >
                  {opt.label}
                </Button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={region === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setRegion("all")}
              className={
                region === "all"
                  ? "bg-[hsl(var(--azul))] hover:bg-[hsl(var(--azul))]/90 text-white border-transparent"
                  : ""
              }
            >
              {t("highSchools.filters.allRegions")}
            </Button>
            {regions.map((r) => {
              const active = region === r;
              return (
                <Button
                  key={r}
                  variant={active ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRegion(r)}
                  className={
                    active
                      ? "bg-[hsl(var(--azul))] hover:bg-[hsl(var(--azul))]/90 text-white border-transparent"
                      : ""
                  }
                >
                  {regionLabel(r)}
                </Button>
              );
            })}
          </div>

          <p className="text-sm text-muted-foreground">
            {loading
              ? t("highSchools.filters.loading")
              : t("highSchools.filters.count", { count: filtered.length })}
          </p>
        </div>

        {/* List */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((it) => (
            <article
              key={it.id}
              className="flex flex-col rounded-xl border border-border bg-card p-6 hover:border-[hsl(var(--crimson))] hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[hsl(var(--crimson))]">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="mb-2">{typeBadge(it.school_type)}</div>
                  <h3 className="font-display text-lg font-semibold text-foreground leading-snug">
                    {it.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[it.city, it.region ? regionLabel(it.region) : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </div>

              {cardNotes(it) && (
                <p className="mt-4 text-sm text-foreground/80 leading-relaxed">
                  {cardNotes(it)}
                </p>
              )}


              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {cardDiploma(it) && (
                  <div className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-[hsl(var(--azul))]" />
                    <dt className="text-muted-foreground">{t("highSchools.card.diploma")}:</dt>
                    <dd className="font-medium text-foreground">{cardDiploma(it)}</dd>
                  </div>
                )}
                {it.grades && (
                  <div className="flex items-center gap-1.5">
                    <dt className="text-muted-foreground">{t("highSchools.card.grades")}:</dt>
                    <dd className="font-medium text-foreground">{it.grades}</dd>
                  </div>
                )}
                {cardHomestay(it) && (
                  <div className="flex items-center gap-1.5">
                    <Home className="h-3.5 w-3.5 text-[hsl(var(--azul))]" />
                    <dt className="text-muted-foreground">{t("highSchools.card.homestay")}:</dt>
                    <dd className="font-medium text-foreground">{cardHomestay(it)}</dd>
                  </div>
                )}

                {it.school_type === "private" && cardBoarding(it) && (
                  <div className="flex items-center gap-1.5 col-span-2">
                    <Bed className="h-3.5 w-3.5 text-[hsl(var(--azul))]" />
                    <dt className="text-muted-foreground">{t("highSchools.card.boarding")}:</dt>
                    <dd className="font-medium text-foreground">{cardBoarding(it)}</dd>
                  </div>
                )}

                {it.application_fee && (
                  <div className="flex items-center gap-1.5">
                    <dt className="text-muted-foreground">{t("highSchools.card.applicationFee")}:</dt>
                    <dd className="font-medium text-foreground">{it.application_fee}</dd>
                  </div>
                )}
                {it.name === "Bodwell High School" ? (
                  <div className="col-span-2">
                    <dt className="text-muted-foreground">
                      {t("highSchools.card.bodwell.estimatedCostLabel")}
                    </dt>
                    <dd className="mt-1.5 space-y-1">
                      <p className="font-medium text-foreground">
                        {t("highSchools.card.bodwell.boarding")}
                      </p>
                      <p className="font-medium text-foreground">
                        {t("highSchools.card.bodwell.day")}
                      </p>
                    </dd>
                    <p className="mt-2 text-[10px] italic text-muted-foreground">
                      {t("highSchools.card.bodwell.disclaimer")}
                    </p>
                  </div>
                ) : (
                  <div className="col-span-2">
                    <div className="flex items-center gap-1.5">
                      <dt className="text-muted-foreground">{t("highSchools.card.tuition")}:</dt>
                      <dd className="font-medium text-foreground">
                        {formatTuition(cardTuition(it))}
                      </dd>
                    </div>
                    {cardTuition(it) && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {t("highSchools.card.tuitionEstimate")}
                      </p>
                    )}
                  </div>
                )}



              </dl>

              <div className="mt-5 flex flex-wrap items-center gap-3 pt-4 border-t border-border">
                {it.website && (
                  <a
                    href={it.website}
                    target="_blank"
                    rel="noopener noreferrer external"
                    className="inline-flex items-center gap-1.5 rounded-md bg-[hsl(var(--crimson))] px-4 py-2 text-sm font-medium text-white hover:bg-[hsl(var(--crimson))]/90 transition-colors"
                  >
                    {t("highSchools.card.applyCta")}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {it.email && (
                  <a
                    href={`mailto:${it.email}`}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[hsl(var(--azul))] transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {it.email}
                  </a>
                )}
              </div>
              <div className="mt-3">
                <SourceBadge url={it.website} />
              </div>
            </article>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="mt-10 text-center text-muted-foreground">
            {t("highSchools.empty")}
          </div>
        )}

        {/* Next-step CTA */}
        <div className="mt-12 rounded-xl border border-navy/15 bg-navy/[0.03] p-6 max-w-4xl">
          <div className="flex items-start gap-4">
            <MessageCircle
              className="h-6 w-6 mt-1 shrink-0 text-navy"
              strokeWidth={1.5}
            />
            <div className="flex-1">
              <h3 className="font-display text-lg font-semibold text-navy">
                {t("highSchools.nextStep.title")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {t("highSchools.nextStep.body")}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("edpath:open-assistant"),
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-md bg-[hsl(var(--crimson))] px-4 py-2 text-sm font-medium text-white hover:bg-[hsl(var(--crimson))]/90 transition-colors"
                >
                  {t("highSchools.nextStep.askAssistant")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <Link
                  to="/canada/study-permit"
                  className="inline-flex items-center gap-1.5 text-sm text-navy hover:text-[hsl(var(--azul))] transition-colors underline-offset-4 hover:underline"
                >
                  {t("highSchools.nextStep.studyPermit")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-start gap-2 rounded-md border border-[hsl(var(--azul))]/30 bg-[hsl(var(--azul))]/5 p-4 text-sm leading-relaxed text-navy max-w-4xl">
          <Info className="h-4 w-4 mt-0.5 shrink-0 text-[hsl(var(--azul))]" />
          <div>
            <p>
              <span className="font-medium">{t("highSchools.disclaimer.title")}</span>{" "}
              {t("highSchools.disclaimer.body")}
            </p>
            <p className="mt-2">
              {t("highSchools.disclaimer.costNote")}
            </p>
          </div>
        </div>

        <VerificationNote className="mt-8" />

      </section>
    </>
  );
}
