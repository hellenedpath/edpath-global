import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Flag } from "@/components/Flag";
import canadaImg from "@/assets/country-canada.jpg";
import usaImg from "@/assets/country-usa.jpg";
import ukImg from "@/assets/country-uk.jpg";
import australiaImg from "@/assets/country-australia.jpg";
import irelandImg from "@/assets/country-ireland.jpg";

type Country = {
  code: "canada" | "usa" | "uk" | "australia" | "ireland";
  nameKey: string;
  available: boolean;
  to?: string;
  image: string;
  imageAlt: string;
};

const countries: Country[] = [
  { code: "canada", nameKey: "countries.list.canada", available: true, to: "/canada", image: canadaImg, imageAlt: "Rocky Mountains reflected in a turquoise lake in Canada" },
  { code: "usa", nameKey: "countries.list.usa", available: false, image: usaImg, imageAlt: "New York City skyline at dusk" },
  { code: "uk", nameKey: "countries.list.uk", available: false, image: ukImg, imageAlt: "Big Ben and Westminster in London" },
  { code: "australia", nameKey: "countries.list.australia", available: false, image: australiaImg, imageAlt: "Sydney Opera House and Harbour Bridge" },
  { code: "ireland", nameKey: "countries.list.ireland", available: false, image: irelandImg, imageAlt: "Cliffs of Moher in Ireland" },
];

export function CountrySelector() {
  const { t } = useTranslation();

  return (
    <section id="destinos" className="bg-white py-20 md:py-28 scroll-mt-20">
      <div className="container max-w-6xl">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-navy leading-tight">
            {t("countries.title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {countries.map((c) => {
            const advantages = t(`countries.advantages.${c.code}`, {
              returnObjects: true,
            }) as string[];
            const inner = (
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <img
                  src={c.image}
                  alt={c.imageAlt}
                  width={1200}
                  height={1500}
                  loading="lazy"
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-transform duration-[700ms] ease-out",
                    c.available
                      ? "group-hover:scale-[1.08]"
                      : "grayscale-[45%] opacity-90 group-hover:scale-[1.04] group-hover:grayscale-0 group-hover:opacity-100",
                  )}
                />
                {/* Base gradient for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-transparent" />

                {/* Status badge */}
                <span
                  className={cn(
                    "absolute top-4 right-4 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[0.14em] uppercase backdrop-blur-md shadow-md",
                    c.available
                      ? "bg-crimson text-white ring-1 ring-white/20"
                      : "bg-white/80 text-navy/70 ring-1 ring-white/40",
                  )}
                >
                  {c.available ? t("countries.available") : t("countries.soon")}
                </span>

                {/* Content overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-7 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <Flag code={c.code} className="w-8 shrink-0" />
                    <h3 className="text-2xl md:text-[26px] font-bold tracking-tight leading-none">
                      {t(c.nameKey)}
                    </h3>
                  </div>
                  <ul
                    className={cn(
                      "space-y-1.5 overflow-hidden transition-all duration-500 ease-out",
                      "max-h-0 opacity-0 group-hover:max-h-48 group-hover:opacity-100 group-hover:mt-2",
                    )}
                  >
                    {advantages.map((adv, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13.5px] leading-snug text-white/90">
                        <Check
                          className={cn(
                            "w-4 h-4 mt-0.5 shrink-0",
                            c.available ? "text-crimson" : "text-white/70",
                          )}
                          strokeWidth={2.5}
                        />
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
            const base =
              "group relative rounded-2xl overflow-hidden shadow-[0_4px_18px_-6px_rgba(5,21,86,0.18)] transition-all duration-500 ease-out block";
            if (c.available && c.to) {
              return (
                <Link
                  key={c.code}
                  to={c.to}
                  aria-label={t(c.nameKey)}
                  className={cn(
                    base,
                    "ring-2 ring-crimson/40 hover:ring-crimson hover:shadow-[0_24px_50px_-16px_rgba(224,64,91,0.45)] hover:-translate-y-1.5",
                  )}
                >
                  {inner}
                </Link>
              );
            }
            return (
              <div
                key={c.code}
                aria-disabled="true"
                className={cn(base, "ring-1 ring-border/50 hover:shadow-[0_20px_40px_-14px_rgba(5,21,86,0.28)] hover:-translate-y-1")}
              >
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
