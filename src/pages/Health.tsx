import { useTranslation } from "react-i18next";
import { HeartPulse, Phone, MapPin, ExternalLink } from "lucide-react";
import IrccNote from "@/components/IrccNote";

const IRCC_HEALTH_URL =
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/health-insurance.html";

export default function Health() {
  const { t } = useTranslation();

  const items = [
    { key: "mandatory", Icon: HeartPulse },
    { key: "province", Icon: MapPin },
    { key: "emergency", Icon: Phone },
  ] as const;

  return (
    <section className="container py-16 md:py-24 max-w-3xl">
      <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span className="uppercase tracking-widest text-xs">
          {t("healthPage.eyebrow")}
        </span>
      </div>
      <h1 className="font-display text-4xl md:text-5xl font-semibold text-navy tracking-tight">
        {t("healthPage.title")}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
        {t("healthPage.subtitle")}
      </p>

      <div className="mt-10 grid gap-4">
        {items.map(({ key, Icon }) => (
          <div
            key={key}
            className="rounded-2xl border border-border bg-card p-6 md:p-7"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center text-crimson shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-navy">
                  {t(`healthPage.items.${key}.title`)}
                </h2>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {t(`healthPage.items.${key}.body`)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <IrccNote
        className="mt-8"
        href={IRCC_HEALTH_URL}
        linkLabel={t("healthPage.officialLinkLabel")}
      />

      <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
        {t("healthPage.seal")}
      </p>

      <a
        href={IRCC_HEALTH_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-azul hover:underline"
      >
        {t("healthPage.sourceLink")}
        <ExternalLink className="h-3 w-3" />
      </a>
    </section>
  );
}
