import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X, MapPin, Shield } from "lucide-react";

export default function About() {
  const { t } = useTranslation();

  const beliefs = t("about.beliefs.items", { returnObjects: true }) as unknown as string[];
  const comparisonRows = t("about.comparison.rows", { returnObjects: true }) as unknown as Array<{
    intermediaries: string;
    edpath: string;
  }>;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-background overflow-hidden">
        <div className="container py-20 md:py-28 max-w-5xl">
          <Badge
            variant="outline"
            className="mb-6 px-3 py-1 text-xs font-medium border-navy/20 text-navy bg-white"
          >
            <span className="mr-1.5" aria-hidden>🍁</span>
            {t("about.hero.badge")}
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-navy">
            {t("about.hero.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
            {t("about.hero.subtitle")}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-azul" />
              <span>{t("about.hero.location")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-azul" />
              <span>{t("about.hero.transparency")}</span>
            </div>
          </div>
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

      {/* Comparison table */}
      <section className="bg-muted/30">
        <div className="container py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy text-center">
              {t("about.comparison.title")}
            </h2>
            <p className="mt-4 text-center text-muted-foreground">
              {t("about.comparison.subtitle")}
            </p>

            <div className="mt-12 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-1/2 text-navy font-display text-base">
                      {t("about.comparison.intermediariesHeader")}
                    </TableHead>
                    <TableHead className="w-1/2 text-navy font-display text-base">
                      {t("about.comparison.edpathHeader")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonRows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-crimson/10 text-crimson shrink-0 mt-0.5">
                            <X className="w-3 h-3" />
                          </span>
                          <span className="text-foreground leading-relaxed">{row.intermediaries}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 shrink-0 mt-0.5">
                            <Check className="w-3 h-3" />
                          </span>
                          <span className="text-foreground leading-relaxed">{row.edpath}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
