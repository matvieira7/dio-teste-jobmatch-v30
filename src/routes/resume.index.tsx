import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, RefreshCw, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ScoreBar, ScoreRing } from "@/components/common/score";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AIService } from "@/lib/ai-service";
import { buildAtsText, exportDocx, exportPdf, exportTxt } from "@/lib/resume-export";
import { applyParsedResume, parseResumeText, readResumeFile } from "@/lib/resume-parser";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/resume/")({
  validateSearch: (search: Record<string, unknown>): { import?: boolean } =>
    search["import"] === true || search["import"] === "true" ? { import: true } : {},

  head: () => ({
    meta: [
      { title: "Meu currículo ATS — VagaMatch" },
      {
        name: "description",
        content:
          "Gere, revise e exporte um currículo ATS Friendly em PDF, DOCX ou TXT usando apenas os dados do seu perfil.",
      },
      { property: "og:title", content: "Meu currículo ATS — VagaMatch" },
      {
        property: "og:description",
        content: "Currículo otimizado para sistemas de triagem, sem inventar informações.",
      },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  const { profile, setProfile } = useStore();
  const [summary, setSummary] = useState(profile.summary);
  const fileRef = useRef<HTMLInputElement>(null);

  const ats = useMemo(() => AIService.analyzeResume(profile), [profile]);
  const doc = {
    title: profile.goal.targetRole || "Currículo",
    summary: summary || profile.summary,
    highlightedSkills: profile.skills.hard.slice(0, 12),
  };
  const preview = useMemo(() => buildAtsText(profile, doc), [profile, doc]);

  const handleUpload = async (file: File) => {
    try {
      const text = await readResumeFile(file);
      const parsed = parseResumeText(text);
      setProfile((p) => applyParsedResume(p, parsed));
      toast.success("Currículo importado. Revise os dados extraídos.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao ler o arquivo.");
    }
  };

  return (
    <AppShell
      title="Meu currículo"
      description="Formato ATS Friendly gerado a partir do seu perfil"
      actions={
        <>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleUpload(f);
              e.target.value = "";
            }}
          />
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" aria-hidden /> Importar
          </Button>
          <Button size="sm" onClick={() => exportPdf(profile, doc)}>
            <Download className="h-4 w-4" aria-hidden /> PDF
          </Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-3">
              <CardTitle className="text-base">Resumo profissional</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const generated = AIService.generateProfessionalSummary(profile);
                  setSummary(generated);
                  setProfile((p) => ({ ...p, summary: generated }));
                  toast.success("Resumo gerado apenas com dados do seu perfil.");
                }}
              >
                <RefreshCw className="h-4 w-4" aria-hidden /> Gerar
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label htmlFor="summary" className="sr-only">
                Resumo profissional
              </Label>
              <Textarea
                id="summary"
                rows={5}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                onBlur={() => setProfile((p) => ({ ...p, summary }))}
                placeholder="Escreva ou gere um resumo com base na sua experiência real."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pré-visualização ATS</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-4 text-xs leading-relaxed text-foreground">
                {preview}
              </pre>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => exportDocx(profile, doc)}>
                  <Download className="h-4 w-4" aria-hidden /> DOCX
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportTxt(profile, doc)}>
                  <Download className="h-4 w-4" aria-hidden /> TXT
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4 p-5">
              <ScoreRing value={ats.score} label="Score ATS" />
              <ScoreBar label="Cobertura de palavras-chave" value={ats.keywordCoverage} />
              <p className="text-xs text-muted-foreground">
                Estimativa baseada em estrutura e conteúdo. Nenhum dado é inventado.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pontos fortes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ats.strengths.length ? (
                ats.strengths.map((s) => (
                  <div key={s.label}>
                    <Badge variant="secondary">{s.label}</Badge>
                    <p className="mt-1 text-xs text-muted-foreground">{s.detail}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Complete seu perfil para identificar pontos fortes.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" aria-hidden /> Melhorias sugeridas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ats.improvements.length ? (
                ats.improvements.map((s) => (
                  <div key={s.label}>
                    <Badge variant="outline">{s.label}</Badge>
                    <p className="mt-1 text-xs text-muted-foreground">{s.detail}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Seu currículo está bem estruturado.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
