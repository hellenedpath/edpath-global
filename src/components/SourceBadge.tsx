import { useTranslation } from "react-i18next";
import { ShieldCheck, ExternalLink, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Variant = "inline" | "block";

type Props = {
  url?: string | null;
  validAsOf?: string | null;
  sourceType?: string | null;
  variant?: Variant;
  className?: string;
};

const STALE_THRESHOLD_DAYS = 180;

function localeTag(lng: string | undefined) {
  const base = (lng ?? "pt").slice(0, 2).toLowerCase();
  if (base === "pt") return "pt-BR";
  if (base === "en") return "en-CA";
  return base || "pt-BR";
}

export function formatValidAsOf(
  value: string | null | undefined,
  locale: string | undefined,
): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  try {
    return new Intl.DateTimeFormat(localeTag(locale), {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(d);
  } catch {
    return value;
  }
}

function isStale(value: string | null | undefined): boolean {
  if (!value) return false;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  const days = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
  return days > STALE_THRESHOLD_DAYS;
}

export default function SourceBadge({
  url,
  validAsOf,
  sourceType: _sourceType,
  variant = "inline",
  className,
}: Props) {
  const { t, i18n } = useTranslation();
  const dateLabel = formatValidAsOf(validAsOf, i18n.language);
  const stale = isStale(validAsOf);

  const verifiedText = dateLabel
    ? t("sourceBadge.verifiedOn", { date: dateLabel })
    : t("sourceBadge.verified");
  const tooltip = t("sourceBadge.tooltip");

  if (!url) {
    if (variant === "block") {
      return (
        <div
          className={cn(
            "rounded-lg border border-border bg-muted/30 p-3 flex items-start gap-2 text-xs text-muted-foreground",
            className,
          )}
        >
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" strokeWidth={1.5} />
          <span className="italic">{t("sourceBadge.missing")}</span>
        </div>
      );
    }
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-[11px] italic text-muted-foreground",
          className,
        )}
      >
        <Info className="h-3 w-3" strokeWidth={1.5} />
        {t("sourceBadge.missing")}
      </span>
    );
  }

  const linkClasses =
    variant === "block"
      ? "inline-flex items-center gap-1.5 font-medium text-navy hover:text-[hsl(var(--crimson))] transition-colors"
      : "inline-flex items-center gap-1 hover:text-navy hover:underline";

  const inner = (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClasses}
    >
      <ShieldCheck
        className={variant === "block" ? "h-4 w-4 text-[hsl(var(--crimson))]" : "h-3 w-3"}
        strokeWidth={1.5}
      />
      <span>{verifiedText}</span>
      <ExternalLink
        className={variant === "block" ? "h-3.5 w-3.5" : "h-3 w-3"}
        strokeWidth={1.5}
      />
    </a>
  );

  if (variant === "block") {
    return (
      <div
        className={cn(
          "rounded-lg border border-border bg-card p-3 md:p-4 flex flex-col gap-1.5 text-sm",
          className,
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>{inner}</span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs leading-relaxed">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </div>
        {stale && (
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {t("sourceBadge.staleNote")}
          </p>
        )}
      </div>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex flex-col gap-0.5 text-[11px] text-muted-foreground",
        className,
      )}
      title={tooltip}
    >
      {inner}
      {stale && (
        <span className="text-[10px] text-muted-foreground/80 italic">
          {t("sourceBadge.staleNote")}
        </span>
      )}
    </span>
  );
}