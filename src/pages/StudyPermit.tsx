import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  ExternalLink,
  FileText,
  Shield,
  ShieldAlert,
} from "lucide-react";

function SourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer external"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--azul))] hover:underline"
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

type Step = {
  n: number;
  title: string;
  body: string;
  link?: { href: string; label: string };
};

type ScamLink = { label: string; href: string };

type ScamSection = {
  title: string;
  intro: string;
  rights: { title: string; items: string[] };
  redFlags: { title: string; items: string[] };
  protect: { title: string; items: string[] };
  victim: { title: string; body: string };
  links: { title: string; items: ScamLink[] };
  seal: { title: string; body: string };
};

export default function StudyPermit() {
  const { t } = useTranslation();
  const steps = t("studyPermit.steps", { returnObjects: true }) as Step[];
  const scam = t("studyPermit.scamProtection", { returnObjects: true }) as ScamSection;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy text-primary-foreground overflow-hidden">
        <div className="container relative py-20 md:py-28 max-w-5xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary-foreground/70 mb-6">
            <span className="w-6 h-px bg-crimson" />
            {t("studyPermit.hero.tag")}
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-white">
            {t("studyPermit.hero.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed">
            {t("studyPermit.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="container py-12 md:py-16 max-w-4xl">
        <Alert className="border-azul/30 bg-azul/5">
          <ShieldAlert className="h-5 w-5 text-azul" />
          <AlertTitle className="font-display text-navy text-lg">
            {t("studyPermit.intro.title")}
          </AlertTitle>
          <AlertDescription className="text-muted-foreground mt-2 leading-relaxed">
            {t("studyPermit.intro.body")}
          </AlertDescription>
        </Alert>
      </section>

      {/* Steps */}
      <section className="container pb-8 max-w-4xl">
        <ol className="space-y-5">
          {steps.map((s) => (
            <li
              key={s.n}
              className="rounded-lg border border-border bg-card p-6 md:p-7 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-crimson/10 text-crimson font-display text-lg font-semibold">
                  {s.n}
                </span>
                <div className="flex-1">
                  <h2 className="font-display text-xl md:text-2xl text-navy font-semibold">
                    {s.title}
                  </h2>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Official links */}
      <section className="container py-16 max-w-4xl">
        <div className="rounded-lg border border-border bg-muted/40 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-azul/10 text-azul">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="font-display text-2xl text-navy font-semibold">
              {t("studyPermit.links.title")}
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {t("studyPermit.links.body")}
          </p>
          <ul className="mt-5 flex flex-col gap-3">
            <li>
              <SourceLink
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/apply.html"
                label={t("studyPermit.links.apply")}
              />
            </li>
            <li>
              <SourceLink
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents.html"
                label={t("studyPermit.links.documents")}
              />
            </li>
            <li>
              <SourceLink
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/apply.html"
                label={t("studyPermit.links.visaOffice")}
              />
            </li>
          </ul>
        </div>
      </section>

      {/* Seal */}
      <section className="bg-navy text-white">
        <div className="container py-12 md:py-14 max-w-5xl">
          <div className="flex items-start gap-3 max-w-4xl mx-auto">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl md:text-2xl font-semibold text-white">
                {t("studyPermit.seal.title")}
              </h2>
              <p className="mt-3 text-white/80 leading-relaxed">
                {t("studyPermit.seal.body")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}