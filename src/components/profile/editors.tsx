import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  CareerGoal,
  Education,
  EmploymentType,
  Experience,
  PersonalInfo,
  Profile,
  Seniority,
  Skills,
  WorkModel,
} from "@/lib/types";

const uid = () => Math.random().toString(36).slice(2, 10);

export const SENIORITIES: { value: Seniority; label: string }[] = [
  { value: "estagio", label: "Estágio" },
  { value: "junior", label: "Júnior" },
  { value: "pleno", label: "Pleno" },
  { value: "senior", label: "Sênior" },
  { value: "especialista", label: "Especialista" },
];

export const WORK_MODELS: { value: WorkModel; label: string }[] = [
  { value: "presencial", label: "Presencial" },
  { value: "hibrido", label: "Híbrido" },
  { value: "remoto", label: "Remoto" },
];

export const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: "clt", label: "CLT" },
  { value: "pj", label: "PJ" },
  { value: "estagio", label: "Estágio" },
  { value: "temporario", label: "Temporário" },
  { value: "freelance", label: "Freelance" },
];

export function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function PersonalForm({
  value,
  onChange,
}: {
  value: PersonalInfo;
  onChange: (patch: Partial<PersonalInfo>) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Nome completo" htmlFor="name">
        <Input id="name" value={value.name} onChange={(e) => onChange({ name: e.target.value })} placeholder="Ana Souza" />
      </Field>
      <Field label="E-mail" htmlFor="email">
        <Input id="email" type="email" value={value.email} onChange={(e) => onChange({ email: e.target.value })} placeholder="ana@exemplo.com" />
      </Field>
      <Field label="Telefone" htmlFor="phone">
        <Input id="phone" value={value.phone} onChange={(e) => onChange({ phone: e.target.value })} placeholder="(11) 99999-0000" />
      </Field>
      <Field label="Foto (URL)" htmlFor="photo" hint="Opcional. Currículos ATS não exigem foto.">
        <Input id="photo" value={value.photo ?? ""} onChange={(e) => onChange({ photo: e.target.value })} />
      </Field>
      <Field label="Cidade" htmlFor="city">
        <Input id="city" value={value.city} onChange={(e) => onChange({ city: e.target.value })} />
      </Field>
      <Field label="Estado" htmlFor="state">
        <Input id="state" value={value.state} onChange={(e) => onChange({ state: e.target.value })} />
      </Field>
      <Field label="País" htmlFor="country">
        <Input id="country" value={value.country} onChange={(e) => onChange({ country: e.target.value })} />
      </Field>
      <Field label="LinkedIn" htmlFor="linkedin">
        <Input id="linkedin" value={value.linkedin ?? ""} onChange={(e) => onChange({ linkedin: e.target.value })} />
      </Field>
      <Field label="GitHub" htmlFor="github">
        <Input id="github" value={value.github ?? ""} onChange={(e) => onChange({ github: e.target.value })} />
      </Field>
      <Field label="Portfólio" htmlFor="portfolio">
        <Input id="portfolio" value={value.portfolio ?? ""} onChange={(e) => onChange({ portfolio: e.target.value })} />
      </Field>
    </div>
  );
}

export function GoalForm({
  value,
  onChange,
}: {
  value: CareerGoal;
  onChange: (patch: Partial<CareerGoal>) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Cargo desejado" htmlFor="targetRole">
        <Input id="targetRole" value={value.targetRole} onChange={(e) => onChange({ targetRole: e.target.value })} placeholder="Desenvolvedora Backend" />
      </Field>
      <Field label="Área" htmlFor="area">
        <Input id="area" value={value.area} onChange={(e) => onChange({ area: e.target.value })} placeholder="Tecnologia" />
      </Field>
      <Field label="Senioridade" htmlFor="seniority">
        <Select value={value.seniority} onValueChange={(v) => onChange({ seniority: v as Seniority })}>
          <SelectTrigger id="seniority"><SelectValue /></SelectTrigger>
          <SelectContent>
            {SENIORITIES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Modelo de trabalho" htmlFor="workModel">
        <Select value={value.workModel} onValueChange={(v) => onChange({ workModel: v as WorkModel })}>
          <SelectTrigger id="workModel"><SelectValue /></SelectTrigger>
          <SelectContent>
            {WORK_MODELS.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Localização desejada" htmlFor="desiredLocation">
        <Input id="desiredLocation" value={value.desiredLocation} onChange={(e) => onChange({ desiredLocation: e.target.value })} />
      </Field>
      <Field label="Pretensão salarial (R$)" htmlFor="salary">
        <Input
          id="salary"
          type="number"
          min={0}
          value={value.salaryExpectation ?? ""}
          onChange={(e) => onChange({ salaryExpectation: e.target.value ? Number(e.target.value) : undefined })}
        />
      </Field>
      <Field label="Disponibilidade" htmlFor="availability">
        <Input id="availability" value={value.availability} onChange={(e) => onChange({ availability: e.target.value })} placeholder="Imediata" />
      </Field>
    </div>
  );
}

export function EducationEditor({
  items,
  onChange,
}: {
  items: Education[];
  onChange: (items: Education[]) => void;
}) {
  const update = (id: string, patch: Partial<Education>) =>
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Curso" htmlFor={`course-${item.id}`}>
              <Input id={`course-${item.id}`} value={item.course} onChange={(e) => update(item.id, { course: e.target.value })} />
            </Field>
            <Field label="Instituição" htmlFor={`inst-${item.id}`}>
              <Input id={`inst-${item.id}`} value={item.institution} onChange={(e) => update(item.id, { institution: e.target.value })} />
            </Field>
            <Field label="Grau" htmlFor={`degree-${item.id}`}>
              <Input id={`degree-${item.id}`} value={item.degree} onChange={(e) => update(item.id, { degree: e.target.value })} placeholder="Bacharelado" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Início" htmlFor={`start-${item.id}`}>
                <Input id={`start-${item.id}`} type="month" value={item.startDate} onChange={(e) => update(item.id, { startDate: e.target.value })} />
              </Field>
              <Field label="Fim" htmlFor={`end-${item.id}`}>
                <Input id={`end-${item.id}`} type="month" disabled={item.ongoing} value={item.endDate ?? ""} onChange={(e) => update(item.id, { endDate: e.target.value })} />
              </Field>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id={`ongoing-${item.id}`} checked={item.ongoing} onCheckedChange={(c) => update(item.id, { ongoing: c === true })} />
              <Label htmlFor={`ongoing-${item.id}`} className="text-sm font-normal">Em andamento</Label>
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => onChange(items.filter((i) => i.id !== item.id))}>
                <Trash2 className="h-4 w-4" aria-hidden /> Remover
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() =>
          onChange([
            ...items,
            { id: uid(), course: "", institution: "", degree: "", startDate: "", ongoing: false },
          ])
        }
      >
        <Plus className="h-4 w-4" aria-hidden /> Adicionar formação
      </Button>
    </div>
  );
}

export function ExperienceEditor({
  items,
  onChange,
}: {
  items: Experience[];
  onChange: (items: Experience[]) => void;
}) {
  const update = (id: string, patch: Partial<Experience>) =>
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Empresa" htmlFor={`company-${item.id}`}>
              <Input id={`company-${item.id}`} value={item.company} onChange={(e) => update(item.id, { company: e.target.value })} />
            </Field>
            <Field label="Cargo" htmlFor={`role-${item.id}`}>
              <Input id={`role-${item.id}`} value={item.role} onChange={(e) => update(item.id, { role: e.target.value })} />
            </Field>
            <Field label="Tipo de contrato" htmlFor={`type-${item.id}`}>
              <Select value={item.employmentType} onValueChange={(v) => update(item.id, { employmentType: v as EmploymentType })}>
                <SelectTrigger id={`type-${item.id}`}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Localização" htmlFor={`loc-${item.id}`}>
              <Input id={`loc-${item.id}`} value={item.location} onChange={(e) => update(item.id, { location: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Início" htmlFor={`estart-${item.id}`}>
                <Input id={`estart-${item.id}`} type="month" value={item.startDate} onChange={(e) => update(item.id, { startDate: e.target.value })} />
              </Field>
              <Field label="Fim" htmlFor={`eend-${item.id}`}>
                <Input id={`eend-${item.id}`} type="month" disabled={item.current} value={item.endDate ?? ""} onChange={(e) => update(item.id, { endDate: e.target.value })} />
              </Field>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id={`current-${item.id}`} checked={item.current} onCheckedChange={(c) => update(item.id, { current: c === true })} />
              <Label htmlFor={`current-${item.id}`} className="text-sm font-normal">Emprego atual</Label>
            </div>
            <div className="sm:col-span-2">
              <Field label="Descrição" htmlFor={`desc-${item.id}`}>
                <Textarea id={`desc-${item.id}`} rows={2} value={item.description} onChange={(e) => update(item.id, { description: e.target.value })} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Principais responsabilidades" htmlFor={`resp-${item.id}`} hint="Uma por linha.">
                <Textarea
                  id={`resp-${item.id}`}
                  rows={3}
                  value={item.responsibilities.join("\n")}
                  onChange={(e) => update(item.id, { responsibilities: e.target.value.split("\n").filter(Boolean) })}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Resultados e conquistas" htmlFor={`ach-${item.id}`} hint="Uma por linha. Informe apenas resultados reais.">
                <Textarea
                  id={`ach-${item.id}`}
                  rows={3}
                  value={item.achievements.join("\n")}
                  onChange={(e) => update(item.id, { achievements: e.target.value.split("\n").filter(Boolean) })}
                />
              </Field>
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => onChange(items.filter((i) => i.id !== item.id))}>
                <Trash2 className="h-4 w-4" aria-hidden /> Remover
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() =>
          onChange([
            ...items,
            {
              id: uid(),
              company: "",
              role: "",
              employmentType: "clt",
              location: "",
              startDate: "",
              current: false,
              description: "",
              responsibilities: [],
              achievements: [],
            },
          ])
        }
      >
        <Plus className="h-4 w-4" aria-hidden /> Adicionar experiência
      </Button>
    </div>
  );
}

const SKILL_GROUPS: { key: keyof Skills; label: string; placeholder: string }[] = [
  { key: "hard", label: "Hard skills", placeholder: "Ex.: API REST" },
  { key: "soft", label: "Soft skills", placeholder: "Ex.: Comunicação" },
  { key: "tools", label: "Ferramentas", placeholder: "Ex.: Git" },
  { key: "languages", label: "Linguagens", placeholder: "Ex.: TypeScript" },
  { key: "frameworks", label: "Frameworks", placeholder: "Ex.: React" },
  { key: "databases", label: "Bancos de dados", placeholder: "Ex.: PostgreSQL" },
  { key: "certifications", label: "Certificações", placeholder: "Ex.: AWS Cloud Practitioner" },
  { key: "idioms", label: "Idiomas", placeholder: "Ex.: Inglês avançado" },
];

export function SkillsEditor({
  value,
  onChange,
}: {
  value: Skills;
  onChange: (skills: Skills) => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const add = (key: keyof Skills) => {
    const draft = (drafts[key] ?? "").trim();
    if (!draft) return;
    if (!value[key].includes(draft)) onChange({ ...value, [key]: [...value[key], draft] });
    setDrafts((d) => ({ ...d, [key]: "" }));
  };

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {SKILL_GROUPS.map((group) => (
        <div key={group.key} className="rounded-xl border border-border bg-card p-4">
          <Label htmlFor={`skill-${group.key}`}>{group.label}</Label>
          <div className="mt-2 flex gap-2">
            <Input
              id={`skill-${group.key}`}
              value={drafts[group.key] ?? ""}
              placeholder={group.placeholder}
              onChange={(e) => setDrafts((d) => ({ ...d, [group.key]: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  add(group.key);
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={() => add(group.key)} aria-label={`Adicionar em ${group.label}`}>
              <Plus className="h-4 w-4" aria-hidden />
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {value[group.key].length === 0 && (
              <p className="text-xs text-muted-foreground">Nenhum item adicionado ainda.</p>
            )}
            {value[group.key].map((item) => (
              <Badge key={item} variant="secondary" className="gap-1">
                {item}
                <button
                  type="button"
                  aria-label={`Remover ${item}`}
                  onClick={() => onChange({ ...value, [group.key]: value[group.key].filter((i) => i !== item) })}
                  className="rounded-full px-0.5 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function profileCompleteness(profile: Profile): number {
  const checks = [
    !!profile.personal.name,
    !!profile.personal.email,
    !!profile.goal.targetRole,
    profile.education.length > 0,
    profile.experiences.length > 0,
    profile.skills.hard.length + profile.skills.languages.length > 0,
    profile.summary.length > 60,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
