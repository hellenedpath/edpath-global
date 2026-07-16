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

  return (
    <section id="destinos" className="bg-background py-20 md:py-24 scroll-mt-20">
      <div className="container max-w-6xl">
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-navy leading-tight">
            {t("countries.title")}
          </h2>
          <p className="mt-3 text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
            {t("countries.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {countries.map((c) => {
            const inner = (
              <div className="flex items-center gap-3">
                <Flag code={c.code} className="w-8 h-5 shrink-0" />
                <h3 className="text-lg font-semibold text-navy truncate flex-1">
                  {t(c.nameKey)}
                </h3>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-[0.12em] uppercase shrink-0",
                    c.available
                      ? "bg-crimson/10 text-crimson"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {c.available ? t("countries.available") : t("countries.soon")}
                </span>
              </div>
            );
            const base =
              "rounded-xl bg-white ring-1 ring-border/70 px-5 py-5 block";
            if (c.available && c.to) {
              return (
                <Link
                  key={c.code}
                  to={c.to}
                  aria-label={t(c.nameKey)}
                  className={cn(base, "hover:ring-crimson/40 transition-colors")}
                >
                  {inner}
                </Link>
              );
            }
            return (
              <div key={c.code} aria-disabled="true" className={base}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
