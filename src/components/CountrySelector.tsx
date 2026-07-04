import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type Country = {
  code: string;
  flag: string;
  nameKey: string;
  available: boolean;
  to?: string;
};

const countries: Country[] = [
  { code: "canada", flag: "🇨🇦", nameKey: "countries.list.canada", available: true, to: "/programas" },
  { code: "usa", flag: "🇺🇸", nameKey: "countries.list.usa", available: false },
  { code: "uk", flag: "🇬🇧", nameKey: "countries.list.uk", available: false },
  { code: "australia", flag: "🇦🇺", nameKey: "countries.list.australia", available: false },
  { code: "ireland", flag: "🇮🇪", nameKey: "countries.list.ireland", available: false },
];

export function CountrySelector() {
  const { t } = useTranslation();

  return (
    <section id="destinos" className="bg-background py-24 md:py-32 scroll-mt-20">
      <div className="container max-w-7xl">
        <div className="max-w-2xl mx-auto text-center mb-14 md:mb-18">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            {t("countries.title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg md:text-xl">{t("countries.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6 lg:gap-8">
          {countries.map((c) => {
            const inner = (
              <div
                className={cn(
                  "group relative h-full rounded-2xl border p-7 md:p-9 lg:p-10 flex flex-col items-center text-center gap-4 md:gap-5 transition-all",
                  c.available
                    ? "border-crimson bg-crimson/[0.04] shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                    : "border-dashed border-border/70 bg-muted/30 opacity-90 hover:opacity-100 cursor-not-allowed",
                )}
              >
                <div className="text-5xl md:text-6xl lg:text-7xl leading-none">{c.flag}</div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="font-semibold text-foreground text-lg md:text-xl">{t(c.nameKey)}</div>
                  <div
                    className={cn(
                      "inline-flex items-center gap-1.5 text-sm font-medium rounded-full px-3 py-1",
                      c.available
                        ? "bg-crimson/10 text-crimson"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {c.available ? null : <Lock className="w-3.5 h-3.5" />}
                    {c.available ? t("countries.available") : t("countries.soon")}
                  </div>
                </div>
                {c.available && (
                  <div className="inline-flex items-center gap-1.5 text-sm md:text-base font-medium text-foreground/80 group-hover:text-crimson transition-colors">
                    {t("countries.exploreCta")}
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
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
