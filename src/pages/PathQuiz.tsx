import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Check,
  Compass,
  Languages,
  BookOpen,
  GraduationCap,
  DollarSign,
  FileCheck,
  Plane,
  Home,
  MapPin,
  Sparkles,
  RotateCcw,
  Globe,
  Mail,
  ExternalLink,
  Flag,
  Users,
  Wallet,
  ListChecks,
  Share2,
  Copy,
  ClipboardCheck,
  Shield,
  MessageCircle,
  Target,
} from "lucide-react";
import IrccNote from "@/components/IrccNote";

type AnswerKey = string;
type Answers = Record<number, AnswerKey>;

const IRCC_SPOUSE_URL =
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/help-your-spouse-common-law-partner-work-canada.html";
const IRCC_PGWP_URL =
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html";
const IRCC_PROOF_URL =
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents.html";
const IRCC_LANG_URL =
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/language-requirements.html";

function LanguageTestsGuide() {
  const { t } = useTranslation();
  return (
    <div className="mt-5 rounded-xl border border-azul/30 bg-azul/5 p-4 md:p-5">
      <div className="flex items-center gap-2">
        <Languages className="h-4 w-4 text-azul" />
        <h4 className="font-display text-base md:text-lg font-semibold text-navy">
          {t("pathQuiz.languageGuide.title")}
        </h4>
      </div>

      <div className="mt-3 flex gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm leading-relaxed text-amber-900">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
        <p>
          <Trans i18nKey="pathQuiz.languageGuide.warning" components={{ strong: <strong /> }} />
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{t("pathQuiz.languageGuide.section1.label")}</div>
          <h5 className="mt-1 font-semibold text-navy">{t("pathQuiz.languageGuide.section1.title")}</h5>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            <Trans i18nKey="pathQuiz.languageGuide.section1.body" components={{ strong: <strong /> }} />
          </p>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            {t("pathQuiz.languageGuide.section1.note")}
          </p>
        </div>

        <div className="rounded-lg border border-crimson/30 bg-crimson/5 p-4">
          <div className="text-xs uppercase tracking-widest text-crimson/80">{t("pathQuiz.languageGuide.section2.label")}</div>
          <h5 className="mt-1 font-semibold text-navy">{t("pathQuiz.languageGuide.section2.title")}</h5>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            <Trans i18nKey="pathQuiz.languageGuide.section2.body" components={{ strong: <strong /> }} />
          </p>
          <p className="mt-2 text-sm text-navy leading-relaxed">
            <Trans i18nKey="pathQuiz.languageGuide.section2.warning" components={{ strong: <strong /> }} />
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 md:col-span-2">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{t("pathQuiz.languageGuide.section3.label")}</div>
          <h5 className="mt-1 font-semibold text-navy">{t("pathQuiz.languageGuide.section3.title")}</h5>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            <Trans i18nKey="pathQuiz.languageGuide.section3.body" components={{ strong: <strong /> }} />
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2 rounded-md border border-azul/30 bg-card p-3 text-sm leading-relaxed text-navy">
        <Sparkles className="h-4 w-4 mt-0.5 shrink-0 text-azul" />
        <p>
          <Trans i18nKey="pathQuiz.languageGuide.tip" components={{ strong: <strong /> }} />
        </p>
      </div>

      <IrccNote
        className="mt-4"
        href={IRCC_LANG_URL}
        linkLabel={t("pathQuiz.languageGuide.irccLinkLabel")}
      />
      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
        <Trans i18nKey="pathQuiz.languageGuide.disclaimer" components={{ strong: <strong /> }} />
      </p>
    </div>
  );
}

type Question = { id: number; optionKeys: AnswerKey[] };

const DESTINATION_KEYS = ["canada", "usa", "uk", "australia", "ireland"] as const;
const AVAILABLE_DESTINATIONS = new Set<string>(["canada"]);

const QUESTIONS: Question[] = [
  { id: 1, optionKeys: ["researching", "knows", "accepted", "arrived"] },
  { id: 2, optionKeys: ["stay", "return", "explore"] },
  { id: 3, optionKeys: ["college", "bachelor", "master", "phd", "unknown_level"] },
  { id: 4, optionKeys: ["health", "it", "business", "engineering", "trades", "education", "arts", "unknown"] },
  { id: 5, optionKeys: ["tested", "fluent", "improve"] },
  { id: 6, optionKeys: ["solo", "partner", "children", "partner_children"] },
  { id: 7, optionKeys: ["planned", "understand", "work"] },
];

type Step = { n: number; Icon: typeof Compass; href?: string };

const STEPS: Step[] = [
  { n: 1, Icon: Compass, href: "/canada" },
  { n: 2, Icon: Languages, href: "/canada/study-permit" },
  { n: 3, Icon: BookOpen, href: "/canada/programas" },
  { n: 4, Icon: GraduationCap, href: "/canada/pgwp" },
  { n: 5, Icon: DollarSign, href: "/canada/custos" },
  { n: 6, Icon: FileCheck, href: "/canada/study-permit" },
  { n: 7, Icon: Plane, href: "/canada/trabalho-moradia" },
  { n: 8, Icon: Home, href: "/canada/trabalho-moradia" },
];

function currentStepFromAnswers(a: Answers): number {
  const q2 = a[1];
  if (q2 === "researching") return 1;
  if (q2 === "knows") return 3;
  if (q2 === "accepted") return 6;
  if (q2 === "arrived") return 8;
  return 1;
}

type Highlight = {
  step: number;
  kind: "priority" | "info";
  messageKey: string;
  officialLink?: { href: string; labelKey: string };
};

function buildHighlights(a: Answers): Highlight[] {
  const h: Highlight[] = [];
  if (a[5] === "improve") {
    h.push({ step: 2, kind: "priority", messageKey: "pathQuiz.highlights.languagePriority" });
  } else if (a[5] === "fluent") {
    h.push({ step: 2, kind: "info", messageKey: "pathQuiz.highlights.languageFluent" });
  }
  if (a[2] === "stay") {
    h.push({ step: 4, kind: "priority", messageKey: "pathQuiz.highlights.stayPgwp" });
  }
  if (a[7] === "understand") {
    h.push({ step: 5, kind: "info", messageKey: "pathQuiz.highlights.budgetUnderstand" });
  } else if (a[7] === "work") {
    h.push({ step: 5, kind: "info", messageKey: "pathQuiz.highlights.budgetWork" });
  }
  const hasChildren = a[6] === "children" || a[6] === "partner_children";
  const hasPartner = a[6] === "partner" || a[6] === "partner_children";
  if (hasChildren) {
    h.push({ step: 8, kind: "info", messageKey: "pathQuiz.highlights.childrenSchool" });
    h.push({ step: 5, kind: "info", messageKey: "pathQuiz.highlights.childrenBudget" });
  }
  if (hasPartner) {
    const level = a[3];
    if (level === "master" || level === "phd") {
      h.push({
        step: 8,
        kind: "info",
        messageKey: "pathQuiz.highlights.spouseHighLevel",
        officialLink: { href: IRCC_SPOUSE_URL, labelKey: "pathQuiz.highlights.spouseLinkLabel" },
      });
    } else {
      h.push({
        step: 8,
        kind: "priority",
        messageKey: "pathQuiz.highlights.spouseLowLevel",
        officialLink: { href: IRCC_SPOUSE_URL, labelKey: "pathQuiz.highlights.spouseLinkLabel" },
      });
    }
  }
  if (a[4] === "unknown") {
    h.push({ step: 3, kind: "info", messageKey: "pathQuiz.highlights.unknownArea" });
  }
  if (a[1] === "arrived") {
    h.push({ step: 8, kind: "priority", messageKey: "pathQuiz.highlights.arrivedFocus" });
  }
  return h;
}

function objectiveSummaryKey(a: Answers): string {
  const obj = a[2];
  if (obj === "stay") return "pathQuiz.objective.stay";
  if (obj === "return") return "pathQuiz.objective.return";
  return "pathQuiz.objective.explore";
}

// ---------- Compatibility score ----------
type ScoreFactor = { kind: "positive" | "warning"; messageKey: string };
type ScoreResult = {
  percent: number;
  labelKey: string;
  tone: "high" | "medium" | "low";
  factors: ScoreFactor[];
};

// Áreas com elegibilidade PGWP conhecida no nosso quiz.
const PGWP_AREA_STATUS: Record<string, "eligible" | "conditional" | "not"> = {
  it: "eligible",
  engineering: "eligible",
  trades: "eligible",
  health: "eligible",
  education: "conditional",
  business: "conditional",
  arts: "not",
  unknown: "not",
};

function computeScore(a: Answers): ScoreResult {
  let score = 60; // base
  const factors: ScoreFactor[] = [];

  const objective = a[2];
  const area = a[4];
  const language = a[5];
  const companions = a[6];
  const level = a[3];
  const budget = a[7];
  const pgwp = area ? PGWP_AREA_STATUS[area] : undefined;

  // Área × Objetivo
  if (objective === "stay") {
    if (pgwp === "eligible") {
      score += 20;
      factors.push({ kind: "positive", messageKey: "pathQuiz.score.factors.stayEligible" });
    } else if (pgwp === "conditional") {
      score += 5;
      factors.push({ kind: "warning", messageKey: "pathQuiz.score.factors.stayConditional" });
    } else if (pgwp === "not") {
      score -= 20;
      factors.push({ kind: "warning", messageKey: "pathQuiz.score.factors.stayNot" });
    }
  } else if (objective === "return") {
    if (pgwp === "eligible") {
      score += 5;
      factors.push({ kind: "positive", messageKey: "pathQuiz.score.factors.returnEligible" });
    } else if (pgwp === "not") {
      score -= 5;
      factors.push({ kind: "warning", messageKey: "pathQuiz.score.factors.returnNot" });
    }
  } else if (objective === "explore") {
    factors.push({ kind: "warning", messageKey: "pathQuiz.score.factors.exploreUnknown" });
  }

  // Idioma
  if (language === "tested") {
    score += 10;
    factors.push({ kind: "positive", messageKey: "pathQuiz.score.factors.langTested" });
  } else if (language === "fluent") {
    factors.push({ kind: "warning", messageKey: "pathQuiz.score.factors.langFluent" });
  } else if (language === "improve") {
    score -= 10;
    factors.push({ kind: "warning", messageKey: "pathQuiz.score.factors.langImprove" });
  }

  // Cônjuge × nível
  const hasPartner = companions === "partner" || companions === "partner_children";
  if (hasPartner) {
    if (level === "master" || level === "phd") {
      score += 8;
      factors.push({ kind: "positive", messageKey: "pathQuiz.score.factors.spouseHigh" });
    } else if (level === "bachelor" || level === "college") {
      score -= 10;
      factors.push({ kind: "warning", messageKey: "pathQuiz.score.factors.spouseLow" });
    }
  }

  // Orçamento
  if (budget === "planned") {
    score += 10;
    factors.push({ kind: "positive", messageKey: "pathQuiz.score.factors.budgetPlanned" });
  } else if (budget === "understand") {
    factors.push({ kind: "warning", messageKey: "pathQuiz.score.factors.budgetUnderstand" });
  } else if (budget === "work") {
    score -= 10;
    factors.push({ kind: "warning", messageKey: "pathQuiz.score.factors.budgetWork" });
  }

  const percent = Math.max(0, Math.min(100, Math.round(score)));
  let labelKey = "pathQuiz.result.labels.low";
  let tone: ScoreResult["tone"] = "low";
  if (percent >= 80) {
    labelKey = "pathQuiz.result.labels.high";
    tone = "high";
  } else if (percent >= 55) {
    labelKey = "pathQuiz.result.labels.medium";
    tone = "medium";
  }
  return { percent, labelKey, tone, factors };
}

export default function PathQuiz() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const countryParam = searchParams.get("country");
  const isCanadaContext =
    (countryParam && DESTINATION_KEYS.includes(countryParam as typeof DESTINATION_KEYS[number])) ||
    pathname.startsWith("/canada/");
  const presetDestination = countryParam && DESTINATION_KEYS.includes(countryParam as typeof DESTINATION_KEYS[number])
    ? countryParam
    : pathname.startsWith("/canada/")
      ? "canada"
      : null;

  // Attempt to restore answers from URL params (share/save link).
  const restoredAnswers = useMemo<Answers | null>(() => {
    const out: Answers = {};
    for (const q of QUESTIONS) {
      const v = searchParams.get(`a${q.id}`);
      if (!v || !q.optionKeys.includes(v)) return null;
      out[q.id] = v;
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restoredDestination = restoredAnswers ? presetDestination ?? "canada" : null;

  const [started, setStarted] = useState<boolean>(!!presetDestination || !!restoredAnswers);
  const [step, setStep] = useState(0); // 0..QUESTIONS.length-1
  const [answers, setAnswers] = useState<Answers>(restoredAnswers ?? {});
  const [finished, setFinished] = useState<boolean>(!!restoredAnswers);
  const [destination, setDestination] = useState<string | null>(
    restoredDestination ?? presetDestination,
  );
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySubmitted, setNotifySubmitted] = useState(false);
  const [planWaitlist, setPlanWaitlist] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // When the Canada quiz finishes, store the recommended step so the Canada
  // portal can react to it. The full result view renders here — no redirect.
  useEffect(() => {
    if (!finished) return;
    if (destination !== "canada") return;
    const q1 = answers[1];
    const map: Record<string, number> = {
      researching: 2,
      knows: 3,
      accepted: 4,
      arrived: 6,
    };
    const recommended = (q1 && map[q1]) || 1;
    try {
      sessionStorage.setItem("canadaJourney.recommendedStep", String(recommended));
    } catch {
      /* ignore */
    }
  }, [finished, destination, answers]);

  const destAvailable = destination ? AVAILABLE_DESTINATIONS.has(destination) : false;
  const destLabel = destination ? t(`pathQuiz.destination.options.${destination}`) : "";
  const showSoonScreen = started && destination !== null && !destAvailable && !answers[-1];

  const total = QUESTIONS.length;
  const q = QUESTIONS[step];
  const progress = ((step + (finished ? 1 : 0)) / total) * 100;

  const currentStep = useMemo(() => currentStepFromAnswers(answers), [answers]);
  const highlights = useMemo(() => buildHighlights(answers), [answers]);
  const score = useMemo(() => computeScore(answers), [answers]);
  const highlightsByStep = useMemo(() => {
    const map = new Map<number, Highlight[]>();
    for (const h of highlights) {
      if (!map.has(h.step)) map.set(h.step, []);
      map.get(h.step)!.push(h);
    }
    return map;
  }, [highlights]);

  function selectOption(key: AnswerKey) {
    const next = { ...answers, [q.id]: key };
    setAnswers(next);
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  }

  function goBack() {
    if (step > 0) setStep(step - 1);
  }

  function reset() {
    setStarted(false);
    setStep(0);
    setAnswers({});
    setFinished(false);
    setDestination(null);
    setNotifyEmail("");
    setNotifySubmitted(false);
  }

  // ---------- Landing ----------
  if (!started) {
    const cards = ["destination", "questions", "roadmap"] as const;
    return (
      <section className="container py-16 md:py-24 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-6">
          <Sparkles className="w-4 h-4 text-crimson" />
          {t("pathQuiz.landing.eyebrow")}
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-navy tracking-tight leading-tight">
          {t("pathQuiz.landing.title")}
        </h1>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          {t("pathQuiz.landing.subtitle")}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" className="bg-crimson hover:bg-crimson/90 text-white" onClick={() => setStarted(true)}>
            {t("pathQuiz.landing.cta")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <div key={c} className="rounded-lg border border-border bg-card p-5">
              <div className="text-sm font-semibold text-navy">{t(`pathQuiz.landing.features.${c}.title`)}</div>
              <div className="mt-1 text-sm text-muted-foreground">{t(`pathQuiz.landing.features.${c}.desc`)}</div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ---------- Destination selection ----------
  if (destination === null) {
    return (
      <section className="container py-14 md:py-20 max-w-2xl">
        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Globe className="w-4 h-4 text-crimson" />
            {t("pathQuiz.destination.eyebrow")}
          </span>
          <button
            onClick={reset}
            className="text-muted-foreground hover:text-crimson transition-colors normal-case tracking-normal"
          >
            {t("pathQuiz.destination.restart")}
          </button>
        </div>
        <Progress value={0} className="mt-3 h-2" />

        <h1 className="mt-8 font-display text-2xl md:text-3xl font-semibold text-navy leading-tight">
          {t("pathQuiz.destination.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("pathQuiz.destination.subtitle")}
        </p>

        <div className="mt-8 grid gap-3">
          {DESTINATION_KEYS.map((key) => {
            const available = AVAILABLE_DESTINATIONS.has(key);
            return (
              <button
                key={key}
                onClick={() => setDestination(key)}
                className={[
                  "group w-full text-left rounded-xl border p-4 md:p-5 transition-all",
                  "hover:border-crimson hover:shadow-md hover:-translate-y-0.5",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-azul",
                  "border-border bg-card",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-base md:text-lg font-medium text-navy">
                    {t(`pathQuiz.destination.options.${key}`)}
                  </span>
                  {available ? (
                    <span className="inline-flex items-center gap-1 text-azul text-xs font-semibold px-2.5 py-0.5">
                      {t("pathQuiz.destination.available")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground text-xs font-medium px-2.5 py-0.5">
                      {t("pathQuiz.destination.comingSoon")}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  // ---------- Country "coming soon" screen ----------
  if (showSoonScreen) {
    return (
      <section className="container py-14 md:py-20 max-w-2xl">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-5">
          <Globe className="w-4 h-4 text-crimson" />
          {destLabel}
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-navy leading-tight">
          {t("pathQuiz.soon.title")}
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          {t("pathQuiz.soon.body", { country: destLabel })}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            className="bg-crimson hover:bg-crimson/90 text-white"
            onClick={() => setAnswers({ ...answers, [-1]: "continue_canada" })}
          >
            {t("pathQuiz.soon.continueCanada")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setDestination(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("pathQuiz.soon.chooseOther")}
          </Button>
        </div>

        <div className="mt-10 rounded-xl border border-border bg-card p-5 md:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-navy">
            <Mail className="h-4 w-4 text-azul" />
            {t("pathQuiz.soon.notifyTitle", { country: destLabel })}
          </div>
          {notifySubmitted ? (
            <p className="mt-3 text-sm text-muted-foreground">
              <Trans
                i18nKey="pathQuiz.soon.notifyThanks"
                values={{ email: notifyEmail }}
                components={{ strong: <span className="font-medium text-navy" /> }}
              />
            </p>
          ) : (
            <form
              className="mt-3 flex flex-col sm:flex-row gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (notifyEmail.trim()) setNotifySubmitted(true);
              }}
            >
              <Input
                type="email"
                required
                placeholder={t("pathQuiz.soon.notifyEmailPlaceholder")}
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="outline">
                {t("pathQuiz.soon.notifyButton")}
              </Button>
            </form>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            {t("pathQuiz.soon.notifyPrivacy")}
          </p>
        </div>
      </section>
    );
  }

  // ---------- Result ----------
  if (finished) {
    // Plan summary chips (only from actual answers).
    type Chip = { icon: typeof Flag; labelKey: string; valueKey: string };
    const summaryChips: Chip[] = [];
    if (answers[2]) summaryChips.push({ icon: Flag, labelKey: "pathQuiz.plan.summary.objective", valueKey: `pathQuiz.questions.q2.options.${answers[2]}` });
    if (answers[3]) summaryChips.push({ icon: GraduationCap, labelKey: "pathQuiz.plan.summary.level", valueKey: `pathQuiz.questions.q3.options.${answers[3]}` });
    if (answers[4]) summaryChips.push({ icon: BookOpen, labelKey: "pathQuiz.plan.summary.field", valueKey: `pathQuiz.questions.q4.options.${answers[4]}` });
    if (answers[5]) summaryChips.push({ icon: Languages, labelKey: "pathQuiz.plan.summary.language", valueKey: `pathQuiz.questions.q5.options.${answers[5]}` });
    if (answers[6]) summaryChips.push({ icon: Users, labelKey: "pathQuiz.plan.summary.companions", valueKey: `pathQuiz.questions.q6.options.${answers[6]}` });
    if (answers[7]) summaryChips.push({ icon: Wallet, labelKey: "pathQuiz.plan.summary.budget", valueKey: `pathQuiz.questions.q7.options.${answers[7]}` });

    // Derive next 3 actions in priority order.
    type NextAction = { key: string; titleKey: string; whyKey: string; href: string; Icon: typeof Languages };
    const actionCandidates: NextAction[] = [];
    if (answers[5] === "improve") {
      actionCandidates.push({
        key: "language",
        titleKey: "pathQuiz.plan.nextActions.language.title",
        whyKey: "pathQuiz.plan.nextActions.language.why",
        href: "/canada/study-permit",
        Icon: Languages,
      });
    }
    if (answers[2] === "stay") {
      actionCandidates.push({
        key: "pgwp",
        titleKey: "pathQuiz.plan.nextActions.pgwp.title",
        whyKey: "pathQuiz.plan.nextActions.pgwp.why",
        href: "/canada/pgwp",
        Icon: GraduationCap,
      });
    }
    if (answers[7] && answers[7] !== "planned") {
      actionCandidates.push({
        key: "budget",
        titleKey: "pathQuiz.plan.nextActions.budget.title",
        whyKey: "pathQuiz.plan.nextActions.budget.why",
        href: "/canada/simulador",
        Icon: Wallet,
      });
    }
    const currentStepDef = STEPS.find((s) => s.n === currentStep);
    if (currentStepDef?.href) {
      actionCandidates.push({
        key: `step-${currentStepDef.n}`,
        titleKey: `pathQuiz.steps.s${currentStepDef.n}.title`,
        whyKey: "pathQuiz.plan.nextActions.currentStep.why",
        href: currentStepDef.href,
        Icon: currentStepDef.Icon,
      });
    }
    const nextActions = actionCandidates.slice(0, 3);

    const copyShareLink = async () => {
      try {
        const url = new URL(window.location.href);
        for (const q of QUESTIONS) {
          const v = answers[q.id];
          if (v) url.searchParams.set(`a${q.id}`, v);
        }
        if (destination) url.searchParams.set("country", destination);
        await navigator.clipboard.writeText(url.toString());
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      } catch {
        /* ignore */
      }
    };

    return (
      <section className="container py-14 md:py-20 max-w-4xl">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-crimson mb-5">
          <Sparkles className="w-4 h-4" />
          {t("pathQuiz.result.eyebrow")}
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-semibold text-navy tracking-tight leading-tight">
          {t("pathQuiz.result.title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          {t(objectiveSummaryKey(answers))} {t("pathQuiz.result.intro")}
        </p>

        {/* Plan summary header — derived from answers */}
        {summaryChips.length > 0 && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Target className="h-3.5 w-3.5" strokeWidth={1.5} />
              {t("pathQuiz.plan.summary.eyebrow")}
            </div>
            <h2 className="mt-1 font-display text-lg md:text-xl font-semibold text-navy">
              {t("pathQuiz.plan.summary.title")}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {summaryChips.map((c) => {
                const Icon = c.icon;
                return (
                  <span
                    key={c.labelKey}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs"
                  >
                    <Icon className="h-3.5 w-3.5 text-navy" strokeWidth={1.5} />
                    <span className="text-muted-foreground">{t(c.labelKey)}:</span>
                    <span className="font-medium text-navy">{t(c.valueKey)}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Compatibility Score */}
        {(() => {
          const toneClasses =
            score.tone === "high"
              ? { ring: "ring-emerald-500/40", text: "text-emerald-700", bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-800" }
              : score.tone === "medium"
              ? { ring: "ring-amber-500/40", text: "text-amber-700", bar: "bg-amber-500", badge: "bg-amber-100 text-amber-900" }
              : { ring: "ring-crimson/40", text: "text-crimson", bar: "bg-crimson", badge: "bg-crimson/10 text-crimson" };
          const circumference = 2 * Math.PI * 44;
          const dash = (score.percent / 100) * circumference;
          return (
            <div className={`mt-8 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm ring-1 ${toneClasses.ring}`}>
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="relative shrink-0" style={{ width: 120, height: 120 }}>
                  <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
                    <circle cx="60" cy="60" r="44" strokeWidth="10" className="stroke-muted fill-none" />
                    <circle
                      cx="60"
                      cy="60"
                      r="44"
                      strokeWidth="10"
                      strokeLinecap="round"
                      className={`fill-none ${score.tone === "high" ? "stroke-emerald-500" : score.tone === "medium" ? "stroke-amber-500" : "stroke-crimson"}`}
                      strokeDasharray={`${dash} ${circumference}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`font-display text-3xl font-semibold ${toneClasses.text}`}>{score.percent}%</span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("pathQuiz.result.scoreLabel")}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    {t("pathQuiz.result.scoreEyebrow")}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${toneClasses.badge}`}>
                      {t(score.labelKey)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {t("pathQuiz.result.scoreDesc")}
                  </p>
                </div>
              </div>

              {score.factors.length > 0 && (
                <ul className="mt-6 grid gap-2">
                  {score.factors.map((f, i) => (
                    <li
                      key={i}
                      className={[
                        "flex gap-3 rounded-lg border p-3 text-sm leading-relaxed",
                        f.kind === "positive"
                          ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-900"
                          : "border-amber-500/30 bg-amber-500/5 text-amber-900",
                      ].join(" ")}
                    >
                      {f.kind === "positive" ? (
                        <Check className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
                      )}
                      <span>{t(f.messageKey)}</span>
                    </li>
                  ))}
                </ul>
              )}

              <IrccNote className="mt-5" />
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                {t("pathQuiz.result.scoreDisclaimer")}
              </p>
            </div>
          );
        })()}

        {/* Your next 3 actions */}
        {nextActions.length > 0 && (
          <div className="mt-6 rounded-2xl border border-navy/20 bg-navy/[0.03] p-5 md:p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-navy/70">
              <ListChecks className="h-3.5 w-3.5" strokeWidth={1.5} />
              {t("pathQuiz.plan.nextActions.eyebrow")}
            </div>
            <h2 className="mt-1 font-display text-lg md:text-xl font-semibold text-navy">
              {t("pathQuiz.plan.nextActions.title")}
            </h2>
            <ol className="mt-4 grid gap-3">
              {nextActions.map((a, i) => {
                const Icon = a.Icon;
                return (
                  <li
                    key={a.key}
                    className="flex gap-3 rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold text-navy">
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-navy" strokeWidth={1.5} />
                        <h3 className="font-display font-semibold text-navy">
                          {t(a.titleKey)}
                        </h3>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {t(a.whyKey)}
                      </p>
                      <Link
                        to={a.href}
                        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-crimson hover:underline"
                      >
                        {t("pathQuiz.plan.nextActions.cta")}
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            {t("pathQuiz.result.redo")}
          </Button>
          <Button asChild className="bg-navy hover:bg-navy/90 text-white">
            <Link to="/canada">{t("pathQuiz.result.portalCanada")}</Link>
          </Button>
          <Button asChild variant="outline" className="border-crimson text-crimson hover:bg-crimson/5">
            <Link to="/canada/simulador">{t("pathQuiz.result.simulate")}</Link>
          </Button>
          <Button variant="outline" onClick={copyShareLink}>
            {shareCopied ? (
              <>
                <ClipboardCheck className="mr-2 h-4 w-4" />
                {t("pathQuiz.plan.share.copied")}
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                {t("pathQuiz.plan.share.copy")}
              </>
            )}
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {t("pathQuiz.plan.share.hint")}
        </p>

        {/* Timeline */}
        <div className="mt-12 relative">
          <div className="absolute left-5 md:left-6 top-0 bottom-0 w-px bg-border" aria-hidden />
          <ol className="space-y-6">
            {STEPS.map((s) => {
              const isCurrent = s.n === currentStep;
              const isPast = s.n < currentStep;
              const stepHighlights = highlightsByStep.get(s.n) ?? [];
              const hasPriority = stepHighlights.some((h) => h.kind === "priority");

              return (
                <li key={s.n} className="relative pl-14 md:pl-20">
                  <div
                    className={[
                      "absolute left-0 top-1 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border-2 shadow-sm",
                      isCurrent
                        ? "bg-crimson border-crimson text-white"
                        : isPast
                        ? "bg-azul/10 border-azul/40 text-azul"
                        : "bg-card border-border text-muted-foreground",
                    ].join(" ")}
                  >
                    {isPast ? <Check className="h-5 w-5" /> : <s.Icon className="h-5 w-5" />}
                  </div>

                  <div
                    className={[
                      "rounded-xl border p-5 md:p-6 bg-card transition-shadow",
                      isCurrent ? "border-crimson/50 shadow-md ring-1 ring-crimson/20" : "border-border",
                    ].join(" ")}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground">
                        {t("pathQuiz.result.stepPrefix", { n: s.n })}
                      </span>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 text-crimson text-xs font-semibold px-2.5 py-0.5">
                          <MapPin className="h-3 w-3" />
                          {t("pathQuiz.result.hereBadge")}
                        </span>
                      )}
                      {isPast && (
                        <span className="inline-flex items-center gap-1 text-azul text-xs font-medium px-2.5 py-0.5">
                          <Check className="h-3 w-3" />
                          {t("pathQuiz.result.doneBadge")}
                        </span>
                      )}
                      {hasPriority && !isPast && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-700 text-xs font-semibold px-2.5 py-0.5">
                          <AlertTriangle className="h-3 w-3" />
                          {t("pathQuiz.result.priorityBadge")}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-lg md:text-xl font-semibold text-navy">
                      {t(`pathQuiz.steps.s${s.n}.title`)}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                      {t(`pathQuiz.steps.s${s.n}.description`)}
                    </p>

                    {isCurrent && (
                      <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-navy">
                        <ArrowRight className="h-4 w-4 text-crimson" />
                        {t("pathQuiz.result.nextStep")}
                      </div>
                    )}

                    {stepHighlights.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {stepHighlights.map((h, i) => (
                          <div
                            key={i}
                            className={[
                              "flex gap-2 rounded-md border p-3 text-sm leading-relaxed",
                              h.kind === "priority"
                                ? "border-amber-500/40 bg-amber-500/5 text-amber-900"
                                : "border-azul/30 bg-azul/5 text-navy",
                            ].join(" ")}
                          >
                            <AlertTriangle
                              className={[
                                "h-4 w-4 mt-0.5 shrink-0",
                                h.kind === "priority" ? "text-amber-600" : "text-azul",
                              ].join(" ")}
                            />
                            <span>
                              {t(h.messageKey)}
                              {h.officialLink && (
                                <>
                                  {" "}
                                  <a
                                    href={h.officialLink.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 font-medium underline hover:no-underline"
                                  >
                                    {t(h.officialLink.labelKey)}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {s.n === 2 && <LanguageTestsGuide />}

                    {s.n === 4 && (
                      <IrccNote
                        className="mt-4"
                        href={IRCC_PGWP_URL}
                        linkLabel={t("pathQuiz.irccLinks.pgwpEligibility")}
                      />
                    )}
                    {s.n === 5 && (
                      <IrccNote
                        className="mt-4"
                        href={IRCC_PROOF_URL}
                        linkLabel={t("pathQuiz.irccLinks.proofOfFunds")}
                      />
                    )}
                    {s.n === 8 && (
                      <IrccNote
                        className="mt-4"
                        href={IRCC_SPOUSE_URL}
                        linkLabel={t("pathQuiz.irccLinks.spouseWorkPermit")}
                      />
                    )}

                    {s.href && (
                      <div className="mt-4">
                        <Button
                          asChild
                          size="sm"
                          variant={isCurrent ? "default" : "outline"}
                          className={isCurrent ? "bg-crimson hover:bg-crimson/90 text-white" : ""}
                        >
                          <Link to={s.href}>
                            {t(`pathQuiz.steps.s${s.n}.ctaLabel`)}
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <Alert className="mt-12 border-crimson/40 bg-crimson/5">
          <AlertTriangle className="h-5 w-5 text-crimson" />
          <AlertTitle className="font-display text-navy">{t("pathQuiz.result.importantTitle")}</AlertTitle>
          <AlertDescription className="text-muted-foreground mt-2 leading-relaxed">
            {t("pathQuiz.result.importantBody")}
          </AlertDescription>
        </Alert>
      </section>
    );
  }

  // ---------- Question ----------
  return (
    <section className="container py-14 md:py-20 max-w-2xl">
      <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
        <span>{t("pathQuiz.question.counter", { step: step + 1, total })}</span>
        <button
          onClick={reset}
          className="text-muted-foreground hover:text-crimson transition-colors normal-case tracking-normal"
        >
          {t("pathQuiz.question.restart")}
        </button>
      </div>
      <Progress value={progress} className="mt-3 h-2" />

      <h1 className="mt-8 font-display text-2xl md:text-3xl font-semibold text-navy leading-tight">
        {t(`pathQuiz.questions.q${q.id}.title`)}
      </h1>

      <div className="mt-8 grid gap-3">
        {q.optionKeys.map((optKey) => {
          const selected = answers[q.id] === optKey;
          return (
            <button
              key={optKey}
              onClick={() => selectOption(optKey)}
              className={[
                "group w-full text-left rounded-xl border p-4 md:p-5 transition-all",
                "hover:border-crimson hover:shadow-md hover:-translate-y-0.5",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-azul",
                selected ? "border-crimson bg-crimson/5" : "border-border bg-card",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-base md:text-lg font-medium text-navy">
                  {t(`pathQuiz.questions.q${q.id}.options.${optKey}`)}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-crimson transition-colors" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={goBack} disabled={step === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("pathQuiz.question.back")}
        </Button>
        <span className="text-xs text-muted-foreground">
          {t("pathQuiz.question.hint")}
        </span>
      </div>
    </section>
  );
}