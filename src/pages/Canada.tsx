import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, BookOpen, Calendar, DollarSign, Heart, Home, Users, GraduationCap } from "lucide-react";

const themes = [
  { key: "programs", to: "/programas", Icon: BookOpen },
  { key: "pgwp", to: "/canada/pgwp", Icon: GraduationCap, label: "Verificador PGWP", description: "Descubra se sua área de estudo dá direito à permissão de trabalho pós-graduação." },
  { key: "before", to: "/antes-de-comecar", Icon: Calendar },
  { key: "costs", to: "/custos", Icon: DollarSign },
  { key: "health", to: "/saude", Icon: Heart },
  { key: "family", to: "/familia", Icon: Users },
  { key: "work", to: "/trabalho-moradia", Icon: Home },
];

export default function Canada() {
  const { t } = useTranslation();
  return (
    <section className="container py-16 md:py-24">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span className="text-2xl leading-none">🇨🇦</span>
          <span className="uppercase tracking-widest text-xs">{t("countries.list.canada")}</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-navy tracking-tight">
          {t("countries.portalTitle")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          {t("countries.portalSubtitle")}
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {themes.map(({ key, to, Icon, label }: any) => (
          <Link
            key={key}
            to={to}
            className="group rounded-2xl border border-border bg-card p-6 md:p-7 transition-all hover:border-crimson hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-crimson/10 text-crimson">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-5 font-semibold text-lg text-foreground">{label ?? t(`nav.${key}`)}</h2>
            <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 group-hover:text-crimson transition-colors">
              {t("countries.exploreCta")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}