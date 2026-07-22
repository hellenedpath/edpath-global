import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Wallet,
  FileText,
  XCircle,
  Repeat,
  AlertTriangle,
  Clock,
  ExternalLink,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SourceBadge from "@/components/SourceBadge";

type Props = {
  className?: string;
  defaultOpen?: boolean;
  institutionName?: string | null;
  officialFeesUrl?: string | null;
};

type Item = {
  key: string;
  amountKey?: string;
  noteKey?: string;
  emphasis?: boolean;
  linkUrl?: string;
  linkLabelKey?: string;
};

type FeeProfile = {
  /** i18n namespace suffix under costDisclosure.profiles.<key> */
  key: string;
  sourceUrl: string;
  sourceDate: string;
  before: Item[];
  recurring?: Item[];
  housing?: Item[];
  changes: Item[];
  hasElsNote?: boolean;
  hasOptionalNote?: boolean;
};

/**
 * Verified per-institution fee profiles. Add a new institution by adding a
 * new entry here plus its i18n block under `costDisclosure.profiles.<key>` —
 * no other code changes required. Never seed a profile with unverified
 * figures.
 */
const FEE_PROFILES: Record<string, FeeProfile> = {
  conestoga: {
    key: "conestoga",
    sourceUrl:
      "https://www.conestogac.on.ca/international/apply-to-conestoga/fees-and-payment",
    sourceDate: "2026-07-11",
    before: [
      { key: "deposit", amountKey: "depositAmount", noteKey: "depositNote", emphasis: true },
      { key: "palWarning", emphasis: true },
      { key: "applicationFee", amountKey: "applicationFeeAmount" },
      {
        key: "visaRefusalFee",
        amountKey: "visaRefusalFeeAmount",
        noteKey: "visaRefusalNote",
        emphasis: true,
      },
    ],
    recurring: [
      { key: "isr" },
      { key: "cihip" },
      { key: "studentServices" },
      { key: "technology" },
      { key: "upass", amountKey: "upassAmount" },
      { key: "wil", amountKey: "wilAmount" },
    ],
    changes: [
      { key: "withdrawalPostSec", amountKey: "withdrawalPostSecAmount", emphasis: true },
      { key: "withdrawalGradCert", amountKey: "withdrawalGradCertAmount", emphasis: true },
      { key: "withdrawalEls", amountKey: "withdrawalElsAmount", emphasis: true },
      { key: "latePayment", amountKey: "latePaymentAmount" },
    ],
    hasElsNote: true,
  },
  algonquin: {
    key: "algonquin",
    sourceUrl:
      "https://www.algonquincollege.com/international/fees-and-expenses/",
    sourceDate: "2025-12-10",
    before: [
      { key: "tuition", amountKey: "tuitionAmount", noteKey: "tuitionNote" },
      { key: "learningResources", amountKey: "learningResourcesAmount" },
    ],
    housing: [
      { key: "homestayFirst", amountKey: "homestayFirstAmount" },
      { key: "homestaySubsequent", amountKey: "homestaySubsequentAmount" },
      { key: "residenceAccommodation", amountKey: "residenceAccommodationAmount" },
      { key: "residenceMealPlan", amountKey: "residenceMealPlanAmount" },
      { key: "residenceTotal", amountKey: "residenceTotalAmount" },
      { key: "offCampus", amountKey: "offCampusAmount" },
    ],
    changes: [
      {
        key: "refundPolicy",
        emphasis: true,
        linkUrl: "https://www.algonquincollege.com/ro/pay/refund-policies/",
        linkLabelKey: "refundPolicyLink",
      },
    ],
    hasOptionalNote: true,
  },
};

function resolveProfile(institutionName?: string | null): FeeProfile | null {
  if (!institutionName) return null;
  const n = institutionName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  if (n.includes("conestoga")) return FEE_PROFILES.conestoga;
  if (n.includes("algonquin")) return FEE_PROFILES.algonquin;
  return null;
}

// Generic category names shown when no verified profile exists.
const GENERIC_CATEGORY_KEYS = [
  "deposit",
  "applicationFee",
  "visaRefusal",
  "mandatoryPerTerm",
  "withdrawal",
  "latePayment",
] as const;

export default function CostDisclosure({
  className,
  defaultOpen = false,
  institutionName,
  officialFeesUrl,
}: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(defaultOpen);
  const profile = resolveProfile(institutionName);
  const itemKey = (k: string) =>
    profile
      ? `costDisclosure.profiles.${profile.key}.items.${k}`
      : `costDisclosure.items.${k}`;

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
                {t(itemKey(it.key))}
              </span>
            </span>
            {it.amountKey && (
              <span
                className={cn(
                  "shrink-0 font-medium tabular-nums",
                  it.emphasis ? "text-[hsl(var(--crimson))]" : "text-navy",
                )}
              >
                {t(itemKey(it.amountKey))}
              </span>
            )}
          </div>
          {it.noteKey && (
            <p className="text-xs text-muted-foreground leading-relaxed pl-5">
              {t(itemKey(it.noteKey))}
            </p>
          )}
          {it.linkUrl && it.linkLabelKey && (
            <a
              href={it.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-navy hover:text-[hsl(var(--crimson))] underline-offset-4 hover:underline pl-5"
            >
              {t(itemKey(it.linkLabelKey))}
              <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
            </a>
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

      {open && profile && (
        <div className="px-4 md:px-5 pb-5 space-y-5 border-t border-border">
          <p className="text-sm text-muted-foreground leading-relaxed pt-4">
            {t(`costDisclosure.profiles.${profile.key}.intro`)}
          </p>

          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-navy font-display">
              <FileText className="h-4 w-4 text-navy" strokeWidth={1.5} />
              {t("costDisclosure.sections.before")}
            </h4>
            {renderList(profile.before)}
          </div>

          {profile.recurring && profile.recurring.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-navy font-display">
                <Repeat className="h-4 w-4 text-navy" strokeWidth={1.5} />
                {t("costDisclosure.sections.recurring")}
              </h4>
              {renderList(profile.recurring)}
            </div>
          )}

          {profile.housing && profile.housing.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-navy font-display">
                <Home className="h-4 w-4 text-navy" strokeWidth={1.5} />
                {t("costDisclosure.sections.housing")}
              </h4>
              {renderList(profile.housing)}
            </div>
          )}

          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-navy font-display">
              <XCircle className="h-4 w-4 text-navy" strokeWidth={1.5} />
              {t("costDisclosure.sections.changes")}
            </h4>
            {renderList(profile.changes)}
          </div>

          {profile.hasElsNote && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t(`costDisclosure.profiles.${profile.key}.elsNote`)}
            </p>
          )}

          {profile.hasOptionalNote && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t(`costDisclosure.profiles.${profile.key}.optionalNote`)}
            </p>
          )}

          <div className="space-y-2">
            <SourceBadge
              variant="block"
              url={profile.sourceUrl}
              validAsOf={profile.sourceDate}
            />
            <p className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
              <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0" strokeWidth={1.5} />
              <span>{t("costDisclosure.footnote")}</span>
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            {t("costDisclosure.refundLink.question")}{" "}
            <Link
              to={t("refunds.path") as string}
              className="text-navy hover:text-[hsl(var(--crimson))] underline-offset-4 hover:underline transition-colors"
            >
              {t("costDisclosure.refundLink.cta")}
            </Link>
          </p>
        </div>
      )}

      {open && !profile && (
        <div className="px-4 md:px-5 pb-5 space-y-4 border-t border-border">
          <p className="text-sm text-muted-foreground leading-relaxed pt-4">
            {t("costDisclosure.noProfile.message")}
          </p>
          <ul className="space-y-1.5">
            {GENERIC_CATEGORY_KEYS.map((k) => (
              <li
                key={k}
                className="flex items-start gap-2 text-sm text-foreground leading-relaxed"
              >
                <FileText
                  className="h-3.5 w-3.5 mt-1 shrink-0 text-navy"
                  strokeWidth={1.5}
                />
                <span>{t(`costDisclosure.categories.${k}`)}</span>
              </li>
            ))}
          </ul>
          {officialFeesUrl ? (
            <a
              href={officialFeesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-navy hover:text-[hsl(var(--crimson))] underline-offset-4 hover:underline"
            >
              {t("costDisclosure.noProfile.checkOfficial")}
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
            </a>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("costDisclosure.noProfile.noFeesUrl")}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            {t("costDisclosure.refundLink.question")}{" "}
            <Link
              to={t("refunds.path") as string}
              className="text-navy hover:text-[hsl(var(--crimson))] underline-offset-4 hover:underline transition-colors"
            >
              {t("costDisclosure.refundLink.cta")}
            </Link>
          </p>
        </div>
      )}
    </section>
  );
}