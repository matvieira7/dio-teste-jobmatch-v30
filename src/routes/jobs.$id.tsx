import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Building2,
  CheckCircle2,
  MapPin,
  Sparkles,
  Wallet,
  XCircle,
} from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/empty-state";
import { ScoreBar, ScoreRing } from "@/components/common/score";
import { SENIORITY_LABEL, WORK_MODEL_LABEL, formatSalary } from "@/components/jobs/job-card";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AIService } from "@/lib/ai-service";
import { analyzeJob, calculateMatch } from "@/lib/matching";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/jobs/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes da vaga — VagaMatch" },
      {
        name: "description",
        content:
          "Veja a análise completa de compatibilidade com a vaga: competências atendidas, lacunas e requisitos.",
      },
      { property: "og:title", content: "Detalhes da vaga — VagaMatch" },
      {
        property: "og:description",
        content: "Análise detalhada de match entre o seu perfil e os requisitos da vaga.",
      },
    ],
  }),
  component: JobDetail,
});

function JobDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { jobs, profile, savedJobs, toggleSavedJob, upsertApplication, addVersion } = useStore();
  const job = jobs.find((j) => j.id === id);

  const match = useMemo(() => (job ? calculateMatch(profile, job) : null), [job, profile]);
  const analysis = useMemo(() => (job ? analyzeJob(job) : null), [job]);

  if (!job || !match || !analysis) {
    return (
      <AppShell title="Vaga não encontrada">
        <EmptyState
          icon={Building2}
          title="Vaga não encontrada"
          description="A vaga que você procura não está mais disponível nesta sessão."
          action={
            <Button asChild>
              <Link to="/jobs">Ver todas as vagas</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  const saved = savedJobs.includes(job.id);

  const createTailoredResume = () => {
    const optimized = AIService.optimizeResume(profile, job);
    const ats = AIService.analyzeResume(profile, job);
    addVersion({
      id: `ver-${Date.now()}`,
      name: `${job.title} — ${job.company}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      createdAt: new Date().toISOString(),
      atsScore: ats.score,
      matchScore: match.score,
      summary: optimized.summary,
      highlightedSkills: optimized.highlightedSkills,
      addedKeywords: optimized.addedKeywords,
      experienceOrder: optimized.experienceOrder,
      notes: [...optimized.notes, ...optimized.missingInfo],
    });
    toast.success("Currículo personalizado criado com base apenas nos seus dados.");
    void navigate({ to: "/resume/versions" });
  };

  return (
    <AppShell
      title={job.title}
      description={`${job.company} · ${job.location}`}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => toggleSavedJob(job.id)}>
            {saved ? (
              <BookmarkCheck className="h-4 w-4" aria-hidden />
            ) : (
              <Bookmark className="h-4 w-4" aria-hidden />
            )}
            {saved ? "Salva" : "Salvar"}
          </Button>
          <Button size="sm" onClick={createTailoredResume}>
            <Sparkles className="h-4 w-4" aria-hidden /> Currículo para esta vaga
          </Button>
        </>
      }
    >
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link to="/jobs">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar para vagas
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" aria-hidden /> {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Wallet className="h-4 w-4" aria-hidden /> {formatSalary(job)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{WORK_MODEL_LABEL[job.workModel]}</Badge>
                <Badge variant="secondary">{SENIORITY_LABEL[job.seniority]}</Badge>
                <Badge variant="outline">{job.employmentType.toUpperCase()}</Badge>
              </div>
              <Separator />
              <p className="text-sm leading-relaxed text-muted-foreground">{job.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Responsabilidades</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {job.responsibilities.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {r}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Requisitos e lacunas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-brand-deep">Você já atende</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {match.matchedSkills.length ? (
                    match.matchedSkills.map((s) => (
                      <Badge key={s} variant="secondary" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" aria-hidden /> {s}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma competência do seu perfil coincide com os requisitos.
                    </p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-brand-deep">Lacunas obrigatórias</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {match.missingRequired.length ? (
                    match.missingRequired.map((s) => (
                      <Badge key={s} variant="outline" className="gap-1">
                        <XCircle className="h-3 w-3" aria-hidden /> {s}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma lacuna obrigatória.</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-brand-deep">Diferenciais desejáveis</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {analysis.desired.map((s) => (
                    <Badge key={s} variant="outline">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Benefícios</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
              {job.benefits.map((b) => (
                <Badge key={b} variant="secondary">
                  {b}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-5 p-5">
              <ScoreRing value={match.score} label="Compatibilidade" />
              <div className="space-y-3">
                <ScoreBar label="Competências" value={match.breakdown.skills} />
                <ScoreBar label="Experiência" value={match.breakdown.experience} />
                <ScoreBar label="Formação" value={match.breakdown.education} />
                <ScoreBar label="Senioridade" value={match.breakdown.seniority} />
                <ScoreBar label="Localização" value={match.breakdown.location} />
                <ScoreBar label="Palavras-chave" value={match.breakdown.keywords} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Por que este match</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {match.reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 p-5">
              <Button
                className="w-full"
                onClick={() => {
                  upsertApplication(job.id, "aplicado");
                  toast.success("Candidatura registrada no seu acompanhamento.");
                }}
              >
                Marcar como aplicado
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href={job.sourceUrl} target="_blank" rel="noreferrer noopener">
                  Ver na origem ({job.source})
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
