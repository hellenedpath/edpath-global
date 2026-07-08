import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  Building2,
  Users,
  Wallet,
  Calendar,
  ShieldCheck,
  PiggyBank,
  ExternalLink,
  Info,
  Calculator,
  ArrowLeft,
} from "lucide-react";

type CityTier = "large" | "medium" | "small";
type Composition = "solo" | "spouse" | "spouse_kid";
type Lifestyle = "economic" | "moderate" | "comfortable";

// Monthly living cost ranges (CAD) — approximations by city tier, per composition, base lifestyle "moderate"
const BASE_MONTHLY: Record<CityTier, Record<Composition, [number, number]>> = {
  large: {
    solo: [2200, 3200],
    spouse: [3200, 4600],
    spouse_kid: [4000, 5800],
  },
  medium: {
    solo: [1700, 2500],
    spouse: [2500, 3700],
    spouse_kid: [3200, 4600],
  },
  small: {
    solo: [1300, 2000],
    spouse: [2000, 3000],
    spouse_kid: [2600, 3800],
  },
};

const LIFESTYLE_FACTOR: Record<Lifestyle, number> = {
  economic: 0.85,
  moderate: 1,
  comfortable: 1.2,
};

// IRCC proof of funds (fora de Quebec, vigente desde set/2025)
const IRCC_FUNDS: Record<Composition, number> = {
  solo: 22895,
  spouse: 28502,
  spouse_kid: 35040,
};

const IRCC_LABEL: Record<Composition, string> = {
  solo: "1 pessoa",
  spouse: "Com cônjuge (2 pessoas)",
  spouse_kid: "Com cônjuge e 1 filho (3 pessoas)",
};

function fmt(n: number) {
  return "CAD $" + Math.round(n).toLocaleString("en-CA");
}

function fmtRange([a, b]: [number, number]) {
  return `${fmt(a)} – ${fmt(b)}`;
}

export default function FinancialSimulator() {
  const [city, setCity] = useState<CityTier>("large");
  const [comp, setComp] = useState<Composition>("solo");
  const [style, setStyle] = useState<Lifestyle>("moderate");
  const [months, setMonths] = useState<number>(12);

  const result = useMemo(() => {
    const [lo, hi] = BASE_MONTHLY[city][comp];
    const f = LIFESTYLE_FACTOR[style];
    const monthly: [number, number] = [lo * f, hi * f];
    const total: [number, number] = [monthly[0] * months, monthly[1] * months];
    const reserve: [number, number] = [monthly[0] * 3, monthly[1] * 4];
    const proof = IRCC_FUNDS[comp];
    return { monthly, total, reserve, proof };
  }, [city, comp, style, months]);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy text-primary-foreground overflow-hidden">
        <div className="container relative py-16 md:py-24 max-w-5xl">
          <Link
            to="/custos"
            className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Custos
          </Link>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary-foreground/70 mb-4">
            <Calculator className="w-4 h-4 text-crimson" />
            Simulador Financeiro
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-white">
            Estime seu projeto de estudo no Canadá
          </h1>
          <p className="mt-5 text-lg text-primary-foreground/85 max-w-2xl leading-relaxed">
            Ajuste as variáveis abaixo para ver uma faixa realista de custos e a
            reserva recomendada. Faixas amplas e honestas — planejamento, não
            promessa.
          </p>
        </div>
      </section>

      {/* Inputs */}
      <section className="container py-12 md:py-16 max-w-5xl">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-2xl text-navy">
              Suas escolhas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* City */}
            <div>
              <Label className="flex items-center gap-2 text-navy font-medium mb-3">
                <Building2 className="w-4 h-4 text-azul" /> Cidade / região
              </Label>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { k: "large", t: "Cidade grande cara", s: "Ex.: Toronto, Vancouver" },
                  { k: "medium", t: "Cidade média", s: "Ex.: Ottawa, Calgary" },
                  { k: "small", t: "Cidade menor", s: "Mais econômica" },
                ].map((o) => (
                  <button
                    key={o.k}
                    onClick={() => setCity(o.k as CityTier)}
                    className={`text-left rounded-lg border p-4 transition-all ${
                      city === o.k
                        ? "border-crimson bg-crimson/5 shadow-sm"
                        : "border-border hover:border-azul/50"
                    }`}
                  >
                    <div className="font-medium text-navy">{o.t}</div>
                    <div className="text-xs text-muted-foreground mt-1">{o.s}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Composition */}
            <div>
              <Label className="flex items-center gap-2 text-navy font-medium mb-3">
                <Users className="w-4 h-4 text-azul" /> Composição
              </Label>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { k: "solo", t: "Sozinho(a)" },
                  { k: "spouse", t: "Com cônjuge" },
                  { k: "spouse_kid", t: "Com cônjuge e filhos" },
                ].map((o) => (
                  <button
                    key={o.k}
                    onClick={() => setComp(o.k as Composition)}
                    className={`text-left rounded-lg border p-4 transition-all ${
                      comp === o.k
                        ? "border-crimson bg-crimson/5 shadow-sm"
                        : "border-border hover:border-azul/50"
                    }`}
                  >
                    <div className="font-medium text-navy">{o.t}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Lifestyle */}
            <div>
              <Label className="flex items-center gap-2 text-navy font-medium mb-3">
                <Wallet className="w-4 h-4 text-azul" /> Estilo de vida
              </Label>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { k: "economic", t: "Econômico", s: "Corta gastos, moradia compartilhada" },
                  { k: "moderate", t: "Moderado", s: "Padrão médio, lazer ocasional" },
                  { k: "comfortable", t: "Confortável", s: "Mais folga, sem apertos" },
                ].map((o) => (
                  <button
                    key={o.k}
                    onClick={() => setStyle(o.k as Lifestyle)}
                    className={`text-left rounded-lg border p-4 transition-all ${
                      style === o.k
                        ? "border-crimson bg-crimson/5 shadow-sm"
                        : "border-border hover:border-azul/50"
                    }`}
                  >
                    <div className="font-medium text-navy">{o.t}</div>
                    <div className="text-xs text-muted-foreground mt-1">{o.s}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="max-w-xs">
              <Label
                htmlFor="months"
                className="flex items-center gap-2 text-navy font-medium mb-3"
              >
                <Calendar className="w-4 h-4 text-azul" /> Duração do programa (meses)
              </Label>
              <Input
                id="months"
                type="number"
                min={1}
                max={120}
                value={months}
                onChange={(e) =>
                  setMonths(Math.max(1, Math.min(120, Number(e.target.value) || 1)))
                }
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Results */}
      <section className="bg-white border-y border-border">
        <div className="container py-12 md:py-16 max-w-5xl space-y-6">
          {/* Two-column: government vs living */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-azul/30 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-azul/10 text-azul">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <span className="text-xs uppercase tracking-widest text-azul font-medium">
                    O que o governo exige
                  </span>
                </div>
                <CardTitle className="font-display text-2xl text-navy mt-3">
                  Prova de fundos oficial (IRCC)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
                <div className="rounded-lg bg-azul/5 p-4">
                  <div className="text-xs uppercase tracking-widest text-azul">
                    {IRCC_LABEL[comp]}
                  </div>
                  <div className="font-display text-3xl font-semibold text-navy mt-1">
                    {fmt(result.proof)}
                    <span className="text-sm font-normal text-muted-foreground"> / ano</span>
                  </div>
                </div>
                <p className="text-sm">
                  Este é o valor <strong>oficial de prova de fundos</strong>{" "}
                  exigido para o visto de estudo (fora de Quebec, vigente desde
                  set/2025). É <strong>adicional à mensalidade</strong> e à
                  passagem. O IRCC atualiza anualmente.
                </p>
                <a
                  href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-azul hover:underline"
                >
                  Confirme o valor atual em canada.ca
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </CardContent>
            </Card>

            <Card className="border-crimson/30 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-crimson/10 text-crimson">
                    <Wallet className="w-5 h-5" />
                  </span>
                  <span className="text-xs uppercase tracking-widest text-crimson font-medium">
                    O que você provavelmente vai gastar
                  </span>
                </div>
                <CardTitle className="font-display text-2xl text-navy mt-3">
                  Custo de vida mensal (estimativa)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
                <div className="rounded-lg bg-crimson/5 p-4">
                  <div className="text-xs uppercase tracking-widest text-crimson">
                    Faixa estimada por mês
                  </div>
                  <div className="font-display text-3xl font-semibold text-navy mt-1">
                    {fmtRange(result.monthly)}
                  </div>
                </div>
                <p className="text-sm">
                  Faixa aproximada considerando moradia, alimentação, transporte
                  e essenciais. <strong>Não é valor garantido</strong> — varia
                  conforme cidade, bairro, câmbio e escolhas pessoais.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Total + Reserve */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-navy/10 text-navy">
                    <Calendar className="w-5 h-5" />
                  </span>
                  <CardTitle className="font-display text-xl text-navy">
                    Custo total estimado ({months} meses)
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="font-display text-2xl md:text-3xl font-semibold text-navy">
                  {fmtRange(result.total)}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Faixa de custo de vida mensal multiplicada pela duração do
                  programa. Não inclui mensalidade, passagem, seguro nem taxas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple/30 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple/10 text-purple">
                    <PiggyBank className="w-5 h-5" />
                  </span>
                  <CardTitle className="font-display text-xl text-navy">
                    Reserva recomendada
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="font-display text-2xl md:text-3xl font-semibold text-navy">
                  {fmtRange(result.reserve)}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sugerimos <strong>3 a 4 meses</strong> de custo de vida como
                  reserva, <strong>além</strong> da prova de fundos — os
                  primeiros meses têm gastos extras de instalação (depósito,
                  móveis, documentos, telefone).
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Visual: government vs living bar */}
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="font-display text-lg text-navy flex items-center gap-2">
                <Info className="w-4 h-4 text-azul" />
                Duas coisas diferentes — não confunda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-baseline justify-between text-sm mb-1">
                  <span className="text-navy font-medium">Prova de fundos (IRCC)</span>
                  <span className="text-muted-foreground">{fmt(result.proof)} / ano</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-azul"
                    style={{
                      width: `${Math.min(100, (result.proof / (result.total[1] + result.proof)) * 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Requisito oficial para o visto.
                </p>
              </div>
              <div>
                <div className="flex items-baseline justify-between text-sm mb-1">
                  <span className="text-navy font-medium">
                    Custo de vida estimado ({months} meses)
                  </span>
                  <span className="text-muted-foreground">{fmtRange(result.total)}</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden flex">
                  <div
                    className="h-full bg-crimson/60"
                    style={{
                      width: `${(result.total[0] / (result.total[1] + result.proof)) * 100}%`,
                    }}
                  />
                  <div
                    className="h-full bg-crimson"
                    style={{
                      width: `${((result.total[1] - result.total[0]) / (result.total[1] + result.proof)) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Estimativa realista de gastos — faixa (mínimo → máximo).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Disclaimer + actions */}
      <section className="container py-12 max-w-3xl space-y-6">
        <Alert className="border-crimson/40 bg-crimson/5">
          <AlertTriangle className="h-5 w-5 text-crimson" />
          <AlertTitle className="font-display text-navy">
            Importante: leia antes de decidir
          </AlertTitle>
          <AlertDescription className="text-muted-foreground mt-2 leading-relaxed">
            As estimativas de custo de vida são aproximadas e servem apenas para
            planejamento. Os valores reais variam conforme suas escolhas e o
            mercado. A prova de fundos é um requisito oficial do governo
            canadense (IRCC), atualizado anualmente e válido fora de Quebec —
            confirme sempre o valor atual em canada.ca. Este simulador não
            substitui aconselhamento financeiro ou de imigração.
          </AlertDescription>
        </Alert>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/custos">Voltar para Custos</Link>
          </Button>
          <Button asChild className="bg-navy hover:bg-navy/90 text-white">
            <Link to="/meu-caminho">Refazer meu diagnóstico</Link>
          </Button>
        </div>
      </section>
    </>
  );
}