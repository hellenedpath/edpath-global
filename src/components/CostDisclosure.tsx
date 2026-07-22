import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  Wallet,
  FileText,
  XCircle,
  Repeat,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SourceBadge from "@/components/SourceBadge";

type Props = {
  className?: string;
  defaultOpen?: boolean;
};

const SOURCE_URL =
  "https://www.conestogac.on.ca/international/apply-to-conestoga/fees-and-payment";
const SOURCE_DATE = "2026-07-11";

type Item = {
  key: string;
  amountKey?: string;
  noteKey?: string;
  emphasis?: boolean;
};

const BEFORE: Item[] = [
  {
    key: "deposit",
    amountKey: "depositAmount",
    noteKey: "depositNote",
    emphasis: true,
  },
  { key: "palWarning", emphasis: true },
  { key: "applicationFee", amountKey: "applicationFeeAmount" },
  {
    key: "visaRefusalFee",
    amountKey: "visaRefusalFeeAmount",
    noteKey: "visaRefusalNote",
    emphasis: true,
  },
];

const RECURRING: Item[] = [
  { key: "isr" },
  { key: "cihip" },
  { key: "studentServices" },
  { key: "technology" },
  { key: "upass", amountKey: "upassAmount" },
  { key: "wil", amountKey: "wilAmount" },
];

const CHANGES: Item[] = [
  {
    key: "withdrawalPostSec",
    amountKey: "withdrawalPostSecAmount",
    emphasis: true,
  },
  {
    key: "withdrawalGradCert",
    amountKey: "withdrawalGradCertAmount",
    emphasis: true,
  },
  { key: "withdrawalEls", amountKey: "withdrawalElsAmount", emphasis: true },
  { key: "latePayment", amountKey: "latePaymentAmount" },
];

export default function CostDisclosure({ className, defaultOpen = false }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(defaultOpen);

  const renderList = (items: Item[]) => (
    <ul className="mt-2 space-y-1.5">
      {items.map((it) => (
        <li key={it.key} className="space-y-1">
          <div
            className={cn(
              "flex items-start justify-between gap-3 text-sm leading-relaxed",
              it.emphasis && "text-[hsl(var(--crimson))]",
            )}
          >
            <span className="flex items-start gap-2 min-w-0">
              {it.emphasis && (
                <AlertTriangle
                  className="h-3.5 w-3.5 mt-0.5 shrink-0"
                  strokeWidth={1.5}
                />
              )}
              <span className={cn("min-w-0", !it.emphasis && "text-foreground")}>
                {t(`costDisclosure.items.${it.key}`)}
              </span>
            </span>
            {it.amountKey && (
              <span
                className={cn(
                  "shrink-0 font-medium tabular-nums",
                  it.emphasis ? "text-[hsl(var(--crimson))]" : "text-navy",
                )}
              >
                {t(`costDisclosure.items.${it.amountKey}`)}
              </span>
            )}
          </div>
          {it.noteKey && (
            <p className="text-xs text-muted-foreground leading-relaxed pl-5">
              {t(`costDisclosure.items.${it.noteKey}`)}
            </p>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-muted/40 transition-colors"
      >
        <span className="flex items-start gap-3 min-w-0">
          <Wallet
            className="h-5 w-5 mt-0.5 shrink-0 text-navy"
            strokeWidth={1.5}
          />
          <span className="min-w-0">
            <span className="block font-display font-semibold text-navy">
              {t("costDisclosure.title")}
            </span>
            <span className="block text-xs text-muted-foreground mt-0.5">
              {t("costDisclosure.subtitle")}
            </span>
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
            open && "rotate-180",
          )}
          strokeWidth={1.5}
        />
      </button>

      {open && (
        <div className="px-4 md:px-5 pb-5 space-y-5 border-t border-border">
          <p className="text-sm text-muted-foreground leading-relaxed pt-4">
            {t("costDisclosure.intro")}
          </p>

          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-navy font-display">
              <FileText className="h-4 w-4 text-navy" strokeWidth={1.5} />
              {t("costDisclosure.sections.before")}
            </h4>
            {renderList(BEFORE)}
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-navy font-display">
              <Repeat className="h-4 w-4 text-navy" strokeWidth={1.5} />
              {t("costDisclosure.sections.recurring")}
            </h4>
            {renderList(RECURRING)}
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-navy font-display">
              <XCircle className="h-4 w-4 text-navy" strokeWidth={1.5} />
              {t("costDisclosure.sections.changes")}
            </h4>
            {renderList(CHANGES)}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("costDisclosure.elsNote")}
          </p>

          <div className="space-y-2">
            <SourceBadge
              variant="block"
              url={SOURCE_URL}
              validAsOf={SOURCE_DATE}
            />
            <p className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
              <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0" strokeWidth={1.5} />
              <span>{t("costDisclosure.footnote")}</span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}