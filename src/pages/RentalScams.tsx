import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ExternalLink,
  Flag,
  LifeBuoy,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function SourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer external"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--azul))] hover:underline"
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

export default function RentalScams() {
  const { t } = useTranslation();
  const redFlags = t("rentalScams.redFlags.items", { returnObjects: true }) as string[];
  const protectItems = t("rentalScams.protect.items", { returnObjects: true }) as string[];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy text-primary-foreground overflow-hidden">
        <div className="container relative py-20 md:py-28 max-w-5xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary-foreground/70 mb-6">
            <span className="w-6 h-px bg-crimson" />
            {t("rentalScams.hero.tag")}
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-white">
            {t("rentalScams.hero.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed">
            {t("rentalScams.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Red flags */}
      <section className="container py-16 md:py-20 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-crimson/10 text-crimson">
            <Flag className="w-5 h-5" />
          </span>
          <h2 className="font-display text-2xl md:text-3xl text-navy font-semibold">
            {t("rentalScams.redFlags.title")}
          </h2>
        </div>
        <ul className="space-y-3">
          {redFlags.map((it) => (
            <li
              key={it}
              className="flex items-start gap-3 rounded-md border border-crimson/25 bg-crimson/5 p-4"
            >
              <AlertTriangle className="h-5 w-5 text-crimson shrink-0 mt-0.5" />
              <span className="text-muted-foreground leading-relaxed">{it}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Protect yourself */}
      <section className="bg-white border-y border-border">
        <div className="container py-16 md:py-20 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-azul/10 text-azul">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-navy font-semibold">
              {t("rentalScams.protect.title")}
            </h2>
          </div>
          <ul className="space-y-3">
            {protectItems.map((it) => (
              <li
                key={it}
                className="flex items-start gap-3 rounded-md border border-azul/25 bg-azul/5 p-4"
              >
                <ShieldCheck className="h-5 w-5 text-azul shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-relaxed">{it}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Safe sources */}
      <section className="container py-16 md:py-20 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-azul/10 text-azul">
            <Sparkles className="w-5 h-5" />
          </span>
          <h2 className="font-display text-2xl md:text-3xl text-navy font-semibold">
            {t("rentalScams.sources.title")}
          </h2>
        </div>
        <ul className="space-y-4">
          <li className="rounded-md border border-border bg-card p-4">
            <p className="text-muted-foreground leading-relaxed">
              {t("rentalScams.sources.cmhc.label")}
            </p>
            <div className="mt-2">
              <SourceLink
                href={t("rentalScams.sources.cmhc.url")}
                label={t("rentalScams.sources.cmhc.linkLabel")}
              />
            </div>
          </li>
          <li className="rounded-md border border-border bg-card p-4 text-muted-foreground leading-relaxed">
            {t("rentalScams.sources.housingOffice")}
          </li>
          <li className="rounded-md border border-border bg-card p-4">
            <p className="text-muted-foreground leading-relaxed">
              {t("rentalScams.sources.settlement.label")}
            </p>
            <div className="mt-2">
              <SourceLink
                href={t("rentalScams.sources.settlement.url")}
                label={t("rentalScams.sources.settlement.linkLabel")}
              />
            </div>
          </li>
        </ul>
      </section>

      {/* Victim */}
      <section className="bg-white border-y border-border">
        <div className="container py-14 md:py-16 max-w-4xl">
          <Alert className="border-crimson/40 bg-crimson/5">
            <LifeBuoy className="h-5 w-5 text-crimson" />
            <AlertTitle className="font-display text-navy">
              {t("rentalScams.victim.title")}
            </AlertTitle>
            <AlertDescription className="text-muted-foreground mt-2 leading-relaxed">
              {t("rentalScams.victim.body")}
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Back CTA */}
      <section className="container py-16 max-w-4xl">
        <div className="rounded-lg bg-navy text-white p-8 md:p-10 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-semibold">
            {t("rentalScams.backCta.title")}
          </h2>
          <p className="mt-3 text-white/80 leading-relaxed max-w-2xl mx-auto">
            {t("rentalScams.backCta.body")}
          </p>
          <Button asChild variant="outline" className="mt-6 border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
            <Link to="/alugar-no-canada">{t("rentalScams.backCta.button")}</Link>
          </Button>
        </div>
      </section>

      {/* Seal */}
      <section className="bg-navy text-white">
        <div className="container py-12 md:py-14 max-w-5xl">
          <div className="flex items-start gap-3 max-w-4xl mx-auto">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl md:text-2xl font-semibold text-white">
                {t("rentalSeal.title")}
              </h2>
              <p className="mt-3 text-white/80 leading-relaxed">
                {t("rentalSeal.body")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}