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
  const canada = countries.find((c) => c.code === "canada")!;
  const others = countries.filter((c) => c.code !== "canada");

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

        {/* Featured: Canada */}
        <Link
          to={canada.to!}
          aria-label={t(canada.nameKey)}
          className="group relative block rounded-3xl overflow-hidden bg-white ring-2 ring-crimson/40 shadow-[0_24px_60px_-24px_rgba(224,64,91,0.35)] hover:shadow-[0_30px_70px_-20px_rgba(224,64,91,0.5)] hover:-translate-y-1 transition-all duration-500"
        >
          {/* Flag stripe */}
          <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-2 flex">
            {canada.flag.map((color, i) => (
              <div key={i} className="flex-1" style={{ backgroundColor: color }} />
            ))}
          </div>
          {/* Ambient crimson glow */}
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--crimson) / 0.14) 0%, transparent 65%)",
            }}
          />
          <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12 px-8 md:px-16 py-12 md:py-14">
            <div className="text-7xl md:text-8xl leading-none" aria-hidden="true">
              {canada.emoji}
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.15em] uppercase bg-crimson text-white shadow-[0_6px_16px_-6px_hsl(var(--crimson)/0.6)]">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {t("countries.available")}
              </span>
              <h3
                className="font-display font-semibold leading-[0.95] mt-4 text-5xl md:text-6xl"
                style={{ color: "#1B2A4A" }}
              >
                {t(canada.nameKey)}
              </h3>
              <div className="h-px w-12 bg-crimson mt-5 mb-5 mx-auto md:mx-0 group-hover:w-20 transition-all duration-500" />
              <div className="inline-flex items-center gap-2 text-crimson font-semibold text-[15px] group-hover:gap-3 transition-all">
                {t("countries.exploreCta")}
                <span aria-hidden="true">→</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Coming soon strip */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {others.map((c) => (
            <div
              key={c.code}
              aria-disabled="true"
              className={cn(
                "relative rounded-2xl overflow-hidden bg-white/60 ring-1 ring-border/60 px-6 py-8 flex flex-col items-center text-center opacity-70 hover:opacity-90 transition-opacity duration-300",
              )}
            >
              <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-1 flex">
                {c.flag.map((color, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                ))}
              </div>
              <div className="text-4xl mb-3" aria-hidden="true">
                {c.emoji}
              </div>
              <h3
                className="font-display text-xl md:text-2xl font-semibold leading-none mb-3"
                style={{ color: "#5A6478" }}
              >
                {t(c.nameKey)}
              </h3>
              <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-[0.15em] uppercase bg-muted text-muted-foreground">
                {t("countries.soon")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
