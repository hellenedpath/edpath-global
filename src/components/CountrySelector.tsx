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
    <section className="bg-background py-20 md:py-28">
      <div className="container max-w-6xl">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t("countries.title")}
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">{t("countries.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {countries.map((c) => {
            const inner = (
              <div
                className={cn(
                  "group relative h-full rounded-xl border p-6 flex flex-col items-start gap-3 transition-all",
                  c.available
                    ? "border-border bg-card hover:border-crimson hover:shadow-md cursor-pointer"
                    : "border-dashed border-border bg-muted/40 cursor-not-allowed",
                )}
              >
                <div className="text-4xl leading-none">{c.flag}</div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{t(c.nameKey)}</div>
                  <div
                    className={cn(
                      "mt-1 inline-flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5",
                      c.available
                        ? "bg-crimson/10 text-crimson"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {c.available ? null : <Lock className="w-3 h-3" />}
                    {c.available ? t("countries.available") : t("countries.soon")}
                  </div>
                </div>
                {c.available && (
                  <div className="inline-flex items-center gap-1 text-sm font-medium text-foreground/80 group-hover:text-crimson transition-colors">
                    {t("countries.exploreCta")}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
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
