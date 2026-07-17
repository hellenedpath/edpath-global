import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Shield, RefreshCw, Compass, ArrowRight, MapPin, Route, Footprints } from "lucide-react";
import { CountrySelector } from "@/components/CountrySelector";
import heroStudent from "@/assets/hero-student.jpg";
import manifestoStudy from "@/assets/manifesto-study.jpg";
import closingInspire from "@/assets/closing-inspire.jpg";
import { useReveal } from "@/hooks/use-reveal";

export default function Index() {
  const { t } = useTranslation();
  useReveal();
  const pillars = [
    { icon: Shield, key: "independent" as const },
    { icon: RefreshCw, key: "accurate" as const },
    { icon: Compass, key: "guided" as const },
  ];
  const steps = t("howItWorks.steps", { returnObjects: true }) as {
    n: string;
    title: string;
    desc: string;
  }[];
  const stepIcons = [MapPin, Route, Footprints];
  return (
    <>
      <section className="relative text-primary-foreground overflow-x-clip">
        {/* Base gradient: deep navy → richer royal blue at base */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, hsl(228 70% 12%) 0%, hsl(221 55% 18%) 40%, hsl(221 60% 24%) 85%, hsl(221 65% 30%) 100%)",
          }}
        />

        {/* Aurora blobs */}
        <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="aurora-blob animate-aurora-drift"
            style={{ width: 620, height: 620, top: "-10%", left: "-8%", background: "hsl(221 80% 55% / 0.55)" }}
          />
          <div
            className="aurora-blob animate-aurora-drift"
            style={{ width: 520, height: 520, bottom: "-15%", left: "22%", background: "hsl(350 75% 55% / 0.35)", animationDelay: "3s" }}
          />
          <div
            className="aurora-blob animate-aurora-drift"
            style={{ width: 480, height: 480, top: "12%", right: "-8%", background: "hsl(210 90% 45% / 0.35)", animationDelay: "6s" }}
          />
        </div>

        {/* Hero background photo with navy overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={heroStudent}
            alt="Student walking across a university campus"
            width={1280}
            height={1600}
            className="absolute inset-y-0 right-0 h-full w-full lg:w-[72%] object-cover object-[center_22%]"
          />
          {/* Left → right navy fade for text legibility */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(90deg, hsl(228 70% 12%) 0%, hsl(228 70% 12% / 0.96) 30%, hsl(228 65% 15% / 0.78) 50%, hsl(228 60% 18% / 0.45) 68%, hsl(228 55% 22% / 0.18) 88%, hsl(228 55% 22% / 0.1) 100%)",
            }}
          />
          {/* Soft top/bottom fade so the photo melts into the navy sections */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, hsl(228 70% 12%) 0%, transparent 18%, transparent 78%, hsl(221 60% 24%) 100%)",
            }}
          />
        </div>

        <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-[46%_54%] gap-10 lg:gap-12 items-start pt-28 md:pt-32 lg:pt-36 pb-16 md:pb-20 lg:pb-24">
          {/* Left column: text */}
          <div className="flex flex-col justify-start max-w-xl animate-fade-up">
            <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-primary-foreground/70 mb-8">
              <span className="w-8 h-px bg-crimson" />
              EdPath Global
            </div>
            <h1 className="font-display text-[3.25rem] leading-[1.02] md:text-7xl lg:text-[5.5rem] lg:leading-[0.98] font-bold tracking-[-0.035em] text-white">
              {t("home.title")}
            </h1>
            <p className="mt-8 text-base md:text-lg text-primary-foreground/75 leading-relaxed font-sans max-w-md font-light">
              {t("home.subtitle")}
            </p>
            <a
              href="#destinos"
              className="group mt-10 inline-flex items-center gap-2.5 rounded-xl bg-crimson px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_4px_16px_-4px_hsl(var(--crimson)/0.45)] hover:bg-crimson/90 hover:shadow-[0_10px_28px_-6px_hsl(var(--crimson)/0.6)] hover:-translate-y-0.5 transition-all duration-300 w-fit animate-soft-pulse"
            >
              {t("home.ctaChoose")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Right column: spacer so text stays constrained and photo shows through */}
          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </section>

      {/* Pillars */}
      <section className="relative bg-white overflow-hidden">
        {/* Soft transition from navy hero to white */}
        <div
          className="absolute top-0 inset-x-0 h-24 -translate-y-full pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, hsl(221 60% 24%) 0%, hsl(221 55% 18%) 40%, transparent 100%)",
          }}
        />
        {/* Subtle geometric grid + brand gradient wash */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(221 30% 60% / 0.08) 1px, transparent 1px), linear-gradient(90deg, hsl(221 30% 60% / 0.08) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 78%)",
          }}
        />
        <div
          aria-hidden
          className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(221 80% 55% / 0.10), transparent 65%)" }}
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(350 75% 55% / 0.08), transparent 65%)" }}
        />
        <div className="container relative max-w-6xl pt-12 md:pt-16 pb-14 md:pb-18">
          <div className="text-center mb-10 md:mb-12" data-reveal>
            <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
              <span className="w-6 h-px bg-crimson" />
              {t("pillars.eyebrow")}
              <span className="w-6 h-px bg-crimson" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy tracking-tight">
              {t("pillars.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {pillars.map(({ icon: Icon, key }, i) => (
              <div
                key={key}
                data-reveal
                style={{ transitionDelay: `${i * 90}ms` }}
                className="group relative flex flex-col items-center text-center rounded-2xl bg-white/90 backdrop-blur-sm p-10 md:p-12 ring-1 ring-border/50 shadow-[0_4px_20px_-10px_rgba(5,21,86,0.10)] hover:shadow-[0_24px_50px_-18px_rgba(5,21,86,0.25)] hover:-translate-y-2 hover:ring-crimson/30 transition-all duration-300"
              >
                <span
                  aria-hidden
                  className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-crimson/10 ring-1 ring-crimson/20 text-crimson transition-colors duration-300 group-hover:bg-crimson group-hover:text-white"
                >
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-navy tracking-tight">
                  {t(`pillars.${key}.title`)}
                </h3>
                <p className="mt-3 text-muted-foreground text-[15px] leading-relaxed max-w-xs">
                  {t(`pillars.${key}.body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
  </section>

      {/* New era manifesto — with photo + aurora */}
      <section className="relative text-white overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, hsl(228 70% 12%) 0%, hsl(221 55% 18%) 100%)",
          }}
        />
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div
            className="aurora-blob animate-aurora-drift"
            style={{ width: 560, height: 560, top: "-10%", right: "-8%", background: "hsl(221 80% 55% / 0.5)" }}
          />
          <div
            className="aurora-blob animate-aurora-drift"
            style={{ width: 440, height: 440, bottom: "-12%", left: "-6%", background: "hsl(350 75% 55% / 0.3)", animationDelay: "4s" }}
          />
        </div>
        <div className="container relative z-10 max-w-6xl py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div data-reveal>
              <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/60 mb-5">
                <span className="w-6 h-px bg-crimson" />
                {t("newEra.title")}
              </div>
              <p className="text-3xl md:text-4xl lg:text-[2.6rem] font-bold tracking-tight font-display leading-[1.15]">
                {t("newEra.manifesto")}
              </p>
              <div className="mt-8 space-y-5">
                {(t("newEra.body", { returnObjects: true }) as string[]).map((p, i) => (
                  <p key={i} className="text-base md:text-lg text-white/75 leading-relaxed max-w-xl">
                    {p}
                  </p>
                ))}
              </div>
              <Link
                to="/sobre"
                className="group mt-10 inline-flex items-center gap-2 rounded-xl bg-crimson px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_4px_16px_-4px_hsl(var(--crimson)/0.45)] hover:bg-crimson/90 hover:shadow-[0_10px_28px_-6px_hsl(var(--crimson)/0.6)] hover:-translate-y-0.5 transition-all duration-300"
              >
                {t("newEra.cta")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div data-reveal className="relative">
              <div className="relative rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] aspect-[4/5]">
                <img
                  src={manifestoStudy}
                  alt="Student studying with warm natural light"
                  loading="lazy"
                  width={1280}
                  height={1600}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, hsl(228 70% 10% / 0.55) 100%)" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        className="relative text-white"
        style={{
          backgroundImage:
            "linear-gradient(180deg, hsl(228 70% 12%) 0%, hsl(221 55% 18%) 100%)",
        }}
      >
        <div className="container max-w-6xl py-20 md:py-28">
          <div className="text-center mb-16" data-reveal>
            <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/60 mb-4">
              <span className="w-6 h-px bg-crimson" />
              {t("howItWorks.eyebrow")}
              <span className="w-6 h-px bg-crimson" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              {t("howItWorks.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((s, i) => {
              const StepIcon = stepIcons[i] ?? MapPin;
              return (
              <div
                key={s.n}
                data-reveal
                style={{ transitionDelay: `${i * 120}ms` }}
                className="group flex flex-col items-start text-left rounded-2xl bg-white/[0.04] p-8 md:p-10 ring-1 ring-white/10 hover:bg-white/[0.07] hover:ring-white/20 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <span className="font-display text-4xl md:text-5xl font-bold text-crimson leading-none">
                    {s.n}
                  </span>
                  <StepIcon className="w-7 h-7 text-white/70" strokeWidth={1.25} />
                </div>
                <h3 className="mt-6 text-xl md:text-2xl font-bold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-3 text-white/70 text-[15px] leading-relaxed">
                  {s.desc}
                </p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <CountrySelector />

      <section className="relative overflow-hidden text-white">
        <img
          src={closingInspire}
          alt="Student looking toward the horizon at golden hour"
          loading="lazy"
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, hsl(228 70% 10% / 0.9) 0%, hsl(228 65% 14% / 0.75) 45%, hsl(228 55% 20% / 0.35) 100%)",
          }}
        />
        <div className="container relative z-10 py-24 md:py-32 max-w-3xl" data-reveal>
          <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/70 mb-5">
            <span className="w-6 h-px bg-crimson" />
            {t("closing.eyebrow")}
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.02em] leading-[1.05]">
            {t("closing.title")}
          </h2>
          <p className="mt-6 text-lg text-white/80 max-w-xl leading-relaxed">
            {t("closing.body")}
          </p>
        </div>
      </section>
    </>
  );
}

