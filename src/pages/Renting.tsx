import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  FileText,
  Home,
  KeyRound,
  Landmark,
  ShieldAlert,
  ShieldCheck,
  Users,
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

export default function Renting() {
  const { t } = useTranslation();
  const oneBedRows = t("renting.types.oneBed.rows", { returnObjects: true }) as string[];
  const twoBedRows = t("renting.types.twoBed.rows", { returnObjects: true }) as string[];
  const rights = t("renting.rights.items", { returnObjects: true }) as string[];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy text-primary-foreground overflow-hidden">
        <div className="container relative py-20 md:py-28 max-w-5xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary-foreground/70 mb-6">
            <span className="w-6 h-px bg-crimson" />
            {t("renting.hero.tag")}
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-white">
            {t("renting.hero.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed">
            {t("renting.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Golden rule */}
      <section className="container py-12 md:py-16 max-w-4xl">
        <Alert className="border-crimson/40 bg-crimson/5">
          <ShieldAlert className="h-5 w-5 text-crimson" />
          <AlertTitle className="font-display text-navy text-lg">
            {t("renting.goldenRule.title")}
          </AlertTitle>
          <AlertDescription className="text-muted-foreground mt-2 leading-relaxed">
            {t("renting.goldenRule.body")}
          </AlertDescription>
        </Alert>
      </section>

      {/* First days */}
      <section className="container pb-8 max-w-4xl">
        <div className="rounded-lg border border-border bg-card p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-azul/10 text-azul">
              <KeyRound className="w-5 h-5" />
            </span>
            <h2 className="font-display text-2xl text-navy font-semibold">
              {t("renting.firstDays.title")}
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {t("renting.firstDays.body")}
          </p>
        </div>
      </section>

      {/* Types + ranges */}
      <section className="bg-white border-y border-border">
        <div className="container py-16 md:py-20 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
              {t("renting.types.title")}
            </h2>
            <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground/80">
              {t("renting.types.reference")}
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Card className="border-azul/20 bg-azul/5 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-azul font-medium">
                  <Home className="h-4 w-4" /> {t("renting.types.shared.label")}
                </div>
                <CardTitle className="font-display text-2xl text-navy mt-2">
                  {t("renting.types.shared.value")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {t("renting.types.shared.hint")}
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-azul font-medium">
                  <Building2 className="h-4 w-4" /> {t("renting.types.studio.label")}
                </div>
                <CardTitle className="font-display text-2xl text-navy mt-2">
                  {t("renting.types.studio.value")}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-azul font-medium">
                  <Building2 className="h-4 w-4" /> {t("renting.types.oneBed.label")}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  {oneBedRows.map((row) => (
                    <li key={row}>{row}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-azul font-medium">
                  <Users className="h-4 w-4" /> {t("renting.types.twoBed.label")}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  {twoBedRows.map((row) => (
                    <li key={row}>{row}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <p className="mt-6 text-sm text-muted-foreground text-center max-w-3xl mx-auto">
            {t("renting.types.note")}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <SourceLink
              href="https://www150.statcan.gc.ca/n1/daily-quotidien/260609/dq260609c-eng.htm"
              label={t("renting.sources.statcan")}
            />
            <SourceLink
              href="https://rentals.ca/national-rent-report"
              label={t("renting.sources.rentalsCa")}
            />
          </div>
        </div>
      </section>

      {/* Lease */}
      <section className="container py-16 md:py-20 max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-azul/10 text-azul">
            <FileText className="w-5 h-5" />
          </span>
          <h2 className="font-display text-2xl md:text-3xl text-navy font-semibold">
            {t("renting.lease.title")}
          </h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">{t("renting.lease.body")}</p>
      </section>

      {/* Deposit */}
      <section className="bg-white border-y border-border">
        <div className="container py-16 md:py-20 max-w-4xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-crimson/10 text-crimson">
              <Landmark className="w-5 h-5" />
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-navy font-semibold">
              {t("renting.deposit.title")}
            </h2>
          </div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground/80 mb-6">
            {t("renting.deposit.subtitle")}
          </p>

          <ul className="space-y-3 text-muted-foreground leading-relaxed">
            {(["on", "bc", "ab", "mb"] as const).map((k) => (
              <li key={k} className="rounded-md border border-border bg-card p-4">
                {t(`renting.deposit.rows.${k}`)}
              </li>
            ))}
          </ul>

          <Alert className="mt-6 border-crimson/40 bg-crimson/5">
            <AlertTriangle className="h-5 w-5 text-crimson" />
            <AlertDescription className="text-muted-foreground leading-relaxed">
              {t("renting.deposit.warning")}
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Rights */}
      <section className="container py-16 md:py-20 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-azul/10 text-azul">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <h2 className="font-display text-2xl md:text-3xl text-navy font-semibold">
            {t("renting.rights.title")}
          </h2>
        </div>
        <ul className="space-y-3">
          {rights.map((r) => (
            <li key={r} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-azul shrink-0 mt-0.5" />
              <span className="text-muted-foreground leading-relaxed">{r}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Bodies */}
      <section className="bg-white border-y border-border">
        <div className="container py-16 md:py-20 max-w-4xl">
          <h2 className="font-display text-2xl md:text-3xl text-navy font-semibold mb-6">
            {t("renting.bodies.title")}
          </h2>
          <ul className="space-y-3 text-muted-foreground leading-relaxed">
            {(["on", "bc", "ab", "mb", "sk"] as const).map((k) => (
              <li key={k} className="rounded-md border border-border bg-card p-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <span className="flex-1">{t(`renting.bodies.rows.${k}`)}</span>
                <SourceLink
                  href={t(`renting.bodies.urls.${k}`)}
                  label={t("renting.bodies.linkLabel")}
                />
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-navy/80 font-medium">
            {t("renting.bodies.note")}
          </p>
        </div>
      </section>

      {/* Credit */}
      <section className="container py-16 md:py-20 max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-azul/10 text-azul">
            <CreditCard className="w-5 h-5" />
          </span>
          <h2 className="font-display text-2xl md:text-3xl text-navy font-semibold">
            {t("renting.credit.title")}
          </h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">{t("renting.credit.body")}</p>

        <div className="mt-6 rounded-md border border-crimson/30 bg-crimson/5 p-5">
          <p className="font-medium text-navy">{t("renting.credit.sinTitle")}</p>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("renting.credit.sin")}
          </p>
        </div>

        <p className="mt-6 text-muted-foreground leading-relaxed">
          {t("renting.credit.build")}
        </p>
        <div className="mt-4">
          <SourceLink
            href={t("renting.credit.sourceUrl")}
            label={t("renting.credit.sourceLabel")}
          />
        </div>
      </section>

      {/* Insurance */}
      <section className="bg-white border-y border-border">
        <div className="container py-14 md:py-16 max-w-4xl">
          <h2 className="font-display text-2xl md:text-3xl text-navy font-semibold mb-3">
            {t("renting.insurance.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("renting.insurance.body")}
          </p>
          <div className="mt-4">
            <SourceLink
              href={t("renting.insurance.sourceUrl")}
              label={t("renting.insurance.sourceLabel")}
            />
          </div>
        </div>
      </section>

      {/* CTA to scams */}
      <section className="container py-16 max-w-4xl">
        <div className="rounded-lg bg-navy text-white p-8 md:p-10 text-center">
          <ShieldAlert className="mx-auto h-8 w-8 text-crimson" />
          <h2 className="font-display text-2xl md:text-3xl font-semibold mt-3">
            {t("renting.scamsCta.title")}
          </h2>
          <p className="mt-3 text-white/80 leading-relaxed max-w-2xl mx-auto">
            {t("renting.scamsCta.body")}
          </p>
          <Button asChild className="mt-6 bg-crimson hover:bg-crimson/90 text-white">
            <Link to="/golpes-de-aluguel">{t("renting.scamsCta.button")}</Link>
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