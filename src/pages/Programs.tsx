import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Briefcase, CheckCircle2, GraduationCap, Info, Lightbulb, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const tips = [
  {
    icon: Lightbulb,
    title: "Pense no seu objetivo de carreira e de imigração",
    description:
      "Escolha uma área que faça sentido para o seu projeto de vida. Se o plano inclui trabalhar no país após a graduação, a elegibilidade para PGWP é um fator importante.",
  },
  {
    icon: CheckCircle2,
    title: "Verifique se a área dá direito a PGWP antes de se inscrever",
    description:
      "Nem todo programa em uma instituição autorizada gera direito à Permissão de Trabalho Pós-Graduação. Confirme a elegibilidade antes de pagar taxas ou assinar contratos.",
  },
  {
    icon: Search,
    title: "Confirme o código CIP do programa com a instituição",
    description:
      "O governo canadense classifica programas pelo CIP code. Use o código exato do seu curso para verificar a elegibilidade oficial no IRCC.",
  },
  {
    icon: Briefcase,
    title: "Considere o mercado de trabalho da área no Canadá",
    description:
      "Pesquise demanda regional, salários médios e requisitos de certificação para sua profissão. Um curso interessante pode não ter vagas abundantes onde você pretende morar.",
  },
];

export default function Programs() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/70 mb-4">
              <span className="text-lg leading-none">🇨🇦</span>
              <span>Canadá</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
              Explore áreas de estudo e sua elegibilidade
            </h1>
            <p className="mt-5 text-lg text-white/80 leading-relaxed max-w-2xl">
              Descubra quais áreas de estudo dão direito à permissão de trabalho pós-graduação (PGWP) e escolha seu caminho com segurança.
            </p>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="container py-14 md:py-20">
        <div className="max-w-3xl mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-navy">
            Como escolher sua área com inteligência
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Antes de se inscrever em um programa, avalie estes pontos para evitar surpresas e fazer uma escolha alinhada aos seus objetivos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tips.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 md:p-7 transition-all hover:border-azul/40 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-azul/10 text-azul">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-semibold text-foreground text-lg leading-snug">
                {title}
              </h3>
              <p className="mt-2 text-muted-foreground leading-relaxed text-sm md:text-base">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-16 md:pb-24">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-crimson/10 text-crimson">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h2 className="mt-6 font-display text-2xl md:text-3xl font-semibold text-navy">
            Pronto para verificar a elegibilidade da sua área?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Use o Verificador PGWP para consultar mais de 300 áreas de estudo e saber se o seu programa dá direito à permissão de trabalho pós-graduação.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-crimson hover:bg-crimson/90 text-white px-8">
              <Link to="/canada/pgwp">
                Verificar elegibilidade da minha área
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/antes-de-comecar">
                <BookOpen className="h-4 w-4" />
                Antes de começar
              </Link>
            </Button>
          </div>

          <div className="mt-6 inline-flex items-start gap-2 text-xs text-muted-foreground max-w-2xl mx-auto">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="text-left">
              A lista de áreas se baseia em fontes oficiais do IRCC sobre campos de estudo elegíveis para PGWP. Sempre confirme a elegibilidade final do seu programa diretamente com a instituição e nas fontes oficiais do governo canadense.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
