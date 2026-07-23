import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Baby,
  ExternalLink,
  GraduationCap,
  Home,
  MapPin,
  School,
  UserX,
} from "lucide-react";

type DaycareRow = { province: string; cost: string; portal: string; portalUrl: string };
type SchoolType = { title: string; body: string };

export default function Family() {
  const { t } = useTranslation();

  const daycareRows = t("family.daycare.rows", { returnObjects: true }) as unknown as DaycareRow[];
  const daycareSteps = t("family.daycare.steps", { returnObjects: true }) as unknown as string[];
  const schoolTypes = t("family.school.types", { returnObjects: true }) as unknown as SchoolType[];
  const enrollSteps = t("family.school.enrollSteps", { returnObjects: true }) as unknown as string[];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy text-primary-foreground overflow-hidden">
        <div className="container relative py-20 md:py-28 max-w-5xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary-foreground/70 mb-6">
            <span className="w-6 h-px bg-crimson" />
            EdPath Global
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-white">
            {t("family.hero.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed">
            {t("family.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Section 1 — Spouse work permit alert */}
      <section className="container py-16 md:py-20">
        <div className="max-w-4xl mx-auto rounded-2xl border-2 border-crimson/60 bg-crimson/5 p-6 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-crimson/10 text-crimson">
              <UserX className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-widest text-crimson font-semibold">
              {t("family.spouse.badge")}
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-navy">
            {t("family.spouse.title")}
          </h2>
          <p className="mt-4 text-base md:text-lg text-navy/85 leading-relaxed">
            {t("family.spouse.body")}
          </p>
          <a
            href={t("family.spouse.sourceUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-crimson hover:underline"
          >
            {t("family.spouse.sourceLabel")}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Section 2 — Daycare */}
      <section className="bg-muted/30 border-y border-border">
        <div className="container py-16 md:py-24 max-w-5xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-10 h-10 text-azul">
              <Baby className="w-5 h-5" />
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
              {t("family.daycare.title")}
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            {t("family.daycare.intro")}
          </p>

          <h3 className="mt-10 font-display text-lg font-semibold text-navy">
            {t("family.daycare.tableTitle")}
          </h3>
          <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-navy">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">{t("family.daycare.cols.province")}</th>
                  <th className="text-left font-semibold px-4 py-3">{t("family.daycare.cols.cost")}</th>
                  <th className="text-left font-semibold px-4 py-3">{t("family.daycare.cols.portal")}</th>
                </tr>
              </thead>
              <tbody>
                {daycareRows.map((row) => (
                  <tr key={row.province} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-navy whitespace-nowrap">{row.province}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.cost}</td>
                    <td className="px-4 py-3">
                      <a
                        href={row.portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-azul hover:underline"
                      >
                        {row.portal}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-10 font-display text-lg font-semibold text-navy">
            {t("family.daycare.stepsTitle")}
          </h3>
          <ol className="mt-4 space-y-3">
            {daycareSteps.map((s, i) => (
              <li key={i} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                <span className="text-crimson font-display font-semibold shrink-0">{i + 1}.</span>
                <span className="text-muted-foreground leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>

          <p className="mt-6 text-sm italic text-muted-foreground border-l-2 border-azul/40 pl-4">
            {t("family.daycare.note")}
          </p>
        </div>
      </section>

      {/* Section 3 — School */}
      <section className="container py-16 md:py-24 max-w-5xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-10 h-10 text-azul">
            <School className="w-5 h-5" />
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
            {t("family.school.title")}
          </h2>
        </div>

        <Card className="mt-6 border-navy/20 bg-navy/[0.03]">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-xl text-navy flex items-center gap-2">
              <MapPin className="w-5 h-5 text-crimson" />
              {t("family.school.catchment.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground leading-relaxed">
            {t("family.school.catchment.body")}
          </CardContent>
        </Card>

        <h3 className="mt-12 font-display text-xl font-semibold text-navy">
          {t("family.school.typesTitle")}
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {schoolTypes.map((type) => (
            <Card key={type.title} className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-base text-navy">{type.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                {type.body}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-border bg-card p-6">
          <h3 className="font-display text-xl font-semibold text-navy">
            {t("family.school.rankingTitle")}
          </h3>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("family.school.rankingBody")}
          </p>
          <a
            href={t("family.school.rankingUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-azul hover:underline"
          >
            {t("family.school.rankingCta")}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <h3 className="mt-12 font-display text-xl font-semibold text-navy">
          {t("family.school.enrollTitle")}
        </h3>
        <ol className="mt-4 space-y-3">
          {enrollSteps.map((s, i) => (
            <li key={i} className="flex gap-3 rounded-lg border border-border bg-card p-4">
              <span className="text-crimson font-display font-semibold shrink-0">{i + 1}.</span>
              <span className="text-muted-foreground leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Section 4 — Where to live */}
      <section className="bg-muted/30 border-y border-border">
        <div className="container py-16 md:py-24 max-w-5xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-10 h-10 text-azul">
              <Home className="w-5 h-5" />
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
              {t("family.where.title")}
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            {t("family.where.body")}
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <Alert className="border-crimson/40 bg-crimson/5">
            <AlertTriangle className="h-5 w-5 text-crimson" />
            <AlertTitle className="font-display text-navy">
              {t("family.disclaimer.title")}
            </AlertTitle>
            <AlertDescription className="text-muted-foreground mt-2 leading-relaxed">
              {t("family.disclaimer.content")}
            </AlertDescription>
          </Alert>
        </div>
      </section>
    </>
  );
}
