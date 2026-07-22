import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function VerificationNote({ className }: Props) {
  const { t } = useTranslation();
  return (
    <aside
      className={cn(
        "rounded-xl border border-border bg-muted/30 p-5 md:p-6 flex items-start gap-4 max-w-4xl",
        className,
      )}
    >
      <ShieldCheck
        className="h-5 w-5 mt-0.5 shrink-0 text-[hsl(var(--crimson))]"
        strokeWidth={1.5}
      />
      <div className="min-w-0">
        <h3 className="font-display text-base font-semibold text-navy">
          {t("verificationNote.title")}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
          {t("verificationNote.body")}
        </p>
        <Link
          to="/canada/verificacao"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-navy hover:text-[hsl(var(--crimson))] transition-colors"
        >
          {t("verificationNote.cta")}
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
      </div>
    </aside>
  );
}