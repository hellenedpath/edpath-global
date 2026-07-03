import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

export default function Index() {
  const { t } = useTranslation();
  return (
    <>
      <section className="relative bg-navy text-primary-foreground overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, hsl(var(--azul)) 0, transparent 45%), radial-gradient(circle at 85% 70%, hsl(var(--crimson)) 0, transparent 40%)",
          }}
        />
        <div className="container relative py-24 md:py-36 max-w-4xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary-foreground/70 mb-6">
            <span className="w-6 h-px bg-crimson" />
            EdPath Global
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight">
            {t("home.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl">
            {t("home.subtitle")}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/programas"
              className="group inline-flex items-center gap-2 rounded-md bg-crimson px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-crimson/90 transition-colors"
            >
              {t("home.ctaPrograms")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/antes-de-comecar"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-white/10 transition-colors"
            >
              {t("home.ctaBefore")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
