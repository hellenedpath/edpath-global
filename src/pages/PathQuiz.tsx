import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";

type AnswerKey = string;
type Answers = Record<number, AnswerKey>;

type Question = {
  id: number;
  title: string;
  options: { key: AnswerKey; label: string }[];
};

type Destination = {
  key: string;
  label: string;
  available: boolean;
};

const DESTINATIONS: Destination[] = [
  { key: "canada", label: "Canadá", available: true },
  { key: "usa", label: "Estados Unidos", available: false },
  { key: "uk", label: "Reino Unido", available: false },
  { key: "australia", label: "Austrália", available: false },
  { key: "ireland", label: "Irlanda", available: false },
];

function destinationLabel(key: string): string {
  return DESTINATIONS.find((d) => d.key === key)?.label ?? key;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "Qual é o seu maior objetivo?",
    options: [
      { key: "stay", label: "Construir carreira e ficar no país" },
      { key: "return", label: "Ter experiência internacional e voltar" },
      { key: "explore", label: "Ainda estou explorando" },
    ],
  },
  {
    id: 2,
    title: "Onde você está agora?",
    options: [
      { key: "researching", label: "Só começando a pesquisar" },
      { key: "knows", label: "Já sei mais ou menos o que quero estudar" },
      { key: "accepted", label: "Já fui aceito / me preparando para ir" },
      { key: "arrived", label: "Já estou no país e preciso me estabelecer" },
    ],
  },
  {
    id: 3,
    title: "Como está seu nível de idioma (inglês/francês)?",
    options: [
      { key: "tested", label: "Já tenho teste oficial" },
      { key: "fluent", label: "Falo bem, mas sem teste oficial" },
      { key: "improve", label: "Preciso melhorar ou começar" },
    ],
  },
  {
    id: 4,
    title: "Qual área você quer estudar?",
    options: [
      { key: "health", label: "Saúde" },
      { key: "it", label: "TI / Tecnologia" },
      { key: "business", label: "Negócios" },
      { key: "engineering", label: "Engenharia" },
      { key: "trades", label: "Trades / Ofícios" },
      { key: "education", label: "Educação" },
      { key: "arts", label: "Artes" },
      { key: "unknown", label: "Ainda não sei" },
    ],
  },
  {
    id: 5,
    title: "Você vai sozinho(a) ou com família?",
    options: [
      { key: "solo", label: "Sozinho(a)" },
      { key: "partner", label: "Com cônjuge / parceiro(a)" },
      { key: "children", label: "Com filhos" },
    ],
  },
  {
    id: 6,
    title: "Sobre seu orçamento?",
    options: [
      { key: "planned", label: "Já tenho recursos planejados" },
      { key: "understand", label: "Preciso entender os custos" },
      { key: "work", label: "Vou precisar trabalhar para me manter" },
    ],
  },
];

type Step = {
  n: number;
  title: string;
  Icon: typeof Compass;
  description: string;
  href?: string;
  ctaLabel?: string;
};

const STEPS: Step[] = [
  { n: 1, title: "Descobrir", Icon: Compass, description: "Entender o Canadá como destino: províncias, sistema educacional e estilo de vida.", href: "/canada", ctaLabel: "Explorar o portal Canadá" },
  { n: 2, title: "Verificar idioma", Icon: Languages, description: "Avaliar seu nível de inglês/francês e planejar o teste oficial (IELTS, CELPIP, TEF).", href: "/antes-de-comecar", ctaLabel: "Ver preparação inicial" },
  { n: 3, title: "Escolher programa", Icon: BookOpen, description: "Selecionar curso, instituição (DLI) e cidade que combinam com seu objetivo.", href: "/programas", ctaLabel: "Ver programas" },
  { n: 4, title: "Verificar elegibilidade PGWP", Icon: GraduationCap, description: "Confirmar se sua área de estudo dá direito à permissão de trabalho pós-graduação.", href: "/canada/pgwp", ctaLabel: "Abrir verificador PGWP" },
  { n: 5, title: "Planejar custo", Icon: DollarSign, description: "Estimar tuition, custo de vida e comprovação financeira necessária.", href: "/custos", ctaLabel: "Ver custos" },
  { n: 6, title: "Aplicar", Icon: FileCheck, description: "Enviar candidatura para a instituição e, com a carta de aceite, solicitar o study permit.", href: "/antes-de-comecar", ctaLabel: "Passos antes de começar" },
  { n: 7, title: "Preparar a chegada", Icon: Plane, description: "Passagem, seguro, moradia temporária, documentos e primeiros dias no Canadá.", href: "/trabalho-moradia", ctaLabel: "Trabalho e moradia" },
  { n: 8, title: "Estabelecer-se", Icon: Home, description: "SIN, conta bancária, saúde, moradia definitiva e rotina no Canadá.", href: "/trabalho-moradia", ctaLabel: "Ver como se estabelecer" },
];

function currentStepFromAnswers(a: Answers): number {
  const q2 = a[2];
  if (q2 === "researching") return 1;
  if (q2 === "knows") return 3;
  if (q2 === "accepted") return 6;
  if (q2 === "arrived") return 8;
  return 1;
}

type Highlight = { step: number; kind: "priority" | "info"; message: string };

function buildHighlights(a: Answers): Highlight[] {
  const h: Highlight[] = [];
  if (a[3] === "improve") {
    h.push({ step: 2, kind: "priority", message: "Prioridade: você precisará comprovar o idioma antes de aplicar." });
  } else if (a[3] === "fluent") {
    h.push({ step: 2, kind: "info", message: "Agende um teste oficial (IELTS, CELPIP ou TEF) para formalizar seu nível." });
  }
  if (a[1] === "stay") {
    h.push({ step: 4, kind: "priority", message: "Seu objetivo é ficar no país — escolher um programa elegível ao PGWP é essencial." });
  }
  if (a[6] === "understand") {
    h.push({ step: 5, kind: "info", message: "Comece pelo planejamento de custos — é a base da sua comprovação financeira." });
  } else if (a[6] === "work") {
    h.push({ step: 5, kind: "info", message: "Study permit permite trabalhar até 24h/semana, mas planeje reservas para os primeiros meses." });
  }
  if (a[5] === "children") {
    h.push({ step: 8, kind: "info", message: "Com filhos: pesquise escola pública (gratuita) e cobertura de saúde provincial na sua cidade." });
    h.push({ step: 5, kind: "info", message: "Custos com família aumentam a comprovação financeira exigida pelo IRCC." });
  } else if (a[5] === "partner") {
    h.push({ step: 8, kind: "info", message: "Cônjuge pode ter direito a open work permit dependendo do seu programa." });
  }
  if (a[4] === "unknown") {
    h.push({ step: 3, kind: "info", message: "Explore áreas elegíveis ao PGWP antes de escolher — pode direcionar sua decisão." });
  }
  if (a[2] === "arrived") {
    h.push({ step: 8, kind: "priority", message: "Foque em SIN, conta bancária, saúde provincial e moradia definitiva." });
  }
  return h;
}

function objectiveSummary(a: Answers): string {
  const obj = a[1];
  if (obj === "stay") return "Seu foco é construir carreira e permanecer no Canadá.";
  if (obj === "return") return "Seu foco é ganhar experiência internacional e voltar ao Brasil.";
  return "Você ainda está explorando o caminho — vamos passo a passo.";
}

export default function PathQuiz() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0); // 0..QUESTIONS.length-1
  const [answers, setAnswers] = useState<Answers>({});
  const [finished, setFinished] = useState(false);
  const [destination, setDestination] = useState<string | null>(null);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  const destObj = DESTINATIONS.find((d) => d.key === destination) ?? null;
  const destAvailable = destObj?.available ?? false;
  const showSoonScreen = started && destination !== null && !destAvailable && !answers[-1];
  // answers[-1] === "continue_canada" means user chose to continue via Canada roadmap
  const effectiveDestination =
    destAvailable ? destination : answers[-1] === "continue_canada" ? "canada" : destination;

  const total = QUESTIONS.length;
  const q = QUESTIONS[step];
  const progress = ((step + (finished ? 1 : 0)) / total) * 100;

  const currentStep = useMemo(() => currentStepFromAnswers(answers), [answers]);
  const highlights = useMemo(() => buildHighlights(answers), [answers]);
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
    return (
      <section className="container py-16 md:py-24 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-6">
          <Sparkles className="w-4 h-4 text-crimson" />
          Diagnóstico personalizado
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-navy tracking-tight leading-tight">
          Descubra seu caminho para estudar no exterior
        </h1>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          Escolha seu destino e responda algumas perguntas rápidas. Você recebe um roteiro personalizado, com o seu próximo passo.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" className="bg-crimson hover:bg-crimson/90 text-white" onClick={() => setStarted(true)}>
            Começar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            { title: "Escolha o destino", desc: "Canadá disponível; outros países em breve." },
            { title: "6 perguntas de perfil", desc: "Menos de 2 minutos." },
            { title: "Roteiro em 8 etapas", desc: "Trilha completa da sua jornada." },
          ].map((c) => (
            <div key={c.title} className="rounded-lg border border-border bg-card p-5">
              <div className="text-sm font-semibold text-navy">{c.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{c.desc}</div>
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
            Destino
          </span>
          <button
            onClick={reset}
            className="text-muted-foreground hover:text-crimson transition-colors normal-case tracking-normal"
          >
            Recomeçar
          </button>
        </div>
        <Progress value={0} className="mt-3 h-2" />

        <h1 className="mt-8 font-display text-2xl md:text-3xl font-semibold text-navy leading-tight">
          Para qual país você quer ir?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Escolha seu destino. Por enquanto, o roteiro completo está disponível para o Canadá — outros países estão sendo preparados.
        </p>

        <div className="mt-8 grid gap-3">
          {DESTINATIONS.map((d) => (
            <button
              key={d.key}
              onClick={() => setDestination(d.key)}
              className={[
                "group w-full text-left rounded-xl border p-4 md:p-5 transition-all",
                "hover:border-crimson hover:shadow-md hover:-translate-y-0.5",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-azul",
                "border-border bg-card",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-base md:text-lg font-medium text-navy">{d.label}</span>
                {d.available ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-azul/10 text-azul text-xs font-semibold px-2.5 py-0.5">
                    Disponível
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground text-xs font-medium px-2.5 py-0.5">
                    Em breve
                  </span>
                )}
              </div>
            </button>
          ))}
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
          {destObj?.label}
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-navy leading-tight">
          Esse destino ainda está sendo preparado
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Por enquanto, temos o roteiro completo do Canadá. Quer ver como funciona ou ser avisado quando {destObj?.label} estiver disponível?
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            className="bg-crimson hover:bg-crimson/90 text-white"
            onClick={() => setAnswers({ ...answers, [-1]: "continue_canada" })}
          >
            Continuar pelo Canadá
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setDestination(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Escolher outro país
          </Button>
        </div>

        <div className="mt-10 rounded-xl border border-border bg-card p-5 md:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-navy">
            <Mail className="h-4 w-4 text-azul" />
            Avise-me quando {destObj?.label} estiver disponível
          </div>
          {notifySubmitted ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Obrigado! Vamos avisar você em <span className="font-medium text-navy">{notifyEmail}</span> assim que o roteiro estiver pronto.
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
                placeholder="seu@email.com"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="outline">
                Quero ser avisado
              </Button>
            </form>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Usamos seu email apenas para avisar sobre este destino. Sem spam.
          </p>
        </div>
      </section>
    );
  }

  // ---------- Result ----------
  if (finished) {
    return (
      <section className="container py-14 md:py-20 max-w-4xl">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-crimson mb-5">
          <Sparkles className="w-4 h-4" />
          Seu roteiro
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-semibold text-navy tracking-tight leading-tight">
          Seu caminho personalizado
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          {objectiveSummary(answers)} Abaixo, a trilha completa em 8 etapas com o seu próximo passo destacado.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Refazer o quiz
          </Button>
          <Button asChild className="bg-navy hover:bg-navy/90 text-white">
            <Link to="/canada">Ir ao portal Canadá</Link>
          </Button>
        </div>

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
                        Etapa {s.n}
                      </span>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-crimson/10 text-crimson text-xs font-semibold px-2.5 py-0.5">
                          <MapPin className="h-3 w-3" />
                          Você está aqui
                        </span>
                      )}
                      {isPast && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-azul/10 text-azul text-xs font-medium px-2.5 py-0.5">
                          <Check className="h-3 w-3" />
                          Concluída
                        </span>
                      )}
                      {hasPriority && !isPast && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-700 text-xs font-semibold px-2.5 py-0.5">
                          <AlertTriangle className="h-3 w-3" />
                          Prioridade
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-lg md:text-xl font-semibold text-navy">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                      {s.description}
                    </p>

                    {isCurrent && (
                      <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-navy">
                        <ArrowRight className="h-4 w-4 text-crimson" />
                        Seu próximo passo
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
                            <span>{h.message}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {s.href && s.ctaLabel && (
                      <div className="mt-4">
                        <Button
                          asChild
                          size="sm"
                          variant={isCurrent ? "default" : "outline"}
                          className={isCurrent ? "bg-crimson hover:bg-crimson/90 text-white" : ""}
                        >
                          <Link to={s.href}>
                            {s.ctaLabel}
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
          <AlertTitle className="font-display text-navy">Aviso importante</AlertTitle>
          <AlertDescription className="text-muted-foreground mt-2 leading-relaxed">
            Este roteiro é uma orientação personalizada baseada nas suas respostas e serve como guia. Não substitui aconselhamento profissional. Decisões de imigração devem ser tomadas com um consultor RCIC licenciado. Confirme sempre nas fontes oficiais.
          </AlertDescription>
        </Alert>
      </section>
    );
  }

  // ---------- Question ----------
  return (
    <section className="container py-14 md:py-20 max-w-2xl">
      <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
        <span>Pergunta {step + 1} de {total}</span>
        <button
          onClick={reset}
          className="text-muted-foreground hover:text-crimson transition-colors normal-case tracking-normal"
        >
          Recomeçar
        </button>
      </div>
      <Progress value={progress} className="mt-3 h-2" />

      <h1 className="mt-8 font-display text-2xl md:text-3xl font-semibold text-navy leading-tight">
        {q.title}
      </h1>

      <div className="mt-8 grid gap-3">
        {q.options.map((opt) => {
          const selected = answers[q.id] === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => selectOption(opt.key)}
              className={[
                "group w-full text-left rounded-xl border p-4 md:p-5 transition-all",
                "hover:border-crimson hover:shadow-md hover:-translate-y-0.5",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-azul",
                selected ? "border-crimson bg-crimson/5" : "border-border bg-card",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-base md:text-lg font-medium text-navy">
                  {opt.label}
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
          Voltar
        </Button>
        <span className="text-xs text-muted-foreground">
          Selecione uma opção para continuar
        </span>
      </div>
    </section>
  );
}