import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  FileText,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { JobCard } from "@/components/jobs/job-card";
import { AppShell } from "@/components/layout/app-shell";
import { profileCompleteness } from "@/components/profile/editors";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateMatch, profileSkills, yearsOfExperience } from "@/lib/matching";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — VagaMatch" },
      { name: "description", content: "Acompanhe vagas recomendadas, match médio, currículos criados e insights do seu perfil." },
      { property: "og:title", content: "Dashboard — VagaMatch" },
      { property: "og:description", content: "Acompanhe vagas recomendadas, match médio e insights do seu perfil." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { profile, jobs, versions, applications, hydrated } = useStore();

  const ranked = useMemo(
    () =>
      jobs
        .map((job) => ({ job, match: calculateMatch(profile, job) }))
        .sort((a, b) => b.match.score - a.match.score),
    [jobs, profile],
  );

  const avgMatch = ranked.length
    ? Math.round(ranked.reduce((acc, r) => acc + r.match.score, 0) / ranked.length)
    : 0;
  const recommended = ranked.filter((r) => r.match.score >= 60);
  const completeness = profileCompleteness(profile);

  const insights = useMemo(() => {
    const list: string[] = [];
    const top = ranked[0];
    if (top) {
      list.push(
        `Sua maior compatibilidade é com "${top.job.title}" (${top.match.score}%), na ${top.job.company}.`,
      );
    }
    const gaps = new Map<string, number>();
    ranked.slice(0, 6).forEach((r) =>
      r.match.missingRequired.forEach((s) => gaps.set(s, (gaps.get(s) ?? 0) + 1)),
    );
    const topGap = Array.from(gaps.entries()).sort((a, b) => b[1] - a[1])[0];
    if (topGap) {
      list.push(
        `Adicionar ${topGap[0]} ao seu currículo pode aumentar a compatibilidade com ${topGap[1]} vagas analisadas.`,
      );
    }
    if (profile.summary.length < 120)
      list.push("Seu resumo profissional está curto: 3 a 4 linhas ajudam na leitura por ATS.");
    if (!profile.experiences.some((e) => e.achievements.length))
      list.push("Suas experiências não possuem resultados informados — isso reduz o ATS Score.");
    const years = yearsOfExperience(profile);
    if (years > 0) list.push(`Seu perfil soma cerca de ${years} ano(s) de experiência declarada.`);
    return list;
  }, [ranked, profile]);

  if (!hydrated) {
    return (
      <AppShell title="Dashboard">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </AppShell>
    );
  }

  if (!profile.onboardingCompleted) {
    return (
      <AppShell title="Dashboard">
        <EmptyState
          icon={Sparkles}
          title="Vamos começar pelo seu perfil"
          description="Precisamos das suas experiências e competências para calcular a compatibilidade com as vagas."
          action={
            <Button asChild>
              <Link to="/onboarding">Criar meu perfil</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  const firstName = profile.personal.name.split(" ")[0] ?? "";

  const cards = [
    { label: "Vagas recomendadas", value: recommended.length, icon: Briefcase, hint: "Match acima de 60%" },
    { label: "Match médio", value: `${avgMatch}%`, icon: Target, hint: "Nas vagas disponíveis" },
    { label: "Currículos criados", value: versions.length, icon: FileText, hint: "Versões personalizadas" },
    { label: "Candidaturas", value: applications.length, icon: TrendingUp, hint: "Em acompanhamento" },
  ];

  return (
    <AppShell
      title={`Olá, ${firstName || "candidato"} 👋`}
      description="Veja as oportunidades com maior aderência ao seu perfil hoje."
      actions={
        <Button asChild size="sm">
          <Link to="/jobs">
            Encontrar vagas <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, hint }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <Icon className="h-4 w-4 text-primary" aria-hidden />
              </div>
              <p className="mt-2 text-2xl font-semibold text-brand-deep tabular-nums">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {completeness < 100 && (
        <Card className="mt-6 border-primary/30 bg-brand-soft/40">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-brand-deep">
                Seu perfil está {completeness}% completo
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Perfis completos geram matches mais precisos e um ATS Score mais alto.
              </p>
              <Progress value={completeness} className="mt-3 h-2 max-w-md" />
            </div>
            <Button asChild variant="secondary">
              <Link to="/profile">Completar perfil</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section aria-labelledby="melhores">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="melhores" className="text-lg font-semibold">
              Melhores oportunidades
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/jobs">Ver todas</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {ranked.slice(0, 4).map(({ job, match }) => (
              <JobCard key={job.id} job={job} score={match.score} />
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="h-4 w-4 text-primary" aria-hidden /> Insights do seu perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.map((insight) => (
                <p key={insight} className="rounded-lg bg-surface p-3 text-sm text-muted-foreground">
                  {insight}
                </p>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Suas competências</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {profileSkills(profile).length} competências reconhecidas no seu perfil.
              </p>
              <Button asChild variant="secondary" size="sm" className="mt-4">
                <Link to="/resume">Ver meu currículo</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
