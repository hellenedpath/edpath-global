import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-navy text-primary-foreground mt-auto">
      <div className="container py-14 md:py-16 grid gap-10 md:grid-cols-[1fr_2fr] items-start">
        <div>
          <div className="font-display text-2xl font-semibold">EdPath Global</div>
          <p className="mt-2 text-sm text-primary-foreground/80">{t("footer.tagline")}</p>
        </div>
        <p className="text-sm leading-relaxed text-primary-foreground/85 border-l-2 border-crimson pl-5">
          {t("footer.disclaimer")}
        </p>
      </div>
      <div className="border-t border-white/10">
        <div className="container py-5 text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} EdPath Global · Ottawa, Ontario, Canada
        </div>
      </div>
    </footer>
  );
}
