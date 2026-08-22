import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import {
  EducationEditor,
  ExperienceEditor,
  GoalForm,
  PersonalForm,
  SkillsEditor,
} from "@/components/profile/editors";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { AIService } from "@/lib/ai-service";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Criar perfil — VagaMatch" },
      { name: "description", content: "Monte seu perfil profissional em poucos passos e comece a receber vagas compatíveis." },
      { property: "og:title", content: "Criar perfil — VagaMatch" },
      { property: "og:description", content: "Monte seu perfil profissional em poucos passos e comece a receber vagas compatíveis." },
    ],
  }),
  component: Onboarding,
});

const STEPS = [
  { title: "Informações pessoais", description: "Como as empresas vão te encontrar." },
  { title: "Objetivo profissional", description: "O que você procura na próxima oportunidade." },
  { title: "Formação", description: "Sua trajetória acadêmica." },
  { title: "Experiência profissional", description: "Onde você atuou e o que entregou." },
  { title: "Competências", description: "Tecnologias, ferramentas e idiomas." },
];

function Onboarding() {
  const { profile, setProfile } = useStore();
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const progress = Math.round(((step + 1) / STEPS.length) * 100);
  const current = STEPS[step]!;

  const canAdvance = step === 0 ? !!profile.personal.name && !!profile.personal.email : true;

  const finish = () => {
    setProfile((p) => ({
      ...p,
      summary: p.summary || AIService.generateProfessionalSummary(p),
      onboardingCompleted: true,
    }));
    toast.success("Perfil criado! Já estamos calculando seus matches.");
    void navigate({ to: "/dashboard" });
  };

  return (
    <AppShell
      title="Criar meu perfil"
      description="Nenhum cadastro necessário — tudo fica salvo neste navegador."
      actions={
        <Button variant="outline" size="sm" onClick={() => navigate({ to: "/resume", search: { import: true } })}>
          <Upload className="h-4 w-4" aria-hidden /> Importar currículo
        </Button>
      }
    >
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-brand-deep">
            Etapa {step + 1} de {STEPS.length}
          </span>
          <span className="text-muted-foreground">{progress}% concluído</span>
        </div>
        <Progress value={progress} className="mt-2 h-2" />
        <ol className="mt-4 hidden gap-2 sm:grid sm:grid-cols-5">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className={`rounded-lg border px-3 py-2 text-xs ${
                i === step
                  ? "border-primary bg-brand-soft font-medium text-brand-deep"
                  : i < step
                    ? "border-border bg-card text-muted-foreground"
                    : "border-dashed border-border text-muted-foreground"
              }`}
            >
              <span className="flex items-center gap-1.5">
                {i < step && <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden />}
                {s.title}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{current.title}</CardTitle>
          <CardDescription>{current.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 0 && (
            <PersonalForm
              value={profile.personal}
              onChange={(patch) => setProfile((p) => ({ ...p, personal: { ...p.personal, ...patch } }))}
            />
          )}
          {step === 1 && (
            <GoalForm
              value={profile.goal}
              onChange={(patch) => setProfile((p) => ({ ...p, goal: { ...p.goal, ...patch } }))}
            />
          )}
          {step === 2 && (
            <EducationEditor
              items={profile.education}
              onChange={(education) => setProfile((p) => ({ ...p, education }))}
            />
          )}
          {step === 3 && (
            <ExperienceEditor
              items={profile.experiences}
              onChange={(experiences) => setProfile((p) => ({ ...p, experiences }))}
            />
          )}
          {step === 4 && (
            <>
              <SkillsEditor
                value={profile.skills}
                onChange={(skills) => setProfile((p) => ({ ...p, skills }))}
              />
              <div className="space-y-1.5">
                <label htmlFor="summary" className="text-sm font-medium">
                  Resumo profissional
                </label>
                <Textarea
                  id="summary"
                  rows={4}
                  value={profile.summary}
                  placeholder="Escreva ou gere automaticamente a partir dos seus dados."
                  onChange={(e) => setProfile((p) => ({ ...p, summary: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setProfile((p) => ({ ...p, summary: AIService.generateProfessionalSummary(p) }))
                  }
                >
                  Gerar resumo com base no meu perfil
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canAdvance}>
            Continuar <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        ) : (
          <Button onClick={finish}>
            Concluir e ver meus matches <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        )}
      </div>
      {!canAdvance && (
        <p className="mt-2 text-right text-xs text-muted-foreground">
          Informe pelo menos nome e e-mail para continuar.
        </p>
      )}
    </AppShell>
  );
}
