import { useTranslation } from "react-i18next";

type PageKey = "about" | "programs" | "before" | "costs" | "family" | "work";

export default function PagePlaceholder({ tKey }: { tKey: PageKey }) {
  const { t } = useTranslation();
  return (
    <section className="container py-20 md:py-28">
      <h1 className="font-display text-4xl md:text-5xl font-semibold text-navy">
        {t(`pages.${tKey}`)}
      </h1>
      <p className="mt-4 text-muted-foreground max-w-xl">{t("pages.empty")}</p>
    </section>
  );
}