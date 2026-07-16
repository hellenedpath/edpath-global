import { useTranslation } from "react-i18next";
import { ChevronDown, Shield, RefreshCw, Compass, ArrowRight } from "lucide-react";
import { CountrySelector } from "@/components/CountrySelector";

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
      <section className="relative text-primary-foreground overflow-hidden">
        {/* Base gradient: deep navy → richer purple at base */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, hsl(228 55% 12%) 0%, hsl(228 49% 18%) 40%, hsl(245 55% 22%) 85%, hsl(262 55% 26%) 100%)",
          }}
        />
        {/* Graphic backdrop: routes + stylized globe */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="glowPurple" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--purple))" stopOpacity="0.55" />
                <stop offset="100%" stopColor="hsl(var(--purple))" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glowCrimson" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--crimson))" stopOpacity="0.45" />
                <stop offset="100%" stopColor="hsl(var(--crimson))" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="routeStroke" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="hsl(262 90% 78%)" stopOpacity="0" />
                <stop offset="50%" stopColor="hsl(262 90% 78%)" stopOpacity="1" />
                <stop offset="100%" stopColor="hsl(var(--crimson))" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--crimson))" stopOpacity="0.9" />
                <stop offset="100%" stopColor="hsl(var(--crimson))" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ambient glows */}
            <circle cx="1150" cy="450" r="520" fill="url(#glowPurple)" />
            <circle cx="1250" cy="620" r="360" fill="url(#glowCrimson)" />

            {/* Stylized globe (right side) */}
            <g transform="translate(1180 450)">
              <circle r="290" fill="hsl(228 55% 10% / 0.35)" />
              <circle r="290" fill="none" stroke="hsl(262 90% 78%)" strokeOpacity="0.75" strokeWidth="1.5" />
              {/* Meridians */}
              {[0, 30, 60, 90, 120, 150].map((a) => (
                <ellipse
                  key={a}
                  rx="290"
                  ry={290 * Math.abs(Math.cos((a * Math.PI) / 180))}
                  fill="none"
                  stroke="hsl(262 90% 78%)"
                  strokeOpacity="0.45"
                  strokeWidth="1"
                  transform={`rotate(${a})`}
                />
              ))}
              {/* Parallels */}
              {[-60, -30, 0, 30, 60].map((lat) => (
                <ellipse
                  key={lat}
                  cy={290 * Math.sin((lat * Math.PI) / 180)}
                  rx={290 * Math.cos((lat * Math.PI) / 180)}
                  ry={10}
                  fill="none"
                  stroke="hsl(262 90% 78%)"
                  strokeOpacity="0.4"
                  strokeWidth="1"
                />
              ))}
              {/* Destination dots — pulsing crimson */}
              {[
                [-180, -60],
                [-40, -140],
                [90, -30],
                [180, 40],
                [-90, 90],
                [40, 150],
                [-220, 30],
              ].map(([x, y], i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r="28" fill="url(#dotGlow)" />
                  <circle cx={x} cy={y} r="5" fill="hsl(var(--crimson))">
                    <animate
                      attributeName="opacity"
                      values="1;0.45;1"
                      dur={`${2.2 + (i % 3) * 0.6}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx={x} cy={y} r="2" fill="#ffffff" opacity="0.95" />
                </g>
              ))}
            </g>

            {/* Route lines traversing the canvas */}
            <g fill="none" stroke="url(#routeStroke)" strokeWidth="2" strokeDasharray="4 10" strokeLinecap="round">
              <path d="M -50 250 Q 400 120 900 300 T 1650 220" />
              <path d="M -50 520 Q 350 700 780 520 T 1650 560" />
              <path d="M 120 800 Q 500 620 950 780 T 1650 720" />
              <path d="M 200 60 Q 600 300 1100 120 T 1650 60" />
            </g>

            {/* Faint grid latitude lines */}
            <g stroke="hsl(0 0% 100% / 0.06)" strokeWidth="1">
              {[150, 300, 450, 600, 750].map((y) => (
                <line key={y} x1="0" y1={y} x2="1600" y2={y} />
              ))}
            </g>
          </svg>

          {/* Left-side fade so text stays readable — keeps graphics visible on the right */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, hsl(228 55% 12% / 0.92) 0%, hsl(228 55% 12% / 0.7) 35%, hsl(228 55% 12% / 0.15) 70%, transparent 100%)",
            }}
          />
        </div>

        <div className="container relative py-28 md:py-36 lg:py-44 max-w-5xl">
          <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-primary-foreground/70 mb-10">
            <span className="w-8 h-px bg-crimson" />
            EdPath Global
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-[-0.02em] text-white max-w-4xl">
            {t("home.title")}
          </h1>
          <p className="mt-8 text-lg md:text-xl text-primary-foreground/80 max-w-xl leading-relaxed font-sans">
            {t("home.subtitle")}
          </p>
          <a
            href="#destinos"
            className="group mt-12 inline-flex items-center gap-2.5 rounded-xl bg-crimson px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_4px_16px_-4px_hsl(var(--crimson)/0.45)] hover:bg-crimson/90 hover:shadow-[0_8px_24px_-6px_hsl(var(--crimson)/0.55)] hover:-translate-y-0.5 transition-all duration-300"
          >
            {t("home.ctaChoose")}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-background border-b border-border/60">
        <div className="container max-w-6xl py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {pillars.map(({ icon: Icon, key }) => (
              <div
                key={key}
                className="group relative flex flex-col items-center text-center rounded-2xl bg-white p-8 md:p-10 ring-1 ring-border/60 shadow-[0_8px_30px_-20px_rgba(5,21,86,0.15)] hover:shadow-[0_16px_40px_-20px_rgba(5,21,86,0.2)] hover:-translate-y-0.5 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-xl bg-crimson/10 flex items-center justify-center mb-5 ring-1 ring-crimson/15">
                  <Icon className="w-7 h-7 text-crimson" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-2xl font-medium text-navy tracking-tight">
                  {t(`pillars.${key}.title`)}
                </h3>
                <div className="h-px w-8 bg-crimson mt-3 mb-4" />
                <p className="text-muted-foreground text-[15px] leading-relaxed max-w-xs">
                  {t(`pillars.${key}.body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/40">
        <div className="container max-w-6xl py-16 md:py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
              <span className="w-6 h-px bg-crimson" />
              {t("howItWorks.eyebrow")}
              <span className="w-6 h-px bg-crimson" />
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-medium text-navy tracking-tight">
              {t("howItWorks.title")}
            </h2>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            <div
              aria-hidden="true"
              className="hidden md:block absolute top-6 left-[16.6%] right-[16.6%] h-px"
              style={{
                backgroundImage:
                  "linear-gradient(to right, hsl(var(--purple)/0.3), hsl(var(--crimson)/0.5), hsl(var(--purple)/0.3))",
              }}
            />
            {steps.map((s) => (
              <div key={s.n} className="relative flex flex-col items-center text-center px-4">
                <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center font-sans text-sm font-medium tracking-wider ring-4 ring-muted/40 relative z-10">
                  {s.n}
                </div>
                <h3 className="mt-5 font-display text-xl md:text-2xl font-medium text-navy tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-muted-foreground text-[15px] leading-relaxed max-w-xs">
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

