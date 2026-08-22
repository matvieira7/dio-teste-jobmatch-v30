import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bookmark,
  BrainCircuit,
  CheckCircle2,
  FileSearch,
  KanbanSquare,
  ScanSearch,
  Sparkles,
  Target,
} from "lucide-react";
import { Logo } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const TITLE = "VagaMatch — Matchmaking de vagas e currículo ATS Friendly";
const DESCRIPTION =
  "Analise seu perfil, encontre vagas compatíveis, entenda seu match e gere um currículo ATS Friendly personalizado para cada oportunidade.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const STEPS = [
  { title: "Crie seu perfil", text: "Informe experiências, formação, competências e objetivos." },
  { title: "Encontre vagas compatíveis", text: "A plataforma compara seu perfil com as oportunidades disponíveis." },
  { title: "Veja seu Match", text: "Entenda exatamente por que uma vaga combina com seu perfil." },
  { title: "Gere seu currículo", text: "Crie automaticamente uma versão personalizada e ATS Friendly." },
  { title: "Candidate-se", text: "Baixe o currículo e utilize-o na candidatura." },
];

const BENEFITS = [
  { icon: Target, title: "Match inteligente", text: "Comparação entre perfil e requisitos com explicação de cada fator." },
  { icon: FileSearch, title: "Análise de currículo", text: "Estrutura, clareza e informações ausentes identificadas." },
  { icon: ScanSearch, title: "Otimização ATS", text: "Estimativa de compatibilidade com sistemas de triagem." },
  { icon: BrainCircuit, title: "Personalização por vaga", text: "Uma versão de currículo para cada oportunidade." },
  { icon: Sparkles, title: "Palavras-chave", text: "Termos relevantes da vaga destacados no seu currículo." },
  { icon: KanbanSquare, title: "Acompanhamento", text: "Kanban das suas candidaturas do interesse à oferta." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3.5">
          <Logo />
          <nav className="flex items-center gap-2" aria-label="Ações principais">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <a href="#como-funciona">Como funciona</a>
            </Button>
            <Button asChild size="sm">
              <Link to="/onboarding">Começar agora</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-5 pb-16 pt-16 sm:pt-24">
        <Badge variant="secondary" className="mb-5">
          Sem cadastro. Comece em segundos.
        </Badge>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              Encontre vagas que combinam com você. Crie um currículo feito para cada oportunidade.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              A plataforma analisa o seu perfil, encontra vagas compatíveis, identifica as
              palavras-chave importantes de cada descrição, calcula a compatibilidade, adapta o seu
              currículo e gera uma versão ATS Friendly pronta para a candidatura.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/onboarding">
                  Começar agora <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a href="#como-funciona">Ver como funciona</a>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["Sem login", "Dados no seu navegador", "12 vagas de demonstração"].map((i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-success" aria-hidden /> {i}
                </li>
              ))}
            </ul>
          </div>

          <Card className="border-border/80 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-brand-deep">
                    Desenvolvedor(a) Backend Node.js
                  </p>
                  <p className="text-xs text-muted-foreground">Nordia Tech · Remoto</p>
                </div>
                <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-deep">
                  92% Match
                </span>
              </div>
              <Separator className="my-5" />
              <div className="space-y-3.5">
                {[
                  ["Skills", 96],
                  ["Experiência", 90],
                  ["Senioridade", 95],
                  ["Palavras-chave", 84],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">{label}</span>
                      <span className="tabular-nums text-muted-foreground">{value}%</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-5" />
              <p className="text-xs text-muted-foreground">
                Você possui 9 dos 10 requisitos principais. Estimativa de compatibilidade, não
                garantia de contratação.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="como-funciona" className="border-y border-border bg-surface py-20">
        <div className="mx-auto w-full max-w-6xl px-5">
          <h2 className="text-2xl font-semibold sm:text-3xl">Como funciona</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Um fluxo direto do perfil até a candidatura, sem etapas desnecessárias.
          </p>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <Card className="h-full">
                  <CardContent className="p-5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                      {i + 1}
                    </span>
                    <h3 className="mt-4 text-sm font-semibold">{step.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{step.text}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto w-full max-w-6xl px-5">
          <h2 className="text-2xl font-semibold sm:text-3xl">O que você ganha</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <Card key={title} className="h-full">
                <CardContent className="p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand-deep">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto w-full max-w-3xl px-5 text-center">
          <BarChart3 className="mx-auto h-8 w-8 text-primary" aria-hidden />
          <h2 className="mt-5 text-2xl font-semibold sm:text-3xl">
            Comece agora e descubra quais vagas realmente combinam com você
          </h2>
          <p className="mt-3 text-muted-foreground">
            Nenhum cadastro é necessário nesta versão. Seus dados ficam salvos apenas neste
            navegador.
          </p>
          <Button asChild size="lg" className="mt-8 [font-family:'UnifrakturMaguntia',cursive]">
            <Link to="/onboarding">
              Criar meu perfil <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 text-sm text-muted-foreground">
          <Logo />
          <p>Dados de vagas fictícios, utilizados apenas para demonstração.</p>
        </div>
      </footer>

      <span className="sr-only">
        <Bookmark aria-hidden />
      </span>
    </div>
  );
}
