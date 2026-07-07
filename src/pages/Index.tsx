import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Compass } from "lucide-react";
import { CountrySelector } from "@/components/CountrySelector";
import heroGlobal from "@/assets/hero-global.jpg";

export default function Index() {
  const { t } = useTranslation();
  return (
    <>
      <section className="relative bg-navy text-primary-foreground overflow-hidden">
        <img
          src={heroGlobal}
          alt=""
          aria-hidden="true"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover opacity-60 pointer-events-none select-none"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--navy) / 0.92) 0%, hsl(var(--navy) / 0.75) 55%, hsl(var(--navy) / 0.55) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.10] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, hsl(var(--azul)) 0, transparent 45%), radial-gradient(circle at 85% 70%, hsl(var(--crimson)) 0, transparent 40%)",
          }}
        />
        <div className="container relative py-24 md:py-32 lg:py-40 max-w-5xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary-foreground/70 mb-6">
            <span className="w-6 h-px bg-crimson" />
            EdPath Global
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-white">
            {t("home.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed">
            {t("home.subtitle")}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/meu-caminho"
              className="group inline-flex items-center gap-2 rounded-md bg-crimson px-7 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-crimson/20 hover:bg-crimson/90 transition-colors"
            >
              <Compass className="w-5 h-5" />
              Descubra seu caminho em 2 minutos
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/#destinos"
              className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/5 px-6 py-4 text-sm font-medium text-primary-foreground/90 hover:bg-white/10 transition-colors"
            >
              Explorar por destino
            </Link>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/70">
            6 perguntas rápidas · roteiro personalizado em 8 etapas
          </p>
        </div>
      </section>
      <CountrySelector />
    </>
  );
}

