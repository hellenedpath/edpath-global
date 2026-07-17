import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Briefcase,
  Building2,
  CheckCircle,
  FileText,
  Handshake,
  Home,
  Linkedin,
  MapPin,
  Search,
  Shield,
  Users,
  XCircle,
} from "lucide-react";

type JobResource = { title: string; description: string };
type JobTip = { title: string; description: string };
type CvItem = { title: string; items: string[] };
type HousingType = { type: string; cost: string; description: string };
type RentalType = { type: string; cost: string; description: string };
type ScamTip = { title: string; items: string[] };
type Professional = { title: string; description: string };

export default function Work() {
  const { t } = useTranslation();

  const jobResources = t("work.job.resources", { returnObjects: true }) as unknown as JobResource[];
  const jobTips = t("work.job.tips", { returnObjects: true }) as unknown as JobTip[];
  const cvSections = t("work.cv.sections", { returnObjects: true }) as unknown as CvItem[];
  const housingTypes = t("work.housing.types", { returnObjects: true }) as unknown as HousingType[];
  const rentalTypes = t("work.housing.rentalTypes", { returnObjects: true }) as unknown as RentalType[];
  const scamTips = t("work.housing.scamTips", { returnObjects: true }) as unknown as ScamTip;
  const professionals = t("work.professionals.list", { returnObjects: true }) as unknown as Professional[];

  const jobResourceIcons = [Users, Briefcase, Search, Linkedin];

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
            {t("work.hero.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed">
            {t("work.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="container py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="job" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/50">
              <TabsTrigger value="job" className="py-3 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-navy">
                <Briefcase className="w-4 h-4 mr-2 hidden md:inline" />
                {t("work.tabs.job")}
              </TabsTrigger>
              <TabsTrigger value="cv" className="py-3 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-navy">
                <FileText className="w-4 h-4 mr-2 hidden md:inline" />
                {t("work.tabs.cv")}
              </TabsTrigger>
              <TabsTrigger value="housing" className="py-3 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-navy">
                <Home className="w-4 h-4 mr-2 hidden md:inline" />
                {t("work.tabs.housing")}
              </TabsTrigger>
              <TabsTrigger value="professionals" className="py-3 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-navy">
                <Handshake className="w-4 h-4 mr-2 hidden md:inline" />
                {t("work.tabs.professionals")}
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Finding work */}
            <TabsContent value="job" className="mt-8">
              <div className="space-y-8">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
                    {t("work.job.title")}
                  </h2>
                  <p className="mt-4 text-muted-foreground max-w-3xl">
                    {t("work.job.subtitle")}
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {jobResources.map((resource, index) => {
                    const Icon = jobResourceIcons[index] ?? Users;
                    return (
                      <Card key={resource.title} className="border-border shadow-sm">
                        <CardHeader className="pb-3">
                          <span className="inline-flex items-center justify-center w-10 h-10 text-azul mb-3">
                            <Icon className="w-5 h-5" />
                          </span>
                          <CardTitle className="font-display text-lg text-navy">
                            {resource.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground leading-relaxed text-sm">
                          {resource.description}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  {jobTips.map((tip) => (
                    <div
                      key={tip.title}
                      className="flex items-start gap-4 rounded-lg border border-border bg-card p-6 shadow-sm"
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 text-crimson shrink-0">
                        <CheckCircle className="w-4 h-4" />
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-semibold text-navy">
                          {tip.title}
                        </h3>
                        <p className="mt-1 text-muted-foreground leading-relaxed">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Canadian CV */}
            <TabsContent value="cv" className="mt-8">
              <div className="space-y-8">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
                    {t("work.cv.title")}
                  </h2>
                  <p className="mt-4 text-muted-foreground max-w-3xl">
                    {t("work.cv.subtitle")}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {cvSections.map((section) => (
                    <Card
                      key={section.title}
                      className={
                        section.title === t("work.cv.doTitle")
                          ? "border-emerald-200 bg-emerald-50/50"
                          : "border-crimson/20 bg-crimson/5"
                      }
                    >
                      <CardHeader className="pb-2">
                        <CardTitle
                          className={
                            "flex items-center gap-2 font-display text-lg " +
                            (section.title === t("work.cv.doTitle")
                              ? "text-emerald-700"
                              : "text-crimson")
                          }
                        >
                          {section.title === t("work.cv.doTitle") ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                          {section.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {section.items.map((item, index) => (
                            <li
                              key={index}
                              className={
                                "flex items-start gap-2 text-sm leading-relaxed " +
                                (section.title === t("work.cv.doTitle")
                                  ? "text-emerald-800"
                                  : "text-crimson/90")
                              }
                            >
                              {section.title === t("work.cv.doTitle") ? (
                                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                              )}
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: Housing */}
            <TabsContent value="housing" className="mt-8">
              <div className="space-y-8">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
                    {t("work.housing.title")}
                  </h2>
                  <p className="mt-4 text-muted-foreground max-w-3xl">
                    {t("work.housing.subtitle")}
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-xl font-semibold text-navy mb-4">
                    {t("work.housing.typesTitle")}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {housingTypes.map((housing) => (
                      <div
                        key={housing.type}
                        className="rounded-lg border border-border bg-card p-5 shadow-sm"
                      >
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="font-display text-xl font-semibold text-crimson tracking-tight">
                            {housing.cost}
                          </span>
                          <span className="text-sm font-medium text-navy">{housing.type}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {housing.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-xl font-semibold text-navy mb-4">
                    {t("work.housing.rentalTitle")}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {rentalTypes.map((rental) => (
                      <div
                        key={rental.type}
                        className="rounded-lg border border-border bg-card p-5 shadow-sm"
                      >
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="font-display text-xl font-semibold text-crimson tracking-tight">
                            {rental.cost}
                          </span>
                          <span className="text-sm font-medium text-navy">{rental.type}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {rental.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert className="border-crimson/30 bg-crimson/5">
                  <AlertTriangle className="h-5 w-5 text-crimson" />
                  <AlertTitle className="font-display text-crimson text-lg">
                    {scamTips.title}
                  </AlertTitle>
                  <AlertDescription className="text-muted-foreground mt-2">
                    <ul className="space-y-2 mt-2">
                      {scamTips.items.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm leading-relaxed">
                          <XCircle className="w-4 h-4 mt-0.5 text-crimson shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            {/* Tab 4: Connect with professionals */}
            <TabsContent value="professionals" className="mt-8">
              <div className="space-y-8">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
                    {t("work.professionals.title")}
                  </h2>
                  <p className="mt-4 text-muted-foreground max-w-3xl">
                    {t("work.professionals.subtitle")}
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {professionals.map((professional, index) => {
                    const icons = [Users, FileText, Building2, Shield, Users, Briefcase];
                    const Icon = icons[index] ?? Handshake;
                    return (
                      <Card key={professional.title} className="border-border shadow-sm">
                        <CardHeader className="pb-3">
                          <span className="inline-flex items-center justify-center w-10 h-10 text-azul mb-3">
                            <Icon className="w-5 h-5" />
                          </span>
                          <CardTitle className="font-display text-lg text-navy">
                            {professional.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground leading-relaxed text-sm">
                          {professional.description}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Alert className="border-azul/30 bg-azul/5">
                  <Shield className="h-5 w-5 text-azul" />
                  <AlertTitle className="font-display text-azul text-lg">
                    {t("work.professionals.safety.title")}
                  </AlertTitle>
                  <AlertDescription className="text-muted-foreground mt-2 leading-relaxed">
                    {t("work.professionals.safety.content")}
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container pb-20">
        <div className="max-w-3xl mx-auto">
          <Alert className="border-crimson/40 bg-crimson/5">
            <AlertTriangle className="h-5 w-5 text-crimson" />
            <AlertTitle className="font-display text-navy">
              {t("work.disclaimer.title")}
            </AlertTitle>
            <AlertDescription className="text-muted-foreground mt-2 leading-relaxed">
              {t("work.disclaimer.content")}
            </AlertDescription>
          </Alert>
        </div>
      </section>
    </>
  );
}
