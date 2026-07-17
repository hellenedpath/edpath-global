import { useTranslation } from "react-i18next";
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
  Ambulance,
  Baby,
  GraduationCap,
  Heart,
  Phone,
  Shield,
  Stethoscope,
  Users,
} from "lucide-react";

type Province = { name: string; content: string };
type CareLevel = { title: string; description: string };
type Step = { title: string; description: string };

export default function Family() {
  const { t } = useTranslation();

  const provinces = t("family.provinces.items", { returnObjects: true }) as unknown as Province[];
  const careLevels = t("family.careLevels.items", { returnObjects: true }) as unknown as CareLevel[];
  const steps = t("family.doctorSteps.items", { returnObjects: true }) as unknown as Step[];

  const careIcons = [Stethoscope, Shield, Phone, Ambulance];

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

      {/* Health insurance by province */}
      <section className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy text-center">
            {t("family.provinces.title")}
          </h2>
          <p className="mt-4 text-center text-muted-foreground">
            {t("family.provinces.subtitle")}
          </p>

          <div className="mt-12">
            <Accordion type="single" collapsible className="space-y-4">
              {provinces.map((province, index) => (
                <AccordionItem
                  key={province.name}
                  value={`province-${index}`}
                  className="border border-border rounded-lg bg-card px-6 shadow-sm"
                >
                  <AccordionTrigger className="hover:no-underline py-5 text-left gap-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-9 h-9 text-azul">
                        <Heart className="w-5 h-5" />
                      </span>
                      <span className="font-display text-lg text-navy">{province.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {province.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {t("family.provinces.note")}
          </p>
        </div>
      </section>

      {/* How healthcare works day-to-day */}
      <section className="bg-muted/30">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
              {t("family.careLevels.title")}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {t("family.careLevels.subtitle")}
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {careLevels.map((level, index) => {
              const Icon = careIcons[index] ?? Heart;
              return (
                <Card key={level.title} className="border-border shadow-sm">
                  <CardHeader className="pb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 text-azul mb-3">
                      <Icon className="w-5 h-5" />
                    </span>
                    <CardTitle className="font-display text-lg text-navy">
                      {level.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground leading-relaxed text-sm">
                    {level.description}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to get a family doctor */}
      <section className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy text-center">
            {t("family.doctorSteps.title")}
          </h2>
          <p className="mt-4 text-center text-muted-foreground">
            {t("family.doctorSteps.subtitle")}
          </p>

          <div className="mt-12 space-y-6">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="flex items-start gap-4 rounded-lg border border-border bg-card p-6 shadow-sm"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 text-crimson font-display font-semibold shrink-0">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-navy">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* School for children */}
      <section className="bg-white border-y border-border">
        <div className="container py-16 md:py-24 max-w-5xl">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-10 h-10 text-azul">
                <GraduationCap className="w-5 h-5" />
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
                {t("family.school.title")}
              </h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("family.school.content")}
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <Card className="border-emerald-200 bg-emerald-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-emerald-700 font-display text-lg">
                    <GraduationCap className="w-5 h-5" />
                    {t("family.school.public.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-emerald-800 text-sm leading-relaxed">
                  {t("family.school.public.content")}
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-amber-700 font-display text-lg">
                    <Baby className="w-5 h-5" />
                    {t("family.school.daycare.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-amber-800 text-sm leading-relaxed">
                  {t("family.school.daycare.content")}
                </CardContent>
              </Card>
            </div>
          </div>
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
