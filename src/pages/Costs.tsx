import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Bus,
  Building2,
  Calculator,
  FileCheck,
  GraduationCap,
  Heart,
  Home,
  Info,
  MapPin,
  Plane,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";

type Tier = { level: string; label: string; examples: string; description: string };
type Item = { title: string; content: string };

const itemIcons = [GraduationCap, Home, UtensilsCrossed, Bus, Heart, Plane];

export default function Costs() {
  const { t } = useTranslation();

  const tiers = t("costs.cities.tiers", { returnObjects: true }) as unknown as Tier[];
  const items = t("costs.components.items", { returnObjects: true }) as unknown as Item[];

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
            {t("costs.hero.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed">
            {t("costs.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Two numbers */}
      <section className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
            {t("costs.twoNumbers.title")}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t("costs.twoNumbers.subtitle")}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          <Card className="border-azul/20 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-azul/10 text-azul">
                  <FileCheck className="w-5 h-5" />
                </span>
                <span className="text-xs uppercase tracking-widest text-azul font-medium">
                  {t("costs.twoNumbers.proof.tag")}
                </span>
              </div>
              <CardTitle className="font-display text-2xl text-navy mt-3">
                {t("costs.twoNumbers.proof.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              {t("costs.twoNumbers.proof.content")}
            </CardContent>
          </Card>

          <Card className="border-crimson/20 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-crimson/10 text-crimson">
                  <Wallet className="w-5 h-5" />
                </span>
                <span className="text-xs uppercase tracking-widest text-crimson font-medium">
                  {t("costs.twoNumbers.real.tag")}
                </span>
              </div>
              <CardTitle className="font-display text-2xl text-navy mt-3">
                {t("costs.twoNumbers.real.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              {t("costs.twoNumbers.real.content")}
            </CardContent>
          </Card>
        </div>

        <p className="mt-8 text-center text-sm text-navy/70 font-medium max-w-2xl mx-auto">
          {t("costs.twoNumbers.note")}
        </p>

        <div className="mt-8 flex justify-center">
          <Button asChild className="bg-navy hover:bg-navy/90 text-white">
            <Link to="/simulador-financeiro">
              <Calculator className="mr-2 h-4 w-4" />
              Simule seus custos
            </Link>
          </Button>
        </div>
      </section>

      {/* Cities */}
      <section className="bg-white border-y border-border">
        <div className="container py-16 md:py-24 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
              {t("costs.cities.title")}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {t("costs.cities.subtitle")}
            </p>
            <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground/80">
              {t("costs.cities.legend")}
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.label}
                className="rounded-lg border border-border bg-card p-6 shadow-sm flex flex-col"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-semibold text-crimson tracking-tight">
                    {tier.level}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    {tier.label}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm font-medium text-navy">
                  <MapPin className="w-4 h-4 text-azul" />
                  {tier.examples}
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {tier.description}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
            {t("costs.cities.disclaimer")}
          </p>
        </div>
      </section>

      {/* Components */}
      <section className="container py-16 md:py-24 max-w-5xl">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
            {t("costs.components.title")}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t("costs.components.subtitle")}
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = itemIcons[i] ?? Building2;
            return (
              <div
                key={item.title}
                className="rounded-lg border border-border bg-card p-6 shadow-sm"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-azul/10 text-azul mb-4">
                  <Icon className="w-5 h-5" />
                </span>
                <h3 className="font-display text-lg font-semibold text-navy">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {item.content}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-lg bg-navy text-white p-6 md:p-8 max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-white/70 mb-3">
            <Info className="w-4 h-4" />
            Custo total
          </div>
          <p className="font-display text-lg md:text-xl leading-relaxed">
            {t("costs.components.total")}
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container pb-20 max-w-3xl">
        <Alert className="border-crimson/40 bg-crimson/5">
          <AlertTriangle className="h-5 w-5 text-crimson" />
          <AlertTitle className="font-display text-navy">
            {t("costs.disclaimer.title")}
          </AlertTitle>
          <AlertDescription className="text-muted-foreground mt-2 leading-relaxed">
            {t("costs.disclaimer.content")}
          </AlertDescription>
        </Alert>
      </section>
    </>
  );
}