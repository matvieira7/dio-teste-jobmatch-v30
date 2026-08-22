import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import {
  EducationEditor,
  ExperienceEditor,
  GoalForm,
  PersonalForm,
  SkillsEditor,
  profileCompleteness,
} from "@/components/profile/editors";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Meu perfil profissional — VagaMatch" },
      {
        name: "description",
        content:
          "Edite dados pessoais, objetivo de carreira, experiências, formação e competências que alimentam o matchmaking.",
      },
      { property: "og:title", content: "Meu perfil profissional — VagaMatch" },
      {
        property: "og:description",
        content: "Mantenha seu perfil atualizado para melhorar a precisão dos matches.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, setProfile } = useStore();
  const completeness = profileCompleteness(profile);

  return (
    <AppShell
      title="Perfil"
      description="Estes dados alimentam o match e o currículo ATS"
      actions={
        <Button size="sm" onClick={() => toast.success("Perfil salvo neste navegador.")}>
          Salvar
        </Button>
      }
    >
      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium text-brand-deep">Completude do perfil</span>
            <span className="font-semibold tabular-nums">{completeness}%</span>
          </div>
          <Progress value={completeness} className="mt-2 h-2" />
        </CardContent>
      </Card>

      <Tabs defaultValue="personal">
        <TabsList className="flex-wrap">
          <TabsTrigger value="personal">Dados pessoais</TabsTrigger>
          <TabsTrigger value="goal">Objetivo</TabsTrigger>
          <TabsTrigger value="experience">Experiências</TabsTrigger>
          <TabsTrigger value="education">Formação</TabsTrigger>
          <TabsTrigger value="skills">Competências</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados pessoais</CardTitle>
            </CardHeader>
            <CardContent>
              <PersonalForm
                value={profile.personal}
                onChange={(patch) =>
                  setProfile((p) => ({ ...p, personal: { ...p.personal, ...patch } }))
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goal" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Objetivo profissional</CardTitle>
            </CardHeader>
            <CardContent>
              <GoalForm
                value={profile.goal}
                onChange={(patch) => setProfile((p) => ({ ...p, goal: { ...p.goal, ...patch } }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Experiências profissionais</CardTitle>
            </CardHeader>
            <CardContent>
              <ExperienceEditor
                items={profile.experiences}
                onChange={(items) => setProfile((p) => ({ ...p, experiences: items }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Formação acadêmica</CardTitle>
            </CardHeader>
            <CardContent>
              <EducationEditor
                items={profile.education}
                onChange={(items) => setProfile((p) => ({ ...p, education: items }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Competências</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillsEditor
                value={profile.skills}
                onChange={(skills) => setProfile((p) => ({ ...p, skills }))}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
