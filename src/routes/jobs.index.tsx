import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { JobCard } from "@/components/jobs/job-card";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { calculateMatch } from "@/lib/matching";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "Encontrar vagas — VagaMatch" },
      {
        name: "description",
        content:
          "Busque vagas e veja o percentual de compatibilidade com o seu perfil, com filtros por modelo, senioridade e match mínimo.",
      },
      { property: "og:title", content: "Encontrar vagas — VagaMatch" },
      {
        property: "og:description",
        content: "Vagas ordenadas pela compatibilidade real com o seu perfil profissional.",
      },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  const { jobs, profile } = useStore();
  const [query, setQuery] = useState("");
  const [workModel, setWorkModel] = useState("todos");
  const [seniority, setSeniority] = useState("todos");
  const [minMatch, setMinMatch] = useState(0);
  const [showFilters, setShowFilters] = useState(true);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs
      .map((job) => ({ job, match: calculateMatch(profile, job) }))
      .filter(({ job, match }) => {
        if (q && !`${job.title} ${job.company} ${job.requiredSkills.join(" ")}`.toLowerCase().includes(q))
          return false;
        if (workModel !== "todos" && job.workModel !== workModel) return false;
        if (seniority !== "todos" && job.seniority !== seniority) return false;
        return match.score >= minMatch;
      })
      .sort((a, b) => b.match.score - a.match.score);
  }, [jobs, profile, query, workModel, seniority, minMatch]);

  return (
    <AppShell
      title="Encontrar vagas"
      description={`${results.length} vaga(s) compatíveis com os filtros atuais`}
      actions={
        <Button variant="outline" size="sm" onClick={() => setShowFilters((v) => !v)}>
          <SlidersHorizontal className="h-4 w-4" aria-hidden /> Filtros
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {showFilters && (
          <Card className="h-fit">
            <CardContent className="space-y-5 p-5">
              <div className="space-y-2">
                <Label htmlFor="q">Buscar</Label>
                <Input
                  id="q"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cargo, empresa ou tecnologia"
                />
              </div>
              <div className="space-y-2">
                <Label>Modelo de trabalho</Label>
                <Select value={workModel} onValueChange={setWorkModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="remoto">Remoto</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                    <SelectItem value="presencial">Presencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Senioridade</Label>
                <Select value={seniority} onValueChange={setSeniority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    <SelectItem value="estagio">Estágio</SelectItem>
                    <SelectItem value="junior">Júnior</SelectItem>
                    <SelectItem value="pleno">Pleno</SelectItem>
                    <SelectItem value="senior">Sênior</SelectItem>
                    <SelectItem value="especialista">Especialista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Match mínimo: {minMatch}%</Label>
                <Slider
                  value={[minMatch]}
                  onValueChange={([v]) => setMinMatch(v ?? 0)}
                  max={100}
                  step={5}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {results.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nenhuma vaga encontrada"
              description="Ajuste os filtros ou reduza o match mínimo para ver mais oportunidades."
            />
          ) : (
            results.map(({ job, match }) => <JobCard key={job.id} job={job} score={match.score} />)
          )}
        </div>
      </div>
    </AppShell>
  );
}
