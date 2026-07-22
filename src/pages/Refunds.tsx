import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {
  CalendarClock,
  CalendarX,
  FileWarning,
  MailWarning,
  HelpCircle,
  ShieldOff,
  RefreshCw,
  Wallet,
  UserX,
  ClipboardCheck,
} from "lucide-react";
import IrccNote from "@/components/IrccNote";

const pointIcons = [
  CalendarClock,
  CalendarX,
  FileWarning,
  MailWarning,
  HelpCircle,
  ShieldOff,
  RefreshCw,
];

const extraIcons = [Wallet, UserX];

export default function Refunds() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    const target = pathname === "/reembolso" ? "pt" : "en";
    if (!i18n.language?.startsWith(target)) {
      i18n.changeLanguage(target);
    }
  }, [pathname, i18n]);

  const points = t("refunds.points.items", { returnObjects: true }) as Array<{
    title: string;
    body: string;
  }>;
  const extras = t("refunds.extras.items", { returnObjects: true }) as Array<{
    title: string;
    body: string;
  }>;
  const checklist = t("refunds.checklist.items", {
    returnObjects: true,
  }) as string[];
  const intro = t("refunds.intro.paragraphs", {
    returnObjects: true,
  }) as string[];
  const disclaimerBody = t("refunds.disclaimer.paragraphs", {
    returnObjects: true,
  }) as string[];

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
              {t("refunds.eyebrow")}
            </span>
            <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold tracking-tight">
              {t("refunds.title")}
            </h1>
            <p className="mt-5 text-lg text-white/80 leading-relaxed">
              {t("refunds.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="container py-14 md:py-20">
        <div className="max-w-3xl space-y-5 text-navy leading-relaxed">
          {intro.map((p, i) => (
            <p key={i} className={i === intro.length - 1 ? "font-medium" : ""}>
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* 7 points */}
      <section className="bg-muted/30 border-y border-border">
        <div className="container py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
              <CalendarClock className="h-3.5 w-3.5" strokeWidth={1.5} />
              {t("refunds.points.eyebrow")}
            </div>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-navy tracking-tight">
              {t("refunds.points.title")}
            </h2>
          </div>

          <ol className="mt-10 grid gap-5 md:grid-cols-2">
            {points.map((p, i) => {
              const Icon = pointIcons[i] ?? CalendarClock;
              return (
                <li
                  key={i}
                  className="rounded-2xl border border-border bg-background p-6 md:p-7 transition-colors hover:border-[hsl(var(--crimson))]/60"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center text-navy">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                        {t("refunds.points.step")} {i + 1}
                      </div>
                      <h3 className="mt-1 font-display text-xl font-semibold text-navy tracking-tight">
                        {p.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {p.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Extras */}
      <section className="container py-16 md:py-20">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy tracking-tight">
            {t("refunds.extras.title")}
          </h2>
        </div>
        <ul className="mt-8 grid gap-5 md:grid-cols-2 max-w-4xl">
          {extras.map((e, i) => {
            const Icon = extraIcons[i] ?? Wallet;
            return (
              <li
                key={i}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-start gap-3">
                  <Icon
                    className="h-5 w-5 mt-0.5 shrink-0 text-navy"
                    strokeWidth={1.5}
                  />
                  <div>
                    <h3 className="font-display text-lg font-semibold text-navy">
                      {e.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {e.body}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Checklist — highlighted */}
      <section className="bg-navy text-white">
        <div className="container py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
              <ClipboardCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
              {t("refunds.checklist.eyebrow")}
            </div>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold tracking-tight">
              {t("refunds.checklist.title")}
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              {t("refunds.checklist.subtitle")}
            </p>
          </div>

          <ol className="mt-10 grid gap-4 max-w-3xl">
            {checklist.map((q, i) => (
              <li
                key={i}
                className="flex items-start gap-4 rounded-xl border border-white/15 bg-white/[0.04] p-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--crimson))]/70 text-sm font-semibold text-[hsl(var(--crimson))]">
                  {i + 1}
                </span>
                <p className="text-white leading-relaxed">{q}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container py-14 md:py-16">
        <div className="max-w-3xl space-y-5">
          {disclaimerBody.map((p, i) => (
            <p
              key={i}
              className="text-sm text-muted-foreground leading-relaxed"
            >
              {p}
            </p>
          ))}
          <IrccNote className="mt-2" />
        </div>
      </section>
    </>
  );
}