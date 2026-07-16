import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { ArrowRight, Compass, GraduationCap, DollarSign, FileCheck, Home, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type Alt = { to: string; labelKey: string };
type Step = {
  key: "path" | "school" | "costs" | "visa" | "move" | "arrival";
  to: string;
  Icon: typeof Compass;
  alts?: Alt[];
};

const steps: Step[] = [
  { key: "path", to: "/meu-caminho?country=canada", Icon: Compass },
  {
    key: "school",
    to: "/canada/pgwp",
    Icon: GraduationCap,
    alts: [
      { to: "/canada/instituicoes", labelKey: "alt1" },
      { to: "/programas", labelKey: "alt2" },
    ],
  },
  {
    key: "costs",
    to: "/custos",
    Icon: DollarSign,
    alts: [{ to: "/simulador-financeiro", labelKey: "alt1" }],
  },
  { key: "visa", to: "/study-permit", Icon: FileCheck },
  {
    key: "move",
    to: "/alugar-no-canada",
    Icon: Home,
    alts: [
      { to: "/golpes-de-aluguel", labelKey: "alt1" },
      { to: "/trabalho-moradia", labelKey: "alt2" },
    ],
  },
  {
    key: "arrival",
    to: "/saude",
    Icon: MapPin,
    alts: [{ to: "/familia", labelKey: "alt1" }],
  },
];

export default function Canada() {
  const { t } = useTranslation();
  const [highlightStep, setHighlightStep] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("canadaJourney.recommendedStep");
      const n = raw ? parseInt(raw, 10) : NaN;
      if (n >= 1 && n <= 6) setHighlightStep(n);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <section className="container py-16 md:py-24">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span className="text-2xl leading-none">🇨🇦</span>
          <span className="uppercase tracking-widest text-xs">
            {t("canadaSteps.eyebrow")}
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-navy tracking-tight">
          {t("canadaSteps.title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          {t("canadaSteps.subtitle")}
        </p>
      </div>

      <ol className="mt-14 relative">
        {/* vertical spine */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-6 md:left-9 top-3 bottom-3 -translate-x-1/2 w-[3px] rounded-full bg-gradient-to-b from-crimson via-crimson/50 to-border/70"
        />

        {steps.map((step, i) => {
          const { Icon } = step;
          const isLast = i === steps.length - 1;
          const num = i + 1;
          const isHighlighted = highlightStep === num;
          return (
            <li key={step.key} className={cn("relative", !isLast && "pb-8 md:pb-10")}>
              <div className="flex gap-5 md:gap-8">
                {/* Number badge */}
                <div className="relative shrink-0">
                  <div
                    className={cn(
                      "relative z-10 flex h-12 w-12 md:h-[72px] md:w-[72px] items-center justify-center rounded-full font-display font-semibold text-xl md:text-3xl shadow-[0_8px_24px_-12px_hsl(var(--crimson)/0.4)] transition-all",
                      isHighlighted
                        ? "bg-crimson border-2 border-crimson text-white ring-4 ring-crimson/20"
                        : "bg-background border-2 border-crimson text-crimson",
                    )}
                  >
                    {num}
                  </div>
                </div>

                {/* Card */}
                <div
                  className={cn(
                    "flex-1 rounded-2xl border bg-card p-6 md:p-8 transition-all hover:border-crimson/60 hover:shadow-lg",
                    isHighlighted
                      ? "border-crimson/60 shadow-md ring-1 ring-crimson/20"
                      : "border-border",
                  )}
                >
                  {isHighlighted && (
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-crimson/10 text-crimson text-xs font-semibold px-2.5 py-1">
                      <MapPin className="h-3 w-3" />
                      {t("canadaSteps.youAreHere")}
                    </div>
                  )}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg bg-crimson/10 text-crimson shrink-0">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                        {t("canadaSteps.stepLabel")} {num}
                      </div>
                      <h2 className="mt-1 font-display text-2xl md:text-[28px] font-semibold text-navy tracking-tight">
                        {t(`canadaSteps.items.${step.key}.title`)}
                      </h2>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {t(`canadaSteps.items.${step.key}.desc`)}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link
                      to={step.to}
                      className="group inline-flex items-center gap-1.5 rounded-lg bg-crimson px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-crimson/90 hover:shadow-md"
                    >
                      {t(`canadaSteps.items.${step.key}.cta`)}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>

                    {step.alts && step.alts.length > 0 && (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                          {t("canadaSteps.alsoSee")}
                        </span>
                        {step.alts.map((a) => (
                          <Link
                            key={a.to}
                            to={a.to}
                            className="text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-crimson"
                          >
                            {t(`canadaSteps.items.${step.key}.${a.labelKey}`)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {highlightStep !== null && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => {
              try {
                sessionStorage.removeItem("canadaJourney.recommendedStep");
              } catch {
                /* ignore */
              }
              setHighlightStep(null);
            }}
            className="text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-crimson transition-colors"
          >
            {t("canadaSteps.clearHighlight")}
          </button>
        </div>
      )}
    </section>
  );
}