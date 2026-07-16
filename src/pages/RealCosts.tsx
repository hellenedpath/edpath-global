import { useTranslation } from "react-i18next";
import {
  Receipt,
  Fingerprint,
  Landmark,
  Building2,
  Home,
  MapPin,
  AlertTriangle,
  ExternalLink,
  Calculator,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/** Hard-coded official / market data values as requested by the user. */
const VISA_FEES = {
  studyPermit: 150,
  biometrics: 85,
  total: 235,
};

const PROOF_OF_FUNDS = {
  single: 22895,
  spouse: 4000,
  child: 3000,
};

const RENT_RANGES = [
  { city: "Vancouver", province: "BC", range: "$2.500 – $2.660", exact: false },
  { city: "Toronto", province: "ON", range: "~$2.200", exact: false },
  { city: "Ottawa", province: "ON", range: "~$1.990", exact: false },
  { city: "Calgary", province: "AB", range: "$1.470 – $1.600", exact: false },
  { city: "Edmonton", province: "AB", range: "$1.300 – $1.450", exact: false },
  { city: "Winnipeg", province: "MB", range: "~$1.300", exact: false },
  { city: "Regina / Saskatoon", province: "SK", range: "$1.100 – $1.380", exact: false },
];

const SHARED_ROOM = 930;

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

export default function RealCosts() {
  const { t } = useTranslation();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="container py-16 md:py-24 max-w-5xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/70 mb-6">
            <span className="w-6 h-px bg-crimson" />
            {t("realCosts.hero.badge")}
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-white">
            {t("realCosts.hero.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">
            {t("realCosts.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Section 1 — Visa fees */}
      <section className="container py-16 md:py-24 max-w-5xl">
        <div className="max-w-3xl mb-10">
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

      {/* Section 2 — Proof of funds */}
      <section className="bg-white border-y border-border">
        <div className="container py-16 md:py-24 max-w-5xl">
          <div className="max-w-3xl mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
              {t("realCosts.proof.title")}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t("realCosts.proof.subtitle")}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-crimson/20 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-crimson/10 text-crimson">
                    <Landmark className="w-5 h-5" />
                  </span>
                  <span className="text-xs uppercase tracking-widest text-crimson font-medium">
                    {t("realCosts.proof.single.tag")}
                  </span>
                </div>
                <CardTitle className="font-display text-2xl text-navy mt-3">
                  {formatCurrency(PROOF_OF_FUNDS.single)}
                  <span className="text-base font-normal text-muted-foreground"> / {t("realCosts.proof.perYear")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                {t("realCosts.proof.single.label")}
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-azul/10 text-azul">
                    <Home className="w-5 h-5" />
                  </span>
                  <span className="text-xs uppercase tracking-widest text-azul font-medium">
                    {t("realCosts.proof.family.tag")}
                  </span>
                </div>
                <CardTitle className="font-display text-xl text-navy mt-3">
                  {t("realCosts.proof.family.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                <p>
                  <span className="font-medium text-foreground">{t("realCosts.proof.family.spouse")}:</span>{" "}
                  {formatCurrency(PROOF_OF_FUNDS.spouse)}
                </p>
                <p>
                  <span className="font-medium text-foreground">{t("realCosts.proof.family.child")}:</span>{" "}
                  {formatCurrency(PROOF_OF_FUNDS.child)}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 flex items-start gap-2 rounded-md border border-[hsl(var(--azul))]/30 bg-[hsl(var(--azul))]/5 p-4 text-sm leading-relaxed text-navy max-w-4xl">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-[hsl(var(--azul))]" />
            <div>
              <p className="font-medium">{t("realCosts.proof.note.title")}</p>
              <p className="mt-1">{t("realCosts.proof.note.body")}</p>
            </div>
          </div>

          <div className="mt-4">
            <SourceLink
              href={t("realCosts.proof.sourceUrl")}
              label={t("realCosts.proof.sourceLabel")}
            />
          </div>
        </div>
      </section>

      {/* Section 3 — Rent by city */}
      <section className="container py-16 md:py-24 max-w-5xl">
        <div className="max-w-3xl mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
            {t("realCosts.rent.title")}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t("realCosts.rent.subtitle")}
          </p>
          <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground/80">
            {t("realCosts.rent.reference")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

          <Card className="border-azul/20 shadow-sm bg-azul/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-azul font-medium">
                <Home className="h-4 w-4" />
                {t("realCosts.rent.shared.tag")}
              </div>
              <CardTitle className="font-display text-2xl text-navy mt-2">
                ~{formatCurrency(SHARED_ROOM)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              {t("realCosts.rent.shared.label")}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex items-start gap-2 rounded-md border border-[hsl(var(--azul))]/30 bg-[hsl(var(--azul))]/5 p-4 text-sm leading-relaxed text-navy max-w-4xl">
          <Building2 className="h-4 w-4 mt-0.5 shrink-0 text-[hsl(var(--azul))]" />
          <div>
            <p className="font-medium">{t("realCosts.rent.note.title")}</p>
            <p className="mt-1">{t("realCosts.rent.note.body")}</p>
          </div>
        </div>

        <div className="mt-4">
          <SourceLink
            href={t("realCosts.rent.sourceUrl")}
            label={t("realCosts.rent.sourceLabel")}
          />
        </div>
      </section>

      {/* Footer seal */}
      <section className="bg-navy text-white">
        <div className="container py-12 md:py-16 max-w-5xl">
          <div className="flex items-start gap-3 max-w-4xl">
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
