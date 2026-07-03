import { useTranslation } from "react-i18next";
import { Construction } from "lucide-react";

type PageKey = "about" | "programs" | "before" | "costs" | "family" | "work";

export default function PagePlaceholder({ tKey }: { tKey: PageKey }) {
  const { t } = useTranslation();
  return (
    <section className="container py-20 md:py-28">
      <div className="max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-navy">
          {t(`pages.${tKey}`)}
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-xl leading-relaxed">
          {t("pages.empty")}
        </p>
      </div>

      <div className="mt-16 rounded-xl border border-border bg-card p-8 md:p-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Construction className="h-6 w-6 text-azul" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {t("pages.comingSoon")}
        </p>

      </div>
    </section>
  );
}
