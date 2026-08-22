import { Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Building2, MapPin, Wallet } from "lucide-react";
import { MatchBadge } from "@/components/common/score";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import type { Job } from "@/lib/types";

export function formatSalary(job: Job) {
  if (!job.salaryMin && !job.salaryMax) return "Salário não informado";
  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: job.currency, maximumFractionDigits: 0 });
  if (job.salaryMin && job.salaryMax) return `${fmt(job.salaryMin)} – ${fmt(job.salaryMax)}`;
  return fmt((job.salaryMin ?? job.salaryMax) as number);
}

const WORK_MODEL_LABEL: Record<Job["workModel"], string> = {
  presencial: "Presencial",
  hibrido: "Híbrido",
  remoto: "Remoto",
};

const SENIORITY_LABEL: Record<Job["seniority"], string> = {
  estagio: "Estágio",
  junior: "Júnior",
  pleno: "Pleno",
  senior: "Sênior",
  especialista: "Especialista",
};

export { WORK_MODEL_LABEL, SENIORITY_LABEL };

export function JobCard({ job, score }: { job: Job; score: number }) {
  const { savedJobs, toggleSavedJob } = useStore();
  const saved = savedJobs.includes(job.id);

  return (
    <Card className="transition-shadow hover:shadow-sm">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-sm font-semibold text-brand-deep">
          {job.companyLogo}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                to="/jobs/$id"
                params={{ id: job.id }}
                className="text-base font-semibold text-brand-deep hover:underline"
              >
                {job.title}
              </Link>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" aria-hidden /> {job.company}
              </p>
            </div>
            <MatchBadge score={score} />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden /> {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Wallet className="h-3.5 w-3.5" aria-hidden /> {formatSalary(job)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge variant="secondary">{WORK_MODEL_LABEL[job.workModel]}</Badge>
            <Badge variant="secondary">{SENIORITY_LABEL[job.seniority]}</Badge>
            {job.requiredSkills.slice(0, 3).map((s) => (
              <Badge key={s} variant="outline">
                {s}
              </Badge>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link to="/jobs/$id" params={{ id: job.id }}>
                Ver detalhes do match
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toggleSavedJob(job.id)}
              aria-pressed={saved}
            >
              {saved ? (
                <>
                  <BookmarkCheck className="h-4 w-4" aria-hidden /> Salva
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" aria-hidden /> Salvar
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
