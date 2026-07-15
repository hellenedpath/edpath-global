import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Compass } from "lucide-react";
import { CountrySelector } from "@/components/CountrySelector";
import heroStudent from "@/assets/hero-student.jpg";

export default function Index() {
  const { t } = useTranslation();
  return (
    <>
      <section className="relative bg-navy text-primary-foreground overflow-hidden">
        <img
          src={heroStudent}
          alt=""
          aria-hidden="true"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover opacity-85 pointer-events-none select-none"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--navy) / 0.92) 0%, hsl(var(--navy) / 0.55) 45%, hsl(var(--navy) / 0.22) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.10] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, hsl(var(--azul)) 0, transparent 45%), radial-gradient(circle at 85% 70%, hsl(var(--crimson)) 0, transparent 40%)",
          }}
        />
        <div className="container relative py-28 md:py-36 lg:py-48 max-w-5xl">
          <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-primary-foreground/70 mb-8">
            <span className="w-8 h-px bg-crimson" />
            EdPath Global
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-tight text-white max-w-4xl">
            {t("home.title")}
          </h1>
          <p className="mt-8 text-lg md:text-xl lg:text-2xl text-primary-foreground/80 max-w-xl leading-[1.5]">
            {t("home.subtitle")}
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              to="/meu-caminho"
              className="group inline-flex items-center gap-2.5 rounded-lg bg-crimson px-8 py-4 text-base font-semibold text-primary-foreground shadow-md shadow-crimson/25 hover:bg-crimson/90 transition-colors"
            >
              <Compass className="w-5 h-5" />
              {t("home.ctaQuiz")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/#destinos"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/[0.07] px-7 py-4 text-sm font-medium text-primary-foreground/90 hover:bg-white/10 transition-colors"
            >
              {t("home.ctaExplore")}
            </Link>
          </div>
          <p className="mt-5 text-sm text-primary-foreground/65">
            {t("home.quizNote")}
          </p>
        </div>
      </section>
      <CountrySelector />
    </>
  );
}

