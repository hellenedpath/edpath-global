import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

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
    <section id="destinos" className="bg-background py-24 md:py-32 scroll-mt-20">
      <div className="container max-w-6xl">
        <div className="max-w-2xl mx-auto text-center mb-14 md:mb-18">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            {t("countries.title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg md:text-xl">{t("countries.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          {countries.map((c) => {
            const inner = (
              <div
                className={cn(
                  "group relative h-full rounded-2xl p-10 md:p-12 flex flex-col items-center text-center transition-all duration-500",
                  c.available
                    ? "bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border-t-4 border-crimson hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-2 cursor-pointer"
                    : "bg-white/60 border-t border-border opacity-95 hover:opacity-100 hover:-translate-y-1 cursor-default",
                )}
              >
                <span
                  className={cn(
                    "mb-6 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border",
                    c.available
                      ? "bg-crimson/5 text-crimson border-crimson/10"
                      : "bg-muted text-muted-foreground border-border",
                  )}
                >
                  {c.available ? t("countries.available") : t("countries.soon")}
                </span>
                <h3
                  className={cn(
                    "font-display font-medium leading-tight mb-2",
                    c.available ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl",
                  )}
                  style={{ color: c.available ? "#1B2A4A" : "#5A6478" }}
                >
                  {t(c.nameKey)}
                </h3>
                <div
                  className={cn(
                    "h-px mt-6 transition-all duration-500",
                    c.available ? "w-8 bg-crimson group-hover:w-16" : "w-8 bg-border",
                  )}
                />
                {c.available && (
                  <div className="mt-6 text-sm font-medium text-foreground/70 group-hover:text-crimson transition-colors duration-300">
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
