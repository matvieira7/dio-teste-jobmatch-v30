import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { JobCard } from "@/components/jobs/job-card";
import { EmptyState } from "@/components/common/empty-state";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { calculateMatch } from "@/lib/matching";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Minhas vagas salvas — VagaMatch" },
      {
        name: "description",
        content: "Vagas que você salvou para revisar depois, com o match atualizado do seu perfil.",
      },
      { property: "og:title", content: "Minhas vagas salvas — VagaMatch" },
      { property: "og:description", content: "Sua lista de vagas salvas com match atualizado." },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { jobs, savedJobs, profile } = useStore();
  const list = jobs.filter((j) => savedJobs.includes(j.id));

  return (
    <AppShell title="Minhas vagas" description={`${list.length} vaga(s) salva(s)`}>
      {list.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Nenhuma vaga salva"
          description="Salve vagas interessantes para acompanhar e gerar currículos personalizados depois."
          action={
            <Button asChild>
              <Link to="/jobs">Explorar vagas</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {list.map((job) => (
            <JobCard key={job.id} job={job} score={calculateMatch(profile, job).score} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
