import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Configurações — VagaMatch" },
      {
        name: "description",
        content:
          "Ajuste alertas de match, formato do currículo, privacidade e gerencie os dados salvos neste navegador.",
      },
      { property: "og:title", content: "Configurações — VagaMatch" },
      { property: "og:description", content: "Preferências de alertas, currículo e privacidade." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, updateSettings, resetAll } = useStore();
  const navigate = useNavigate();

  const toggles = [
    { key: "emailAlerts", label: "Alertas por e-mail", hint: "Resumo semanal de novas vagas." },
    { key: "matchAlerts", label: "Alertas de match alto", hint: "Avisar quando surgir match acima de 80%." },
    { key: "analytics", label: "Métricas de uso", hint: "Ajuda a melhorar as recomendações." },
    { key: "compactResume", label: "Currículo compacto", hint: "Prioriza uma página no PDF exportado." },
  ] as const;

  return (
    <AppShell title="Configurações" description="Preferências desta sessão local">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preferências</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {toggles.map((t) => (
              <div key={t.key} className="flex items-start justify-between gap-4">
                <div>
                  <Label htmlFor={t.key}>{t.label}</Label>
                  <p className="text-xs text-muted-foreground">{t.hint}</p>
                </div>
                <Switch
                  id={t.key}
                  checked={settings[t.key]}
                  onCheckedChange={(v) => updateSettings({ [t.key]: v })}
                />
              </div>
            ))}
            <div>
              <Label>Match mínimo para recomendações: {settings.minMatch}%</Label>
              <Slider
                className="mt-3"
                value={[settings.minMatch]}
                onValueChange={([v]) => updateSettings({ minMatch: v ?? 0 })}
                max={100}
                step={5}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Seus dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tudo é armazenado apenas neste navegador. Nenhuma informação é enviada para servidores.
            </p>
            <Button
              variant="destructive"
              onClick={() => {
                resetAll();
                toast.success("Todos os dados locais foram apagados.");
                void navigate({ to: "/" });
              }}
            >
              Apagar todos os dados
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
