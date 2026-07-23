import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Briefcase,
  Building2,
  CheckCircle,
  ExternalLink,
  FileText,
  Handshake,
  HeartHandshake,
  Home,
  Linkedin,
  Search,
  Shield,
  Users,
  XCircle,
} from "lucide-react";

type JobResource = { title: string; description: string };
type JobTip = { title: string; description: string };
type CvItem = { title: string; items: string[] };
type Professional = { title: string; description: string };
type SettlementAgency = { name: string; province: string; url: string };

export default function Work() {
  const { t } = useTranslation();

  const jobResources = t("work.job.resources", { returnObjects: true }) as unknown as JobResource[];
  const jobTips = t("work.job.tips", { returnObjects: true }) as unknown as JobTip[];
  const cvSections = t("work.cv.sections", { returnObjects: true }) as unknown as CvItem[];
  const professionals = t("work.professionals.list", { returnObjects: true }) as unknown as Professional[];
  const settlementAgencies = t("work.settlement.agencies", { returnObjects: true }) as unknown as SettlementAgency[];

  const jobResourceIcons = [Users, Briefcase, Search, Linkedin];

  const groupedAgencies = settlementAgencies.reduce((acc, agency) => {
    if (!acc[agency.province]) acc[agency.province] = [];
    acc[agency.province].push(agency);
    return acc;
  }, {} as Record<string, SettlementAgency[]>);

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
            <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50">
              <TabsTrigger value="job" className="py-3 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-navy">
                <Briefcase className="w-4 h-4 mr-2 hidden md:inline" />
                {t("work.tabs.job")}
              </TabsTrigger>
              <TabsTrigger value="cv" className="py-3 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-navy">
                <FileText className="w-4 h-4 mr-2 hidden md:inline" />
                {t("work.tabs.cv")}
              </TabsTrigger>
              <TabsTrigger value="professionals" className="py-3 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-navy">
                <Handshake className="w-4 h-4 mr-2 hidden md:inline" />
                {t("work.tabs.professionals")}
              </TabsTrigger>
              <TabsTrigger value="settlement" className="py-3 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-navy">
                <HeartHandshake className="w-4 h-4 mr-2 hidden md:inline" />
                {t("work.tabs.settlement")}
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

                {/* Real rules: hours */}
                <Card className="border-azul/30 bg-azul/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-display text-lg text-navy flex items-center gap-2">
                      <Shield className="w-5 h-5 text-azul" />
                      {t("work.job.rules.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground leading-relaxed text-sm space-y-3">
                    <p>{t("work.job.rules.content")}</p>
                    <a
                      href={t("work.job.rules.linkUrl")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-azul font-medium hover:underline"
                    >
                      {t("work.job.rules.linkLabel")}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </CardContent>
                </Card>

                {/* Credentials recognition */}
                <Card className="border-crimson/30 bg-crimson/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-display text-lg text-navy flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-crimson" />
                      {t("work.job.credentials.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground leading-relaxed text-sm">
                    {t("work.job.credentials.content")}
                  </CardContent>
                </Card>

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

                {/* Housing link */}
                <Link
                  to="/canada/alugar"
                  className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/30 p-5 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 text-azul shrink-0" />
                    <span className="text-sm text-navy font-medium">
                      {t("work.housingLink.text")}
                    </span>
                  </div>
                  <span className="text-xs text-azul font-medium whitespace-nowrap">
                    {t("work.housingLink.cta")} →
                  </span>
                </Link>
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

            {/* Tab 3: Connect with professionals */}
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

            {/* Tab 4: Newcomer support agencies */}
            <TabsContent value="settlement" className="mt-8">
              <div className="space-y-8">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
                    {t("work.settlement.title")}
                  </h2>
                  <p className="mt-4 text-muted-foreground max-w-3xl">
                    {t("work.settlement.intro")}
                  </p>
                </div>

                <div className="space-y-8">
                  {Object.entries(groupedAgencies).map(([province, agencies]) => (
                    <div key={province}>
                      <h3 className="font-display text-lg font-semibold text-navy mb-3">
                        {province}
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {agencies.map((agency) => (
                          <Card
                            key={agency.name}
                            className="border-border shadow-sm hover:border-azul/30 transition-colors"
                          >
                            <CardContent className="p-5">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="font-display font-semibold text-navy">
                                    {agency.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-0.5">
                                    {agency.province}
                                  </p>
                                </div>
                                <a
                                  href={agency.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-azul text-sm font-medium hover:underline shrink-0"
                                >
                                  {t("work.settlement.linkLabel")}
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border border-azul/30 bg-azul/5 p-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("work.settlement.federalLabel")}
                  </p>
                  <a
                    href={t("work.settlement.federalLink")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-azul font-medium hover:underline"
                  >
                    {t("work.settlement.federalCta")}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
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
