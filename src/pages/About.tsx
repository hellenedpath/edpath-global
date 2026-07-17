import { useTranslation } from "react-i18next";
import { Check, ShieldCheck, FileCheck, Clock, Eye, Handshake, Scale } from "lucide-react";


export default function About() {
  const { t } = useTranslation();

  const beliefs = t("about.beliefs.items", { returnObjects: true }) as unknown as string[];
  const services = t("about.services.items", { returnObjects: true }) as unknown as Array<{
    title: string;
    content: string;
  }>;
  const serviceIcons = [FileCheck, Clock, Eye, Handshake];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-background overflow-hidden">
        <div className="container py-20 md:py-28 max-w-5xl">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-navy">
            {t("about.hero.title")}
          </h1>
          <div className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed whitespace-pre-line">
            {t("about.hero.subtitle")}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, label: t("about.hero.badges.0") },
              { icon: FileCheck, label: t("about.hero.badges.1") },
              { icon: Scale, label: t("about.hero.badges.2") },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-sm"
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-azul/10 text-azul shrink-0">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-sm font-medium text-navy leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            {t("about.hero.expansionNote")}
          </p>
        </div>
      </section>

      {/* Beliefs */}
      <section className="bg-navy text-primary-foreground">
        <div className="container py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-center">
              {t("about.beliefs.title")}
            </h2>
            <div className="mt-12 grid gap-6 md:gap-8">
              {beliefs.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-xl bg-white/5 border border-white/10 p-6 md:p-8"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                    <Check className="w-5 h-5" />
                  </span>
                  <p className="text-lg leading-relaxed text-primary-foreground/90">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="bg-background">
        <div className="container py-16 md:py-24">
          <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card p-8 md:p-12 shadow-sm">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
              {t("about.experience.title")}
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {t("about.experience.content")}
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-muted/30">
        <div className="container py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
                {t("about.services.title")}
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {t("about.services.subtitle")}
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {services.map((item, i) => {
                const Icon = serviceIcons[i] ?? FileCheck;
                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm"
                  >
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-azul/10 text-azul mb-4">
                      <Icon className="w-5 h-5" />
                    </span>
                    <h3 className="font-display text-xl font-semibold text-navy">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-background">
        <div className="container py-16 md:py-20">
          <div className="max-w-4xl mx-auto rounded-xl border-l-4 border-azul bg-card p-8 md:p-10 shadow-sm">
            <p className="text-muted-foreground leading-relaxed">
              {t("about.disclaimer")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
