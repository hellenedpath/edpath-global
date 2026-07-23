import { useTranslation } from "react-i18next";
import {
  HeartPulse,
  MapPin,
  Stethoscope,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Phone,
  Building2,
  Hospital,
} from "lucide-react";
import IrccNote from "@/components/IrccNote";

const IRCC_HEALTH_URL =
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/health-insurance.html";

type ProvinceRow = { name: string; body: string };
type DailyCard = { name: string; body: string };

const dailyIcons = [Stethoscope, Building2, Phone, Hospital] as const;

export default function Health() {
  const { t } = useTranslation();

  const provinceRows = t("healthPage.provinces.rows", {
    returnObjects: true,
  }) as unknown as ProvinceRow[];
  const dailyCards = t("healthPage.daily.cards", {
    returnObjects: true,
  }) as unknown as DailyCard[];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy text-primary-foreground overflow-hidden">
        <div className="container relative py-20 md:py-28 max-w-5xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary-foreground/70 mb-6">
            <span className="w-6 h-px bg-crimson" />
            {t("healthPage.eyebrow")}
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-white">
            {t("healthPage.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed">
            {t("healthPage.subtitle")}
          </p>
        </div>
      </section>

      {/* Section 1 — mandatory */}
      <section className="container py-16 md:py-20">
        <div className="max-w-4xl mx-auto rounded-2xl border-2 border-crimson/60 bg-crimson/5 p-6 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-crimson/10 text-crimson">
              <HeartPulse className="w-5 h-5" />
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-navy">
            {t("healthPage.mandatory.title")}
          </h2>
          <p className="mt-4 text-base md:text-lg text-navy/85 leading-relaxed">
            {t("healthPage.mandatory.body")}
          </p>
        </div>
      </section>

      {/* Section 2 — provinces */}
      <section className="bg-muted/30 border-y border-border">
        <div className="container py-16 md:py-24 max-w-5xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-10 h-10 text-azul">
              <MapPin className="w-5 h-5" />
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
              {t("healthPage.provinces.title")}
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            {t("healthPage.provinces.intro")}
          </p>

          <div className="mt-8 grid gap-4">
            {provinceRows.map((row) => (
              <div
                key={row.name}
                className="rounded-lg border border-border bg-card p-5 md:p-6"
              >
                <h3 className="font-display text-lg font-semibold text-navy">
                  {row.name}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {row.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-azul/30 bg-azul/5 p-5 md:p-6">
            <h3 className="font-display text-base font-semibold text-navy">
              {t("healthPage.provinces.dependentsTitle")}
            </h3>
            <p className="mt-2 text-sm md:text-base text-navy/85 leading-relaxed">
              {t("healthPage.provinces.dependentsBody")}
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 — daily */}
      <section className="container py-16 md:py-24 max-w-5xl">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
          {t("healthPage.daily.title")}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {dailyCards.map((card, i) => {
            const Icon = dailyIcons[i] ?? Stethoscope;
            return (
              <div
                key={card.name}
                className="rounded-lg border border-border bg-card p-6"
              >
                <div className="flex items-start gap-3">
                  <span className="text-crimson shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-navy">
                      {card.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {card.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 4 — family doctor */}
      <section className="bg-muted/30 border-y border-border">
        <div className="container py-16 md:py-24 max-w-4xl">
          <div className="rounded-2xl border-2 border-crimson/40 bg-crimson/5 p-6 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-crimson/10 text-crimson">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-navy">
                {t("healthPage.familyDoctor.title")}
              </h2>
            </div>
            <p className="text-base md:text-lg text-navy/85 leading-relaxed">
              {t("healthPage.familyDoctor.body")}
            </p>
          </div>
        </div>
      </section>

      {/* Section 5 — not covered */}
      <section className="container py-16 md:py-24 max-w-5xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-10 h-10 text-crimson">
            <XCircle className="w-5 h-5" />
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
            {t("healthPage.notCovered.title")}
          </h2>
        </div>
        <p className="max-w-3xl text-muted-foreground leading-relaxed">
          {t("healthPage.notCovered.body")}
        </p>
      </section>

      {/* Footer note */}
      <section className="container pb-20 max-w-3xl">
        <IrccNote
          href={IRCC_HEALTH_URL}
          linkLabel={t("healthPage.officialLinkLabel")}
        />
        <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
          {t("healthPage.footerNote")}
        </p>
        <a
          href={IRCC_HEALTH_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-azul hover:underline"
        >
          {t("healthPage.sourceLink")}
          <ExternalLink className="h-3 w-3" />
        </a>
      </section>
    </>
  );
}
