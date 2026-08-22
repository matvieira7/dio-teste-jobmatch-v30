import { extractKeywords, hasSkill, normalizeAll } from "./skills";
import type { Job, MatchResult, Profile, Seniority } from "./types";

const SENIORITY_ORDER: Seniority[] = ["estagio", "junior", "pleno", "senior", "especialista"];

export function profileSkills(profile: Profile): string[] {
  const s = profile.skills;
  return normalizeAll([
    ...s.hard,
    ...s.tools,
    ...s.languages,
    ...s.frameworks,
    ...s.databases,
    ...s.certifications,
    ...s.idioms,
    ...profile.projects.flatMap((p) => p.stack),
  ]);
}

export function yearsOfExperience(profile: Profile): number {
  const months = profile.experiences.reduce((acc, exp) => {
    const start = new Date(exp.startDate || Date.now());
    const end = exp.current || !exp.endDate ? new Date() : new Date(exp.endDate);
    const diff =
      (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return acc + Math.max(0, diff);
  }, 0);
  return Math.round((months / 12) * 10) / 10;
}

export function profileText(profile: Profile): string {
  return [
    profile.summary,
    profile.goal.targetRole,
    profile.goal.area,
    ...profile.experiences.flatMap((e) => [
      e.role,
      e.company,
      e.description,
      ...e.responsibilities,
      ...e.achievements,
    ]),
    ...profile.education.map((e) => `${e.course} ${e.institution} ${e.degree}`),
    ...profileSkills(profile),
  ]
    .filter(Boolean)
    .join(" ");
}

function pct(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateMatch(profile: Profile, job: Job): MatchResult {
  const skills = profileSkills(profile);
  const required = job.requiredSkills;
  const desired = job.desiredSkills;

  const matchedRequired = required.filter((r) => hasSkill(skills, r));
  const matchedDesired = desired.filter((r) => hasSkill(skills, r));
  const missingRequired = required.filter((r) => !hasSkill(skills, r));
  const missingDesired = desired.filter((r) => !hasSkill(skills, r));

  const skillScore = pct(
    (matchedRequired.length / Math.max(1, required.length)) * 80 +
      (matchedDesired.length / Math.max(1, desired.length)) * 20,
  );

  const years = yearsOfExperience(profile);
  const expScore = pct(
    job.experienceRequirements === 0 ? 100 : (years / job.experienceRequirements) * 100,
  );

  const hasDegree = profile.education.length > 0;
  const finished = profile.education.some((e) => !e.ongoing);
  const eduScore = hasDegree ? (finished ? 100 : 80) : 45;

  const profileIdx = SENIORITY_ORDER.indexOf(profile.goal.seniority);
  const jobIdx = SENIORITY_ORDER.indexOf(job.seniority);
  const senDiff = Math.abs(profileIdx - jobIdx);
  const seniorityScore = pct(100 - senDiff * 25);

  let locationScore = 60;
  if (job.workModel === "remoto") locationScore = 100;
  else if (profile.goal.workModel === job.workModel) locationScore = 90;
  const sameCity =
    profile.personal.city &&
    job.location.toLowerCase().includes(profile.personal.city.toLowerCase());
  if (sameCity) locationScore = 100;

  const text = profileText(profile).toLowerCase();
  const jobKeywords = Array.from(
    new Set([...job.keywords, ...extractKeywords(job.description, 14)]),
  );
  const matchedKeywords = jobKeywords.filter((k) => text.includes(k.toLowerCase()));
  const keywordScore = pct((matchedKeywords.length / Math.max(1, jobKeywords.length)) * 100);

  const breakdown = {
    skills: skillScore,
    experience: expScore,
    education: eduScore,
    seniority: seniorityScore,
    location: locationScore,
    keywords: keywordScore,
  };

  const score = pct(
    skillScore * 0.35 +
      expScore * 0.18 +
      eduScore * 0.08 +
      seniorityScore * 0.14 +
      locationScore * 0.1 +
      keywordScore * 0.15,
  );

  const totalRequirements = required.length + desired.length;
  const metRequirements = matchedRequired.length + matchedDesired.length;

  const reasons = [
    `Você possui ${matchedRequired.length} de ${required.length} competências obrigatórias da vaga.`,
    `Sua experiência estimada é de ${years} anos e a vaga pede cerca de ${job.experienceRequirements} anos.`,
    `Senioridade do seu objetivo (${profile.goal.seniority}) comparada à vaga (${job.seniority}).`,
    job.workModel === "remoto"
      ? "A vaga é remota, compatível com qualquer localização."
      : `A vaga é ${job.workModel} em ${job.location}.`,
    `${matchedKeywords.length} de ${jobKeywords.length} palavras-chave da descrição aparecem no seu perfil.`,
  ];

  return {
    score,
    breakdown,
    matchedSkills: [...matchedRequired, ...matchedDesired],
    missingRequired,
    missingDesired,
    reasons,
    totalRequirements,
    metRequirements,
  };
}

export interface JobAnalysis {
  required: string[];
  desired: string[];
  technologies: string[];
  softSkills: string[];
  experience: string;
  education: string;
  keywords: string[];
  responsibilities: string[];
}

const SOFT = [
  "comunicação",
  "liderança",
  "colaboração",
  "autonomia",
  "proatividade",
  "mentoria",
  "trabalho em equipe",
];

export function analyzeJob(job: Job): JobAnalysis {
  const all = [...job.requiredSkills, ...job.desiredSkills];
  const softSkills = all.filter((s) => SOFT.some((x) => s.toLowerCase().includes(x)));
  return {
    required: job.requiredSkills,
    desired: job.desiredSkills,
    technologies: all.filter((s) => !softSkills.includes(s)),
    softSkills: softSkills.length ? softSkills : ["Colaboração", "Comunicação"],
    experience: `${job.experienceRequirements} ano(s) de experiência`,
    education: job.educationRequirements,
    keywords: Array.from(new Set([...job.keywords, ...extractKeywords(job.description, 12)])),
    responsibilities: job.responsibilities,
  };
}
