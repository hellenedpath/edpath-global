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
      <section className="relative text-primary-foreground overflow-x-clip">
        {/* Base gradient: deep navy → richer royal blue at base */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, hsl(228 70% 12%) 0%, hsl(221 55% 18%) 40%, hsl(221 60% 24%) 85%, hsl(221 65% 30%) 100%)",
          }}
        />

        <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-[45%_55%] gap-10 lg:gap-12 items-center py-20 md:py-28 lg:py-32 lg:min-h-[90vh]">
          {/* Left column: text */}
          <div className="flex flex-col justify-center max-w-xl">
            <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-primary-foreground/70 mb-8">
              <span className="w-8 h-px bg-crimson" />
              EdPath Global
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.05] tracking-[-0.02em] text-white">
              {t("home.title")}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 leading-relaxed font-sans max-w-md">
              {t("home.subtitle")}
            </p>
            <a
              href="#destinos"
              className="group mt-8 inline-flex items-center gap-2.5 rounded-xl bg-crimson px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_4px_16px_-4px_hsl(var(--crimson)/0.45)] hover:bg-crimson/90 hover:shadow-[0_8px_24px_-6px_hsl(var(--crimson)/0.55)] hover:-translate-y-0.5 transition-all duration-300 w-fit"
            >
              {t("home.ctaChoose")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Right column: immersive dot globe */}
          <div className="relative h-[460px] sm:h-[540px] lg:h-[680px] xl:h-[760px] lg:-mr-8 xl:-mr-16">
            <svg
              className="w-full h-full"
              viewBox="-450 -450 900 900"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--crimson))" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="hsl(var(--crimson))" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="globeFadeGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="white" stopOpacity="1" />
                  <stop offset="70%" stopColor="white" stopOpacity="1" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
                <mask id="globeFade">
                  <rect x="-450" y="-450" width="900" height="900" fill="black" />
                  <circle cx="0" cy="0" r="440" fill="url(#globeFadeGrad)" />
                </mask>
                <pattern id="dotGrid" width="12" height="12" patternUnits="userSpaceOnUse">
                  <circle cx="6" cy="6" r="1.3" fill="hsl(221 75% 78%)" fillOpacity="0.72" />
                </pattern>
                <clipPath id="globeClip">
                  <circle r="290" />
                </clipPath>
              </defs>

              <g mask="url(#globeFade)">
                <g transform="scale(1.25)">
                  {/* No hard circular base — grid and dots melt into the background */}

                  {/* Subtle grid behind the continents */}
                  {/* Meridians */}
                  {[0, 30, 60, 90, 120, 150].map((a) => (
                    <ellipse
                      key={a}
                      rx="290"
                      ry={290 * Math.abs(Math.cos((a * Math.PI) / 180))}
                      fill="none"
                      stroke="hsl(221 80% 76%)"
                      strokeOpacity="0.15"
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
                      stroke="hsl(221 80% 76%)"
                      strokeOpacity="0.13"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Dot-map continents — landmasses formed by a regular dot mesh */}
                  <g clipPath="url(#globeClip)" fill="url(#dotGrid)">
                    {/* North America */}
                    <path d="M -240 -180 L -150 -190 L -95 -150 L -80 -100 L -110 -55 L -130 -30 L -155 -20 L -175 -55 L -205 -70 L -230 -110 Z" />
                    {/* Central America */}
                    <path d="M -140 -20 L -110 -10 L -95 15 L -80 35 L -95 30 L -120 10 Z" />
                    {/* South America */}
                    <path d="M -110 30 L -70 20 L -55 55 L -60 100 L -80 140 L -95 155 L -105 130 L -115 90 Z" />
                    {/* Europe */}
                    <path d="M -10 -155 L 45 -160 L 60 -140 L 55 -110 L 30 -95 L 5 -100 L -15 -120 Z" />
                    {/* Africa */}
                    <path d="M -5 -90 L 55 -95 L 70 -55 L 65 -10 L 45 40 L 25 65 L 5 55 L -10 20 L -15 -35 Z" />
                    {/* Asia */}
                    <path d="M 60 -160 L 175 -170 L 225 -140 L 235 -100 L 210 -60 L 170 -50 L 130 -60 L 95 -80 L 70 -105 Z" />
                    {/* India */}
                    <path d="M 100 -55 L 130 -50 L 135 -20 L 115 -5 L 100 -25 Z" />
                    {/* SE Asia / Indonesia */}
                    <path d="M 155 -20 L 205 -15 L 210 10 L 175 15 L 150 5 Z" />
                    {/* Australia */}
                    <path d="M 155 85 L 210 80 L 225 115 L 205 140 L 165 135 L 145 115 Z" />
                    {/* Greenland */}
                    <path d="M -90 -195 L -55 -200 L -40 -170 L -60 -150 L -85 -160 Z" />
                    {/* British Isles */}
                    <path d="M 2 -140 L 22 -142 L 20 -122 L 4 -120 Z" />
                    {/* Japan */}
                    <path d="M 225 -85 L 240 -70 L 232 -55 L 218 -70 Z" />
                  </g>

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
                    const arc = (a: { x: number; y: number }, b: { x: number; y: number }) => {
                      const mx = (a.x + b.x) / 2;
                      const my = (a.y + b.y) / 2;
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
                        <g fill="none" stroke="hsl(0 0% 100%)" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 5" strokeLinecap="round">
                          {routes.map(([from, to], i) => (
                            <path key={i} d={arc(destMap[from], destMap[to])} />
                          ))}
                        </g>
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
          </div>
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

