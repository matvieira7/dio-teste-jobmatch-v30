/**
 * Camada de abstração de "inteligência".
 * Implementação atual é determinística e local (sem provedor externo),
 * mas a interface permite trocar por um provedor de IA no futuro.
 * Regra fundamental: nunca fabricar informações que não existam no perfil.
 */
import { analyzeResume } from "./ats";
import { analyzeJob, calculateMatch, profileSkills, yearsOfExperience } from "./matching";
import { extractKeywords, hasSkill, normalizeSkill } from "./skills";
import type { AtsResult, Job, MatchResult, Profile } from "./types";

export interface OptimizedResume {
  summary: string;
  highlightedSkills: string[];
  addedKeywords: string[];
  experienceOrder: string[];
  notes: string[];
  missingInfo: string[];
}

function relevanceOfExperience(text: string, terms: string[]): number {
  const lower = text.toLowerCase();
  return terms.reduce((acc, t) => (lower.includes(t.toLowerCase()) ? acc + 1 : acc), 0);
}

export const AIService = {
  analyzeResume(profile: Profile, job?: Job): AtsResult {
    return analyzeResume(profile, job);
  },

  analyzeJob(job: Job) {
    return analyzeJob(job);
  },

  calculateMatch(profile: Profile, job: Job): MatchResult {
    return calculateMatch(profile, job);
  },

  extractKeywords(text: string, limit?: number): string[] {
    return extractKeywords(text, limit);
  },

  generateProfessionalSummary(profile: Profile, job?: Job): string {
    const years = yearsOfExperience(profile);
    const role = profile.goal.targetRole || profile.experiences[0]?.role || "profissional";
    const skills = profileSkills(profile);
    const focus = job
      ? job.requiredSkills.filter((s) => hasSkill(skills, s)).slice(0, 5)
      : skills.slice(0, 5);
    const companies = profile.experiences.slice(0, 2).map((e) => e.company);

    const parts = [
      `${role}${years > 0 ? ` com ${years} ano(s) de experiência` : ""}${
        profile.goal.area ? ` na área de ${profile.goal.area}` : ""
      }.`,
      focus.length ? `Atuação com ${focus.join(", ")}.` : "",
      companies.length ? `Experiência construída em ${companies.join(" e ")}.` : "",
      job
        ? `Interesse na posição de ${job.title}, alinhando prática já exercida às necessidades da vaga.`
        : profile.goal.workModel
          ? `Busca oportunidades em modelo ${profile.goal.workModel}.`
          : "",
    ];
    return parts.filter(Boolean).join(" ");
  },

  optimizeResume(profile: Profile, job: Job): OptimizedResume {
    const match = calculateMatch(profile, job);
    const skills = profileSkills(profile);
    const terms = [...job.requiredSkills, ...job.desiredSkills, ...job.keywords];

    const experienceOrder = [...profile.experiences]
      .sort(
        (a, b) =>
          relevanceOfExperience(
            `${b.role} ${b.description} ${b.responsibilities.join(" ")} ${b.achievements.join(" ")}`,
            terms,
          ) -
          relevanceOfExperience(
            `${a.role} ${a.description} ${a.responsibilities.join(" ")} ${a.achievements.join(" ")}`,
            terms,
          ),
      )
      .map((e) => e.id);

    const highlightedSkills = Array.from(
      new Set(
        [...job.requiredSkills, ...job.desiredSkills].filter((s) => hasSkill(skills, s)),
      ),
    );

    const addedKeywords = Array.from(
      new Set(
        job.keywords.filter((k) =>
          skills.some((s) => normalizeSkill(s).includes(normalizeSkill(k))),
        ),
      ),
    );

    const missingInfo: string[] = [];
    if (!profile.experiences.some((e) => e.achievements.length))
      missingInfo.push("Resultados/conquistas não foram encontrados no seu perfil.");
    if (!profile.education.length)
      missingInfo.push("Formação acadêmica não foi encontrada no seu perfil.");
    if (match.missingRequired.length)
      missingInfo.push(
        `Requisitos que você não informou: ${match.missingRequired.join(", ")}. Nada foi adicionado automaticamente.`,
      );

    const notes = [
      "Resumo profissional reescrito com foco nesta vaga, usando apenas dados do seu perfil.",
      "Experiências reordenadas por relevância para os requisitos da vaga.",
      highlightedSkills.length
        ? `Competências destacadas: ${highlightedSkills.join(", ")}.`
        : "Nenhuma competência do seu perfil corresponde diretamente aos requisitos.",
      "Nenhuma experiência, tecnologia ou certificação foi inventada.",
    ];

    return {
      summary: AIService.generateProfessionalSummary(profile, job),
      highlightedSkills,
      addedKeywords,
      experienceOrder,
      notes,
      missingInfo,
    };
  },
};
