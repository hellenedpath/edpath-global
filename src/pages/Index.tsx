import { useTranslation } from "react-i18next";
import { Shield, RefreshCw, Compass, ArrowRight } from "lucide-react";
import { CountrySelector } from "@/components/CountrySelector";
import heroStudent from "@/assets/hero-student.jpg";

export default function Index() {
  const { t } = useTranslation();
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

        {/* Hero background photo with navy overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={heroStudent}
            alt="Student walking across a university campus"
            width={1280}
            height={1600}
            className="absolute inset-y-0 right-0 h-full w-full lg:w-[62%] object-cover object-center"
          />
          {/* Left → right navy fade for text legibility */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(90deg, hsl(228 70% 12%) 0%, hsl(228 70% 12%) 38%, hsl(228 65% 15% / 0.85) 55%, hsl(228 60% 18% / 0.55) 72%, hsl(228 55% 22% / 0.25) 92%, hsl(228 55% 22% / 0.15) 100%)",
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

        <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-[52%_48%] gap-10 lg:gap-12 items-start pt-14 md:pt-16 lg:pt-20 pb-8 md:pb-12 lg:pb-14 lg:min-h-[62vh]">
          {/* Left column: text */}
          <div className="flex flex-col justify-start max-w-xl">
            <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-primary-foreground/70 mb-10">
              <span className="w-8 h-px bg-crimson" />
              EdPath Global
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-[1.18] tracking-[-0.02em] text-white">
              {t("home.title")}
            </h1>
            <p className="mt-8 text-lg md:text-xl text-primary-foreground/80 leading-relaxed font-sans max-w-md">
              {t("home.subtitle")}
            </p>
            <a
              href="#destinos"
              className="group mt-10 inline-flex items-center gap-2.5 rounded-xl bg-crimson px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_4px_16px_-4px_hsl(var(--crimson)/0.45)] hover:bg-crimson/90 hover:shadow-[0_8px_24px_-6px_hsl(var(--crimson)/0.55)] hover:-translate-y-0.5 transition-all duration-300 w-fit"
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
      <section className="bg-white">
        <div className="container max-w-6xl py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {pillars.map(({ icon: Icon, key }) => (
              <div
                key={key}
                className="group flex flex-col items-center text-center rounded-2xl bg-white p-8 md:p-10 ring-1 ring-border/50 shadow-[0_2px_14px_-6px_rgba(5,21,86,0.08)] hover:shadow-[0_8px_24px_-8px_rgba(5,21,86,0.12)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-crimson/10 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-crimson" strokeWidth={1.5} />
                </div>
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

      {/* How it works */}
      <section className="bg-muted/40">
        <div className="container max-w-6xl py-20 md:py-28">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
              <span className="w-6 h-px bg-crimson" />
              {t("howItWorks.eyebrow")}
              <span className="w-6 h-px bg-crimson" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy tracking-tight">
              {t("howItWorks.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((s) => (
              <div
                key={s.n}
                className="flex flex-col items-center text-center rounded-2xl bg-white p-8 md:p-10 ring-1 ring-border/50 shadow-[0_2px_14px_-6px_rgba(5,21,86,0.08)]"
              >
                <div className="w-12 h-12 rounded-full bg-crimson/10 text-crimson flex items-center justify-center font-sans text-sm font-bold tracking-wider">
                  {s.n}
                </div>
                <h3 className="mt-6 text-xl md:text-2xl font-bold text-navy tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-3 text-muted-foreground text-[15px] leading-relaxed max-w-xs">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CountrySelector />
    </>
  );
}

