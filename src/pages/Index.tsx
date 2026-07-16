import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Shield, RefreshCw, Compass, ArrowRight } from "lucide-react";
import { CountrySelector } from "@/components/CountrySelector";

export default function Index() {
  const { t } = useTranslation();
  const [tooltip, setTooltip] = useState<{
    key: string;
    x: number;
    y: number;
  } | null>(null);
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
              {/* Destination routes — Canada as origin, subtle arcs to the other 4 */}
              {(() => {
                const dests = [
                  { key: "canada", x: -160, y: -110 },
                  { key: "usa", x: -135, y: -45 },
                  { key: "uk", x: 30, y: -135 },
                  { key: "ireland", x: 8, y: -120 },
                  { key: "australia", x: 180, y: 125 },
                ] as const;
                const destMap: Record<string, { x: number; y: number }> = {
                  canada: { x: -160, y: -110 },
                  usa: { x: -135, y: -45 },
                  uk: { x: 30, y: -135 },
                  ireland: { x: 8, y: -120 },
                  australia: { x: 180, y: 125 },
                };
                // Curved arc between two points (control point pulled toward globe center)
                const arc = (a: { x: number; y: number }, b: { x: number; y: number }) => {
                  const mx = (a.x + b.x) / 2;
                  const my = (a.y + b.y) / 2;
                  // pull toward origin to suggest a great-circle-ish arc
                  const cx = mx * 0.55;
                  const cy = my * 0.55;
                  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
                };
                const routes: [keyof typeof destMap, keyof typeof destMap][] = [
                  ["canada", "usa"],
                  ["canada", "ireland"],
                  ["ireland", "uk"],
                  ["canada", "australia"],
                ];
                const handleEnter =
                  (key: string) => (e: React.MouseEvent<SVGGElement, MouseEvent>) => {
                    setTooltip({ key, x: e.clientX, y: e.clientY });
                  };
                const handleMove = (e: React.MouseEvent<SVGGElement, MouseEvent>) => {
                  setTooltip((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null));
                };
                const handleLeave = () => setTooltip(null);
                return (
                  <>
                    {/* Route lines between destinations */}
                    <g fill="none" stroke="hsl(0 0% 100%)" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 5" strokeLinecap="round">
                      {routes.map(([from, to], i) => (
                        <path key={i} d={arc(destMap[from], destMap[to])} />
                      ))}
                    </g>
                    {/* Destination dots */}
                    {dests.map((d, i) => {
                      const primary = d.key === "canada";
                      const glowR = primary ? 34 : 22;
                      const coreR = primary ? 5.5 : 4;
                      const centerR = primary ? 2.2 : 1.6;
                      const minOpacity = primary ? 0.55 : 0.35;
                      const label = t(`home.globeDestinations.${d.key}.label`);
                      const detail = t(`home.globeDestinations.${d.key}.detail`);
                      return (
                        <g key={d.key} data-destination={d.key}>
                          <title>{`${label} — ${detail}`}</title>
                          <circle
                            cx={d.x}
                            cy={d.y}
                            r={glowR}
                            fill="url(#dotGlow)"
                            opacity={primary ? 1 : 0.7}
                            className="cursor-pointer"
                            style={{ pointerEvents: "all" }}
                            onMouseEnter={handleEnter(d.key)}
                            onMouseMove={handleMove}
                            onMouseLeave={handleLeave}
                          />
                          <circle cx={d.x} cy={d.y} r={coreR} fill="hsl(var(--crimson))">
                            <animate
                              attributeName="opacity"
                              values={`1;${minOpacity};1`}
                              dur={`${primary ? 2.4 : 3 + (i % 3) * 0.4}s`}
                              repeatCount="indefinite"
                            />
                          </circle>
                          <circle cx={d.x} cy={d.y} r={centerR} fill="#ffffff" opacity={primary ? 1 : 0.85} />
                        </g>
                      );
                    })}
                  </>
                );
              })()}
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

          {/* Destination tooltip */}
          {tooltip && (
            <div
              className="fixed z-50 pointer-events-none rounded-xl bg-white/95 backdrop-blur-sm px-4 py-3 shadow-[0_8px_24px_-6px_rgba(5,21,86,0.22)] ring-1 ring-navy/10 max-w-xs"
              style={{ left: tooltip.x + 16, top: tooltip.y - 16 }}
            >
              <p className="text-sm font-bold text-navy">
                {t(`home.globeDestinations.${tooltip.key}.label`)}
              </p>
              <p className="text-xs text-muted-foreground leading-snug mt-1">
                {t(`home.globeDestinations.${tooltip.key}.detail`)}
              </p>
            </div>
          )}

          {/* Left-side fade so text stays readable — keeps graphics visible on the right */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, hsl(228 55% 12% / 0.92) 0%, hsl(228 55% 12% / 0.7) 35%, hsl(228 55% 12% / 0.15) 70%, transparent 100%)",
            }}
          />
        </div>

        <div className="container relative py-28 md:py-36 lg:py-44 max-w-5xl pointer-events-none">
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
            className="group pointer-events-auto mt-12 inline-flex items-center gap-2.5 rounded-xl bg-crimson px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_4px_16px_-4px_hsl(var(--crimson)/0.45)] hover:bg-crimson/90 hover:shadow-[0_8px_24px_-6px_hsl(var(--crimson)/0.55)] hover:-translate-y-0.5 transition-all duration-300"
          >
            {t("home.ctaChoose")}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
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

