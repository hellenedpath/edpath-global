import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  GraduationCap,
  BadgeCheck,
  FileCheck,
  Home,
  ExternalLink,
  Check,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

type CheckItem = {
  key: "dli" | "consultant" | "loa" | "rental";
  Icon: typeof ShieldCheck;
  officialUrl: string;
  internalTo?: string;
};

const checks: CheckItem[] = [
  {
    key: "dli",
    Icon: GraduationCap,
    officialUrl:
      "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/designated-learning-institutions-list.html",
    internalTo: "/canada/instituicoes",
  },
  {
    key: "consultant",
    Icon: BadgeCheck,
    officialUrl: "https://college-ic.ca/protecting-the-public/find-an-immigration-consultant",
  },
  {
    key: "loa",
    Icon: FileCheck,
    officialUrl:
      "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents.html",
  },
  {
    key: "rental",
    Icon: Home,
    officialUrl: "https://antifraudcentre-centreantifraude.ca/index-eng.htm",
    internalTo: "/canada/golpes-de-aluguel",
  },
];

export default function Verify() {
  const { t } = useTranslation();

  const questions = t("verify.questions.items", { returnObjects: true }) as string[];
  const commitments = t("verify.stance.items", { returnObjects: true }) as string[];

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
              {t("verify.eyebrow")}
            </span>
            <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold tracking-tight">
              {t("verify.title")}
            </h1>
            <p className="mt-5 text-lg text-white/80 leading-relaxed">
              {t("verify.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Section 1 — Four checks */}
      <section className="container py-16 md:py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
            {t("verify.checks.eyebrow")}
          </div>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-navy tracking-tight">
            {t("verify.checks.title")}
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {t("verify.checks.subtitle")}
          </p>
        </div>

        <ol className="mt-10 grid gap-5 md:grid-cols-2">
          {checks.map((c, i) => {
            const { Icon } = c;
            return (
              <li
                key={c.key}
                className="rounded-2xl border border-border bg-card p-6 md:p-7 transition-colors hover:border-[hsl(var(--crimson))]/60"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[hsl(var(--crimson))]">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                      {t("verify.checks.step")} {i + 1}
                    </div>
                    <h3 className="mt-1 font-display text-xl font-semibold text-navy tracking-tight">
                      {t(`verify.checks.items.${c.key}.title`)}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {t(`verify.checks.items.${c.key}.why`)}
                </p>
                <p className="mt-3 text-sm text-navy leading-relaxed">
                  <span className="font-medium">{t("verify.checks.action")}:</span>{" "}
                  {t(`verify.checks.items.${c.key}.action`)}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  <a
                    href={c.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-[hsl(var(--crimson))] hover:underline"
                  >
                    {t(`verify.checks.items.${c.key}.officialLabel`)}
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </a>
                  {c.internalTo && (
                    <Link
                      to={c.internalTo}
                      className="inline-flex items-center gap-1.5 text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-[hsl(var(--crimson))]"
                    >
                      {t(`verify.checks.items.${c.key}.internalLabel`)}
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Section 2 — Questions before you sign */}
      <section className="bg-muted/30 border-y border-border">
        <div className="container py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
              <FileCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
              {t("verify.questions.eyebrow")}
            </div>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-navy tracking-tight">
              {t("verify.questions.title")}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {t("verify.questions.subtitle")}
            </p>
          </div>

          <ul className="mt-10 grid gap-3 md:grid-cols-2 max-w-5xl">
            {questions.map((q, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-border bg-background p-4"
              >
                <Check className="h-4 w-4 mt-0.5 shrink-0 text-[hsl(var(--crimson))]" strokeWidth={1.75} />
                <span className="text-sm text-navy leading-relaxed">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Section 3 — Where EdPath stands */}
      <section className="container py-16 md:py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
            <BadgeCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
            {t("verify.stance.eyebrow")}
          </div>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-navy tracking-tight">
            {t("verify.stance.title")}
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {t("verify.stance.subtitle")}
          </p>
        </div>

        <ul className="mt-8 grid gap-3 max-w-3xl">
          {commitments.map((c, i) => (
            <li key={i} className="flex items-start gap-3">
              <Check className="h-4 w-4 mt-1 shrink-0 text-[hsl(var(--crimson))]" strokeWidth={1.75} />
              <span className="text-navy leading-relaxed">{c}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Section 4 — Next step */}
      <section className="bg-navy text-white">
        <div className="container py-14 md:py-20">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
              {t("verify.next.title")}
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              {t("verify.next.body")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("edpath:open-assistant"))
                }
                className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--crimson))] px-5 py-3 text-sm font-medium text-white transition hover:bg-[hsl(var(--crimson))]/90"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                {t("verify.next.askAssistant")}
              </button>
              <Link
                to="/canada/meu-caminho?country=canada"
                className="inline-flex items-center gap-1.5 text-sm text-white/85 underline decoration-white/30 underline-offset-4 hover:text-white hover:decoration-white"
              >
                {t("verify.next.myPath")}
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}