import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Shield, RefreshCw, Compass, ArrowRight, MapPin, Route, Footprints } from "lucide-react";
import { CountrySelector } from "@/components/CountrySelector";
import heroStudent from "@/assets/hero-student.jpg.asset.json";
import manifestoGrad from "@/assets/new-era.jpg.asset.json";
import closingInspire from "@/assets/closing-inspire.jpg";
import destinationBanner from "@/assets/destination-banner.png.asset.json";
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
            src={heroStudent.url}
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

      {/* New era manifesto — light surface, subtle depth, soft glow behind photo */}
      <section className="relative overflow-hidden" style={{ backgroundImage: "linear-gradient(180deg, hsl(43 24% 98%) 0%, hsl(43 18% 96%) 100%)" }}>
        {/* Subtle geometric grid + soft gradient orbs */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.22]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(221 30% 60% / 0.07) 1px, transparent 1px), linear-gradient(90deg, hsl(221 30% 60% / 0.07) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at center, black 25%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 25%, transparent 80%)",
          }}
        />
        <div
          aria-hidden
          className="absolute -top-20 -right-20 w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(221 80% 55% / 0.08), transparent 65%)" }}
        />
        <div
          aria-hidden
          className="absolute -bottom-20 -left-20 w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(350 75% 55% / 0.05), transparent 65%)" }}
        />
        <div className="container relative z-10 max-w-7xl py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-8 items-center">
            <div data-reveal>
              <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                <span className="w-6 h-px bg-crimson" />
                {t("newEra.title")}
              </div>
              <p className="text-2xl md:text-3xl lg:text-[2.25rem] font-bold tracking-tight font-display leading-[1.15] text-navy">
                {t("newEra.manifesto")}
              </p>
              <div className="mt-6 space-y-4">
                {(t("newEra.body", { returnObjects: true }) as string[]).map((p, i) => (
                  <p key={i} className="text-base md:text-[17px] text-muted-foreground leading-relaxed max-w-2xl">
                    {p}
                  </p>
                ))}
              </div>
              <Link
                to="/sobre"
                className="group mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-b from-[#E0405B] to-[#B82C46] px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_8px_24px_-6px_hsl(var(--crimson)/0.5)] ring-1 ring-white/10 hover:brightness-110 hover:shadow-[0_14px_32px_-8px_hsl(var(--crimson)/0.65)] hover:-translate-y-0.5 transition-all duration-300"
              >
                {t("newEra.cta")}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </div>
            <div data-reveal style={{ transitionDelay: "120ms" }} className="relative">
              {/* Soft warm glow behind photo */}
              <div
                aria-hidden
                className="absolute -inset-5 md:-inset-8 rounded-[2.5rem] blur-3xl opacity-70 pointer-events-none"
                style={{ background: "radial-gradient(circle at center, hsl(30 95% 62% / 0.35), hsl(38 90% 58% / 0.22) 55%, transparent 78%)" }}
              />
              <div className="relative rounded-3xl overflow-hidden ring-1 ring-navy/10 shadow-[0_24px_60px_-20px_rgba(5,21,86,0.25)] aspect-[4/5] lg:scale-[1.05] origin-center">
                <img
                  src={manifestoGrad.url}
                  alt="Smiling graduate student in cap and gown"
                  loading="lazy"
                  width={1280}
                  height={1600}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 60%, hsl(228 49% 18% / 0.25) 100%)" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative overflow-hidden" style={{ backgroundImage: "linear-gradient(180deg, hsl(43 24% 98%) 0%, hsl(43 18% 96%) 100%)" }}>
        {/* Subtle geometric grid + soft gradient orbs */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.22]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(221 30% 60% / 0.07) 1px, transparent 1px), linear-gradient(90deg, hsl(221 30% 60% / 0.07) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at center, black 25%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 25%, transparent 80%)",
          }}
        />
        <div
          aria-hidden
          className="absolute -top-20 -right-20 w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(221 80% 55% / 0.08), transparent 65%)" }}
        />
        <div className="container relative z-10 max-w-6xl py-20 md:py-28">
          <div className="text-center mb-12 md:mb-16" data-reveal>
            <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
              <span className="w-6 h-px bg-crimson" />
              {t("howItWorks.eyebrow")}
              <span className="w-6 h-px bg-crimson" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy tracking-tight">
              {t("howItWorks.title")}
            </h2>
          </div>
          <div className="relative">
            {/* Connecting line between cards */}
            <div
              aria-hidden
              className="absolute top-[7.25rem] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-navy/15 to-transparent hidden md:block z-0"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
              {steps.map((s, i) => {
                const StepIcon = stepIcons[i] ?? MapPin;
                return (
                  <div
                    key={s.n}
                    data-reveal
                    style={{ transitionDelay: `${i * 120}ms` }}
                    className="group flex flex-col items-center text-center rounded-2xl bg-white p-8 md:p-10 ring-1 ring-border/50 shadow-[0_4px_20px_-10px_rgba(5,21,86,0.10)] hover:shadow-[0_24px_50px_-18px_rgba(5,21,86,0.18)] hover:-translate-y-2 transition-all duration-300"
                  >
                    <span className="font-display text-5xl md:text-6xl font-bold text-crimson leading-none">
                      {s.n}
                    </span>
                    <span className="mt-6 mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted/50 text-navy/70 transition-colors duration-300 group-hover:bg-crimson/10 group-hover:text-crimson">
                      <StepIcon className="w-6 h-6" strokeWidth={1.5} />
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-navy">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-muted-foreground text-[15px] leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Destination is real banner */}
      <section className="relative" data-reveal>
        <div className="container max-w-7xl px-4 md:px-6">
          <div className="relative rounded-3xl overflow-hidden shadow-[0_24px_60px_-20px_rgba(5,21,86,0.18)]">
            <img
              src={destinationBanner.url}
              alt="Graduate student celebrating with confetti"
              loading="lazy"
              width={1600}
              height={900}
              className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
            />
            {/* Dark gradient overlay on the left */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, hsl(228 70% 10% / 0.92) 0%, hsl(228 65% 14% / 0.75) 40%, hsl(228 55% 20% / 0.35) 65%, transparent 100%)",
              }}
            />
            <div className="relative z-10 py-20 md:py-28 px-8 md:px-14 lg:px-20 max-w-2xl">
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05]">
                {t("destinationReal.title")}
              </h2>
              <p className="mt-5 text-lg md:text-xl text-white/80 max-w-lg leading-relaxed">
                {t("destinationReal.subtitle")}
              </p>
            </div>
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

