import { useTranslation } from "react-i18next";
import { ChevronDown, Shield, RefreshCw, Compass } from "lucide-react";
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
      <section className="relative bg-navy text-primary-foreground overflow-hidden">
        {/* Graphic backdrop: deep navy + routes + stylized globe */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="glowPurple" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--purple))" stopOpacity="0.35" />
                <stop offset="100%" stopColor="hsl(var(--purple))" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glowCrimson" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--crimson))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--crimson))" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="routeStroke" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="hsl(var(--purple))" stopOpacity="0" />
                <stop offset="50%" stopColor="hsl(var(--purple))" stopOpacity="0.7" />
                <stop offset="100%" stopColor="hsl(var(--crimson))" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Ambient glows */}
            <circle cx="1150" cy="450" r="520" fill="url(#glowPurple)" />
            <circle cx="1250" cy="620" r="360" fill="url(#glowCrimson)" />

            {/* Stylized globe (right side) */}
            <g transform="translate(1180 450)" opacity="0.55">
              <circle r="290" fill="none" stroke="hsl(var(--purple))" strokeOpacity="0.35" strokeWidth="1" />
              <circle r="290" fill="none" stroke="hsl(var(--crimson))" strokeOpacity="0.25" strokeWidth="1" />
              {/* Meridians */}
              {[0, 30, 60, 90, 120, 150].map((a) => (
                <ellipse
                  key={a}
                  rx="290"
                  ry={290 * Math.abs(Math.cos((a * Math.PI) / 180))}
                  fill="none"
                  stroke="hsl(var(--purple))"
                  strokeOpacity="0.22"
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
                  stroke="hsl(var(--purple))"
                  strokeOpacity="0.2"
                  strokeWidth="1"
                />
              ))}
              {/* Destination dots */}
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
                  <circle cx={x} cy={y} r="6" fill="hsl(var(--crimson))" opacity="0.9" />
                  <circle cx={x} cy={y} r="14" fill="hsl(var(--crimson))" opacity="0.15" />
                </g>
              ))}
            </g>

            {/* Route lines (dashed) traversing the canvas */}
            <g fill="none" stroke="url(#routeStroke)" strokeWidth="1.25" strokeDasharray="2 8" strokeLinecap="round" opacity="0.75">
              <path d="M -50 250 Q 400 120 900 300 T 1650 220" />
              <path d="M -50 520 Q 350 700 780 520 T 1650 560" />
              <path d="M 120 800 Q 500 620 950 780 T 1650 720" />
              <path d="M 200 60 Q 600 300 1100 120 T 1650 60" />
            </g>

            {/* Faint grid latitude lines */}
            <g stroke="hsl(0 0% 100% / 0.05)" strokeWidth="1">
              {[150, 300, 450, 600, 750].map((y) => (
                <line key={y} x1="0" y1={y} x2="1600" y2={y} />
              ))}
            </g>
          </svg>

          {/* Left-side navy fade so text stays readable */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, hsl(var(--navy)) 0%, hsl(var(--navy) / 0.85) 40%, hsl(var(--navy) / 0.45) 75%, hsl(var(--navy) / 0.35) 100%)",
            }}
          />
        </div>

        <div className="container relative py-28 md:py-36 lg:py-44 max-w-5xl">
          <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-primary-foreground/70 mb-8">
            <span className="w-8 h-px bg-crimson" />
            EdPath Global
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-tight text-white max-w-4xl">
            {t("home.title")}
          </h1>
          <p className="mt-8 text-lg md:text-xl lg:text-2xl text-primary-foreground/80 max-w-xl leading-[1.5]">
            {t("home.subtitle")}
          </p>
          <a
            href="#destinos"
            className="group mt-12 inline-flex items-center gap-2.5 rounded-lg border border-white/30 bg-white/[0.07] px-7 py-4 text-sm font-medium text-primary-foreground/90 hover:bg-white/10 transition-colors"
          >
            {t("home.ctaChoose")}
            <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
          </a>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-background border-b border-border/60">
        <div className="container max-w-6xl py-20 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
            {pillars.map(({ icon: Icon, key }) => (
              <div key={key} className="flex flex-col">
                <div className="w-11 h-11 rounded-lg bg-navy/[0.04] border border-navy/10 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-navy" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl md:text-[26px] font-semibold text-navy tracking-tight">
                  {t(`pillars.${key}.title`)}
                </h3>
                <div className="h-px w-8 bg-crimson mt-3 mb-4" />
                <p className="text-muted-foreground text-[15px] leading-relaxed max-w-sm">
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
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
              <span className="w-6 h-px bg-crimson" />
              {t("howItWorks.eyebrow")}
              <span className="w-6 h-px bg-crimson" />
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-navy tracking-tight">
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
                <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center font-display text-sm font-semibold tracking-wider ring-4 ring-muted/40 relative z-10">
                  {s.n}
                </div>
                <h3 className="mt-6 font-display text-xl md:text-2xl font-semibold text-navy">
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

