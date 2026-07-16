import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

function Flag({ code, className }: { code: string; className?: string }) {
  const common = "block rounded-[3px] overflow-hidden ring-1 ring-black/10 shadow-sm";
  const cls = cn(common, className);
  switch (code) {
    case "canada":
      return (
        <svg viewBox="0 0 60 30" className={cls} aria-hidden="true">
          <rect width="60" height="30" fill="#fff" />
          <rect width="15" height="30" fill="#D52B1E" />
          <rect x="45" width="15" height="30" fill="#D52B1E" />
          <path fill="#D52B1E" d="M30 8l1.6 3.2 3.4-.8-1.6 3 2.6 2-3.2.6.4 3.2L30 17.6 26.8 19.2l.4-3.2-3.2-.6 2.6-2-1.6-3 3.4.8z" />
        </svg>
      );
    case "usa":
      return (
        <svg viewBox="0 0 60 30" className={cls} aria-hidden="true">
          {Array.from({ length: 13 }).map((_, i) => (
            <rect key={i} y={i * (30 / 13)} width="60" height={30 / 13} fill={i % 2 === 0 ? "#B22234" : "#fff"} />
          ))}
          <rect width="24" height={30 * 7 / 13} fill="#3C3B6E" />
        </svg>
      );
    case "uk":
      return (
        <svg viewBox="0 0 60 30" className={cls} aria-hidden="true">
          <rect width="60" height="30" fill="#012169" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
          <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
          <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
        </svg>
      );
    case "australia":
      return (
        <svg viewBox="0 0 60 30" className={cls} aria-hidden="true">
          <rect width="60" height="30" fill="#012169" />
          <g transform="scale(0.5)">
            <rect width="60" height="30" fill="#012169" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
            <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
            <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
          </g>
          <g fill="#fff">
            <circle cx="15" cy="22" r="1.5" />
            <circle cx="42" cy="8" r="1.6" />
            <circle cx="48" cy="16" r="1.6" />
            <circle cx="42" cy="22" r="1.6" />
            <circle cx="52" cy="22" r="1.2" />
            <circle cx="47" cy="26" r="1.2" />
          </g>
        </svg>
      );
    case "ireland":
      return (
        <svg viewBox="0 0 60 30" className={cls} aria-hidden="true">
          <rect width="20" height="30" fill="#169B62" />
          <rect x="20" width="20" height="30" fill="#fff" />
          <rect x="40" width="20" height="30" fill="#FF883E" />
        </svg>
      );
    default:
      return null;
  }
}

type Country = {
  code: string;
  nameKey: string;
  available: boolean;
  to?: string;
};

const countries: Country[] = [
  { code: "canada", nameKey: "countries.list.canada", available: true, to: "/canada" },
  { code: "usa", nameKey: "countries.list.usa", available: false },
  { code: "uk", nameKey: "countries.list.uk", available: false },
  { code: "australia", nameKey: "countries.list.australia", available: false },
  { code: "ireland", nameKey: "countries.list.ireland", available: false },
];

export function CountrySelector() {
  const { t } = useTranslation();
  const canada = countries.find((c) => c.code === "canada")!;
  const others = countries.filter((c) => c.code !== "canada");

  return (
    <section id="destinos" className="bg-background py-20 md:py-24 scroll-mt-20">
      <div className="container max-w-6xl">
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-14">
          <h2 className="font-display text-4xl md:text-5xl lg:text-[56px] font-medium tracking-tight text-navy leading-[1.05]">
            {t("countries.title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            {t("countries.subtitle")}
          </p>
        </div>

        {/* Featured: Canada */}
        <Link
          to={canada.to!}
          aria-label={t(canada.nameKey)}
          className="group relative block rounded-2xl overflow-hidden bg-white ring-1 ring-border shadow-[0_10px_40px_-20px_rgba(5,21,86,0.25)] hover:shadow-[0_20px_50px_-20px_rgba(224,64,91,0.35)] hover:-translate-y-0.5 transition-all duration-500"
        >
          <div aria-hidden="true" className="absolute top-0 left-0 bottom-0 w-1 bg-crimson" />
          <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12 px-8 md:px-14 py-10 md:py-12">
            <div className="flex-1 text-center md:text-left">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold tracking-[0.18em] uppercase bg-crimson text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {t("countries.available")}
              </span>
              <div className="mt-4 flex items-center gap-4 justify-center md:justify-start">
                <Flag code="canada" className="w-10 h-6" />
                <h3 className="font-display font-medium leading-[0.95] text-5xl md:text-6xl tracking-tight text-navy">
                  {t(canada.nameKey)}
                </h3>
              </div>
              <div className="mt-5 inline-flex items-center gap-2 text-crimson font-medium text-sm group-hover:gap-3 transition-all">
                {t("countries.exploreCta")}
                <span aria-hidden="true">→</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Coming soon strip */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {others.map((c) => (
            <div
              key={c.code}
              aria-disabled="true"
              className="relative rounded-xl bg-white ring-1 ring-border/70 px-5 py-6 flex items-center gap-3 text-left opacity-90"
            >
              <Flag code={c.code} className="w-8 h-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg font-medium leading-tight tracking-tight text-navy truncate">
                  {t(c.nameKey)}
                </h3>
                <span className="mt-1 inline-block text-[10px] font-medium tracking-[0.15em] uppercase text-muted-foreground">
                  {t("countries.soon")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
