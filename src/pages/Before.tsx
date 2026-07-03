import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  CheckCircle,
  Clock,
  ExternalLink,
  GraduationCap,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export default function Before() {
  const { t } = useTranslation();

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
            {t("before.hero.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed">
            {t("before.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* 5 essential checks */}
      <section className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy text-center">
            {t("before.checks.title")}
          </h2>
          <p className="mt-4 text-center text-muted-foreground">
            {t("before.checks.subtitle")}
          </p>

          <div className="mt-12">
            <Accordion type="single" collapsible defaultValue="dli" className="space-y-4">
              <AccordionItem value="dli" className="border border-border rounded-lg bg-card px-6 shadow-sm">
                <AccordionTrigger className="hover:no-underline py-5 text-left gap-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-azul/10 text-azul">
                      <ShieldCheck className="w-5 h-5" />
                    </span>
                    <span className="font-display text-lg text-navy">{t("before.checks.dli.title")}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {t("before.checks.dli.content")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pgwp" className="border border-border rounded-lg bg-card px-6 shadow-sm">
                <AccordionTrigger className="hover:no-underline py-5 text-left gap-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-crimson/10 text-crimson">
                      <Award className="w-5 h-5" />
                    </span>
                    <span className="font-display text-lg text-navy">{t("before.checks.pgwp.title")}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  <p>{t("before.checks.pgwp.content")}</p>
                  <a
                    href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-4 text-azul hover:text-azul/80 font-medium"
                  >
                    {t("before.checks.pgwp.link")}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="credential" className="border border-border rounded-lg bg-card px-6 shadow-sm">
                <AccordionTrigger className="hover:no-underline py-5 text-left gap-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-azul/10 text-azul">
                      <GraduationCap className="w-5 h-5" />
                    </span>
                    <span className="font-display text-lg text-navy">{t("before.checks.credential.title")}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {t("before.checks.credential.content")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="duration" className="border border-border rounded-lg bg-card px-6 shadow-sm">
                <AccordionTrigger className="hover:no-underline py-5 text-left gap-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-crimson/10 text-crimson">
                      <Clock className="w-5 h-5" />
                    </span>
                    <span className="font-display text-lg text-navy">{t("before.checks.duration.title")}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {t("before.checks.duration.content")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="rcic" className="border border-border rounded-lg bg-card px-6 shadow-sm">
                <AccordionTrigger className="hover:no-underline py-5 text-left gap-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-azul/10 text-azul">
                      <UserCheck className="w-5 h-5" />
                    </span>
                    <span className="font-display text-lg text-navy">{t("before.checks.rcic.title")}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {t("before.checks.rcic.content")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Scam alerts */}
      <section className="bg-muted/30">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy text-center">
              {t("before.scams.title")}
            </h2>
            <p className="mt-4 text-center text-muted-foreground">{t("before.scams.subtitle")}</p>

            <div className="mt-10">
              <Alert className="border-crimson/30 bg-crimson/5 text-foreground">
                <AlertTriangle className="h-5 w-5 text-crimson" />
                <AlertTitle className="text-crimson font-display text-lg">
                  {t("before.scams.alert.title")}
                </AlertTitle>
                <AlertDescription className="text-muted-foreground mt-2">
                  {t("before.scams.alert.description")}
                </AlertDescription>
              </Alert>

              <div className="mt-8 grid gap-4">
                {(t("before.scams.items", { returnObjects: true }) as unknown as string[]).map(
                  (item: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
                    >
                      <AlertTriangle className="w-5 h-5 text-crimson shrink-0 mt-0.5" />
                      <p className="text-sm md:text-base text-foreground leading-relaxed">{item}</p>
                    </div>
                  )
                )}
              </div>

              <Card className="mt-10 border-emerald-200 bg-emerald-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-emerald-700 font-display text-lg">
                    <CheckCircle className="w-5 h-5" />
                    {t("before.scams.action.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                  {(t("before.scams.action.items", { returnObjects: true }) as unknown as string[]).map(
                    (item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-emerald-800 text-sm md:text-base leading-relaxed">
                        <CheckCircle className="w-4 h-4 mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    )
                  )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container py-16 md:py-20">
        <div className="max-w-3xl mx-auto rounded-xl border-l-4 border-crimson bg-card p-8 md:p-10 shadow-sm">
          <h2 className="font-display text-2xl font-semibold text-navy">{t("before.disclaimer.title")}</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{t("before.disclaimer.content")}</p>
          <div className="mt-8">
            <Link
              to="/programas"
              className="group inline-flex items-center gap-2 rounded-md bg-crimson px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-crimson/90 transition-colors"
            >
              {t("before.disclaimer.cta")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
