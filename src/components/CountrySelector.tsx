import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import canadaImg from "@/assets/country-canada.jpg";
import usaImg from "@/assets/country-usa.jpg";
import ukImg from "@/assets/country-uk.jpg";
import australiaImg from "@/assets/country-australia.jpg";
import irelandImg from "@/assets/country-ireland.jpg";

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
              <div className="flex flex-col h-full">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.imageAlt}
                    width={1200}
                    height={800}
                    loading="lazy"
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover transition-transform duration-500",
                      c.available ? "group-hover:scale-[1.03]" : "grayscale-[35%] opacity-90",
                    )}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />
                  <span
                    className={cn(
                      "absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.12em] uppercase backdrop-blur-sm",
                      c.available
                        ? "bg-crimson text-white shadow-sm"
                        : "bg-white/85 text-navy/70",
                    )}
                  >
                    {c.available ? t("countries.available") : t("countries.soon")}
                  </span>
                </div>
                <div className="flex flex-col flex-1 p-6 md:p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <Flag code={c.code} className="w-7 h-[18px] shrink-0" />
                    <h3 className="text-xl font-semibold text-navy tracking-tight">
                      {t(c.nameKey)}
                    </h3>
                  </div>
                  <ul className="space-y-2.5 flex-1">
                    {advantages.map((adv, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[14px] leading-snug text-muted-foreground">
                        <Check
                          className={cn(
                            "w-4 h-4 mt-0.5 shrink-0",
                            c.available ? "text-crimson" : "text-navy/40",
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
              "group rounded-2xl bg-white ring-1 ring-border/50 overflow-hidden shadow-[0_2px_14px_-6px_rgba(5,21,86,0.08)] flex flex-col h-full";
            if (c.available && c.to) {
              return (
                <Link
                  key={c.code}
                  to={c.to}
                  aria-label={t(c.nameKey)}
                  className={cn(base, "ring-2 ring-crimson/30 hover:ring-crimson/60 hover:shadow-[0_12px_32px_-10px_rgba(5,21,86,0.18)] hover:-translate-y-0.5 transition-all duration-300")}
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
