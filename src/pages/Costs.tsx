import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Bus,
  Building2,
  BedDouble,
  Calculator,
  ExternalLink,
  FileCheck,
  Fingerprint,
  GraduationCap,
  Heart,
  Home,
  Info,
  Landmark,
  MapPin,
  Plane,
  Receipt,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";

type Item = { title: string; content: string };
type AccommodationItem = { tag: string; price: string; desc: string };

const itemIcons = [GraduationCap, Home, UtensilsCrossed, Bus, Heart, Plane];

const VISA_FEES = { studyPermit: 150, biometrics: 85, total: 235 };
const PROOF_OF_FUNDS = { single: 22895, spouse: 4000, child: 3000 };
const RENT_RANGES: { city: string; province: string; range: string }[] = [
  { city: "Vancouver", province: "BC", range: "$2,500 – $2,660" },
  { city: "Toronto", province: "ON", range: "~$2,200" },
  { city: "Ottawa", province: "ON", range: "~$1,990" },
  { city: "Calgary", province: "AB", range: "$1,470 – $1,600" },
  { city: "Edmonton", province: "AB", range: "$1,300 – $1,450" },
  { city: "Winnipeg", province: "MB", range: "~$1,300" },
  { city: "Regina / Saskatoon", province: "SK", range: "$1,100 – $1,380" },
];

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

export default function Costs() {
  const { t } = useTranslation();

  const items = t("costs.components.items", { returnObjects: true }) as unknown as Item[];
  const accommodation = t("realCosts.accommodation.items", { returnObjects: true }) as unknown as AccommodationItem[];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(value);

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
            <CardContent className="text-muted-foreground leading-relaxed space-y-4">
              <p>{t("costs.twoNumbers.proof.content")}</p>
              <div className="rounded-md border border-azul/20 bg-azul/5 p-4 space-y-2 text-sm">
                <div className="flex items-baseline gap-2">
                  <Landmark className="h-4 w-4 text-azul shrink-0 self-center" />
                  <span className="font-display text-2xl font-semibold text-navy">
                    {formatCurrency(PROOF_OF_FUNDS.single)}
                  </span>
                  <span className="text-muted-foreground">
                    / {t("realCosts.proof.perYear")}
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {t("realCosts.proof.single.label")}
                </p>
                <ul className="text-muted-foreground pt-1">
                  <li>
                    <span className="font-medium text-foreground">
                      {t("realCosts.proof.family.spouse")}:
                    </span>{" "}
                    +{formatCurrency(PROOF_OF_FUNDS.spouse)}
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      {t("realCosts.proof.family.child")}:
                    </span>{" "}
                    +{formatCurrency(PROOF_OF_FUNDS.child)}
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground pt-2">
                  {t("realCosts.proof.note.body")}
                </p>
                <div className="pt-2">
                  <SourceLink
                    href={t("realCosts.proof.sourceUrl")}
                    label={t("realCosts.proof.sourceLabel")}
                  />
                </div>
              </div>
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
              {t("costs.simulate")}
            </Link>
          </Button>
        </div>
      </section>

      {/* Types of accommodation */}
      <section className="bg-white border-y border-border">
        <div className="container py-16 md:py-24 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
              {t("realCosts.accommodation.title")}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {t("realCosts.accommodation.subtitle")}
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {accommodation.map((item) => (
              <Card key={item.tag} className="border-border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-azul/10 text-azul shrink-0">
                      <BedDouble className="w-5 h-5" />
                    </span>
                    <span className="text-xs uppercase tracking-widest text-azul font-medium">
                      {item.tag}
                    </span>
                  </div>
                  <CardTitle className="font-display text-2xl text-navy mt-3">
                    {item.price}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground italic">
            {t("realCosts.accommodation.note")}
          </p>

          <div className="mt-4 text-center">
            <SourceLink
              href={t("realCosts.accommodation.sourceUrl")}
              label={t("realCosts.accommodation.sourceLabel")}
            />
          </div>
        </div>
      </section>

      {/* Cities — real rent ranges */}
      <section className="border-y border-border">
        <div className="container py-16 md:py-24 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
              {t("realCosts.rent.title")}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {t("realCosts.rent.subtitle")}
            </p>
            <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground/80">
              {t("realCosts.rent.reference")}
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RENT_RANGES.map((item) => (
              <Card key={item.city} className="border-border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-azul font-medium">
                    <MapPin className="h-4 w-4" />
                    {item.city} ({item.province})
                  </div>
                  <CardTitle className="font-display text-2xl text-navy mt-2">
                    {item.range}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {t("realCosts.rent.perMonth")}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex items-start gap-2 rounded-md border border-[hsl(var(--azul))]/30 bg-[hsl(var(--azul))]/5 p-4 text-sm leading-relaxed text-navy max-w-4xl mx-auto">
            <Building2 className="h-4 w-4 mt-0.5 shrink-0 text-[hsl(var(--azul))]" />
            <div>
              <p className="font-medium">{t("realCosts.rent.note.title")}</p>
              <p className="mt-1">{t("realCosts.rent.note.body")}</p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <SourceLink
              href={t("realCosts.rent.sourceUrl")}
              label={t("realCosts.rent.sourceLabel")}
            />
          </div>
        </div>
      </section>

      {/* Visa fees */}
      <section className="container py-16 md:py-24 max-w-5xl">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
            {t("realCosts.visa.title")}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t("realCosts.visa.subtitle")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-azul/10 text-azul">
                  <Receipt className="w-5 h-5" />
                </span>
                <span className="text-xs uppercase tracking-widest text-azul font-medium">
                  {t("realCosts.visa.studyPermit.tag")}
                </span>
              </div>
              <CardTitle className="font-display text-2xl text-navy mt-3">
                {formatCurrency(VISA_FEES.studyPermit)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              {t("realCosts.visa.studyPermit.label")}
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-azul/10 text-azul">
                  <Fingerprint className="w-5 h-5" />
                </span>
                <span className="text-xs uppercase tracking-widest text-azul font-medium">
                  {t("realCosts.visa.biometrics.tag")}
                </span>
              </div>
              <CardTitle className="font-display text-2xl text-navy mt-3">
                {formatCurrency(VISA_FEES.biometrics)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              {t("realCosts.visa.biometrics.label")}
            </CardContent>
          </Card>

          <Card className="border-crimson/20 shadow-sm sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-crimson/10 text-crimson">
                  <Calculator className="w-5 h-5" />
                </span>
                <span className="text-xs uppercase tracking-widest text-crimson font-medium">
                  {t("realCosts.visa.total.tag")}
                </span>
              </div>
              <CardTitle className="font-display text-2xl text-navy mt-3">
                {formatCurrency(VISA_FEES.total)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              {t("realCosts.visa.total.label")}
            </CardContent>
          </Card>
        </div>

        <Alert className="mt-8 border-crimson/40 bg-crimson/5">
          <AlertTriangle className="h-5 w-5 text-crimson" />
          <AlertTitle className="font-display text-navy">
            {t("realCosts.visa.alert.title")}
          </AlertTitle>
          <AlertDescription className="text-muted-foreground mt-2 leading-relaxed">
            {t("realCosts.visa.alert.body")}
          </AlertDescription>
        </Alert>

        <div className="mt-4">
          <SourceLink
            href={t("realCosts.visa.sourceUrl")}
            label={t("realCosts.visa.sourceLabel")}
          />
        </div>
      </section>

      {/* Components */}
      <section className="bg-white border-y border-border">
        <div className="container py-16 md:py-24 max-w-5xl">
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
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container py-16 max-w-3xl">
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

      {/* Footer seal */}
      <section className="bg-navy text-white">
        <div className="container py-12 md:py-16 max-w-5xl">
          <div className="flex items-start gap-3 max-w-4xl mx-auto">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl md:text-2xl font-semibold text-white">
                {t("realCosts.seal.title")}
              </h2>
              <p className="mt-3 text-white/80 leading-relaxed">
                {t("realCosts.seal.body")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}