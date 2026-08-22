import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Files, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/empty-state";
import { MatchBadge } from "@/components/common/score";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { exportDocx, exportPdf, exportTxt, versionDoc } from "@/lib/resume-export";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/resume/versions")({
  head: () => ({
    meta: [
      { title: "Currículos personalizados — VagaMatch" },
      {
        name: "description",
        content:
          "Histórico de currículos gerados para vagas específicas, com score ATS e match de cada versão.",
      },
      { property: "og:title", content: "Currículos personalizados — VagaMatch" },
      {
        property: "og:description",
        content: "Cada vaga com sua própria versão de currículo otimizada.",
      },
    ],
  }),
  component: VersionsPage,
});

function VersionsPage() {
  const { versions, profile, removeVersion } = useStore();

  return (
    <AppShell
      title="Currículos personalizados"
      description={`${versions.length} versão(ões) criada(s) a partir do seu perfil`}
    >
      {versions.length === 0 ? (
        <EmptyState
          icon={Files}
          title="Nenhuma versão criada"
          description="Abra uma vaga e gere um currículo personalizado — reorganizamos suas informações reais, sem inventar dados."
          action={
            <Button asChild>
              <Link to="/jobs">Ver vagas</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {versions.map((v) => (
            <Card key={v.id}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-brand-deep">{v.name}</h2>
                    <MatchBadge score={v.matchScore} />
                    <Badge variant="secondary">ATS {v.atsScore}%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{v.summary}</p>
                  {v.highlightedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {v.highlightedSkills.map((s) => (
                        <Badge key={s} variant="outline">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {v.notes.map((n) => (
                      <li key={n}>• {n}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground">
                    Criado em {new Date(v.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col">
                  <Button size="sm" onClick={() => exportPdf(profile, versionDoc(v))}>
                    <Download className="h-4 w-4" aria-hidden /> PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportDocx(profile, versionDoc(v))}
                  >
                    DOCX
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportTxt(profile, versionDoc(v))}
                  >
                    TXT
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      removeVersion(v.id);
                      toast.success("Versão removida.");
                    }}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden /> Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
