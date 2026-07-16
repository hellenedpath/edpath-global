import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type Country = {
  code: string;
  nameKey: string;
  available: boolean;
  to?: string;
  flag: string[]; // 2-3 hex colors forming a flag stripe
  emoji: string;
};

const countries: Country[] = [
  { code: "canada", nameKey: "countries.list.canada", available: true, to: "/canada", emoji: "🇨🇦", flag: ["#D52B1E", "#FFFFFF", "#D52B1E"] },
  { code: "usa", nameKey: "countries.list.usa", available: false, emoji: "🇺🇸", flag: ["#B22234", "#FFFFFF", "#3C3B6E"] },
  { code: "uk", nameKey: "countries.list.uk", available: false, emoji: "🇬🇧", flag: ["#012169", "#FFFFFF", "#C8102E"] },
  { code: "australia", nameKey: "countries.list.australia", available: false, emoji: "🇦🇺", flag: ["#012169", "#FFFFFF", "#E4002B"] },
  { code: "ireland", nameKey: "countries.list.ireland", available: false, emoji: "🇮🇪", flag: ["#169B62", "#FFFFFF", "#FF883E"] },
];

export function CountrySelector() {
  const { t } = useTranslation();

  return (
    <section id="destinos" className="bg-background py-28 md:py-36 scroll-mt-20">
      <div className="container max-w-6xl">
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-20">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
            {t("countries.title")}
          </h2>
          <p className="mt-5 text-muted-foreground/80 text-lg md:text-xl max-w-xl mx-auto">
            {t("countries.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          {countries.map((c) => {
            const inner = (
              <div
                className={cn(
                  "group relative h-full rounded-2xl overflow-hidden pt-9 pb-8 px-8 md:px-10 flex flex-col items-center text-center transition-all duration-500",
                  c.available
                    ? "bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] ring-1 ring-border/60 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-2 cursor-pointer"
                    : "bg-white/70 ring-1 ring-border/60 opacity-95 hover:opacity-100 hover:-translate-y-1 cursor-default",
                )}
              >
                {/* Flag color stripe */}
                <div
                  aria-hidden="true"
                  className="absolute top-0 left-0 right-0 h-1.5 flex"
                >
                  {c.flag.map((color, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <div className="text-3xl mb-4" aria-hidden="true">{c.emoji}</div>
                <span
                  className={cn(
                    "mb-5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.15em] uppercase border",
                    c.available
                      ? "bg-crimson text-white border-crimson"
                      : "bg-muted text-muted-foreground border-border",
                  )}
                >
                  {c.available ? t("countries.available") : t("countries.soon")}
                </span>
                <h3
                  className={cn(
                    "font-display font-semibold leading-[0.95] mb-2",
                    c.available ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl",
                  )}
                  style={{ color: c.available ? "#1B2A4A" : "#5A6478" }}
                >
                  {t(c.nameKey)}
                </h3>
                <div
                  className={cn(
                    "h-px mt-5 transition-all duration-500",
                    c.available ? "w-10 bg-crimson group-hover:w-16" : "w-10 bg-border",
                  )}
                />
                {c.available && (
                  <div className="mt-5 text-sm font-medium text-foreground/60 group-hover:text-crimson transition-colors duration-300">
                    {t("countries.exploreCta")} →
                  </div>
                )}
              </div>
            );

            return c.available && c.to ? (
              <Link key={c.code} to={c.to} aria-label={t(c.nameKey)} className="block h-full">
                {inner}
              </Link>
            ) : (
              <div key={c.code} aria-disabled="true" className="h-full">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
