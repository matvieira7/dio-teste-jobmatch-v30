import { createFileRoute, Link } from "@tanstack/react-router";
import { KanbanSquare, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/store";
import type { ApplicationStatus } from "@/lib/types";

const COLUMNS: { status: ApplicationStatus; label: string }[] = [
  { status: "interessado", label: "Interessado" },
  { status: "aplicado", label: "Aplicado" },
  { status: "entrevista", label: "Entrevista" },
  { status: "teste", label: "Teste técnico" },
  { status: "oferta", label: "Oferta" },
  { status: "rejeitado", label: "Rejeitado" },
];

export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [
      { title: "Minhas candidaturas — VagaMatch" },
      {
        name: "description",
        content:
          "Acompanhe o status de cada candidatura em um quadro simples: interessado, aplicado, entrevista, teste, oferta.",
      },
      { property: "og:title", content: "Minhas candidaturas — VagaMatch" },
      { property: "og:description", content: "Quadro de acompanhamento das suas candidaturas." },
    ],
  }),
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const { applications, jobs, upsertApplication, removeApplication } = useStore();

  return (
    <AppShell
      title="Candidaturas"
      description={`${applications.length} processo(s) em acompanhamento`}
    >
      {applications.length === 0 ? (
        <EmptyState
          icon={KanbanSquare}
          title="Nenhuma candidatura registrada"
          description="Marque uma vaga como aplicada para acompanhar o processo aqui."
          action={
            <Button asChild>
              <Link to="/jobs">Ver vagas</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {COLUMNS.map((col) => {
            const items = applications.filter((a) => a.status === col.status);
            return (
              <div key={col.status} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-brand-deep">{col.label}</h2>
                  <Badge variant="secondary">{items.length}</Badge>
                </div>
                <div className="space-y-3">
                  {items.map((app) => {
                    const job = jobs.find((j) => j.id === app.jobId);
                    if (!job) return null;
                    return (
                      <Card key={app.id}>
                        <CardContent className="space-y-3 p-4">
                          <Link
                            to="/jobs/$id"
                            params={{ id: job.id }}
                            className="text-sm font-semibold text-brand-deep hover:underline"
                          >
                            {job.title}
                          </Link>
                          <p className="text-xs text-muted-foreground">{job.company}</p>
                          <Select
                            value={app.status}
                            onValueChange={(v) => upsertApplication(job.id, v as ApplicationStatus)}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {COLUMNS.map((c) => (
                                <SelectItem key={c.status} value={c.status}>
                                  {c.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-full"
                            onClick={() => removeApplication(app.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden /> Remover
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {items.length === 0 && (
                    <p className="rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">
                      Nada por aqui.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
