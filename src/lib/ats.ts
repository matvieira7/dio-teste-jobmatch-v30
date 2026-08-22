import { calculateMatch, profileSkills, profileText, yearsOfExperience } from "./matching";
import { extractKeywords } from "./skills";
import type { AtsResult, Job, Profile } from "./types";

/** Estimativa de compatibilidade ATS — não é garantia de aprovação. */
export function analyzeResume(profile: Profile, job?: Job, summaryOverride?: string): AtsResult {
  const strengths: AtsResult["strengths"] = [];
  const improvements: AtsResult["improvements"] = [];
  const summary = summaryOverride ?? profile.summary;
  let score = 40;

  if (profile.personal.name && profile.personal.email && profile.personal.phone) {
    score += 8;
    strengths.push({
      label: "Dados de contato completos",
      detail: "Nome, e-mail e telefone estão presentes e são facilmente lidos por ATS.",
    });
  } else {
    improvements.push({
      label: "Contato incompleto",
      detail: "Inclua nome, e-mail e telefone no topo do currículo.",
    });
  }

  if (summary && summary.length >= 120) {
    score += 10;
    strengths.push({
      label: "Resumo profissional consistente",
      detail: "O resumo tem tamanho adequado e apresenta seu posicionamento.",
    });
  } else {
    improvements.push({
      label: "Resumo profissional curto ou genérico",
      detail: "Escreva de 3 a 4 linhas conectando sua experiência ao objetivo profissional.",
    });
  }

  if (profile.experiences.length > 0) {
    score += 10;
    strengths.push({
      label: "Experiência estruturada",
      detail: `${profile.experiences.length} experiência(s) com empresa, cargo e período.`,
    });
  } else {
    improvements.push({
      label: "Nenhuma experiência cadastrada",
      detail: "Essa informação não foi encontrada no seu perfil.",
    });
  }

  const withAchievements = profile.experiences.filter((e) => e.achievements.length > 0).length;
  if (profile.experiences.length && withAchievements === profile.experiences.length) {
    score += 8;
    strengths.push({
      label: "Resultados descritos",
      detail: "Todas as experiências apresentam conquistas ou resultados.",
    });
  } else if (profile.experiences.length) {
    improvements.push({
      label: "Experiências sem resultados mensuráveis",
      detail: `${profile.experiences.length - withAchievements} experiência(s) sem conquistas informadas.`,
    });
  }

  const skills = profileSkills(profile);
  if (skills.length >= 8) {
    score += 8;
    strengths.push({
      label: "Seção de competências rica",
      detail: `${skills.length} competências reconhecíveis por sistemas de triagem.`,
    });
  } else {
    improvements.push({
      label: "Poucas competências listadas",
      detail: "Liste tecnologias, ferramentas e idiomas em uma seção dedicada.",
    });
  }

  if (profile.education.length > 0) {
    score += 6;
    strengths.push({
      label: "Formação informada",
      detail: "Curso, instituição e período são reconhecidos pela maioria dos ATS.",
    });
  } else {
    improvements.push({
      label: "Formação ausente",
      detail: "Essa informação não foi encontrada no seu perfil.",
    });
  }

  let keywordCoverage = 0;
  if (job) {
    const match = calculateMatch(profile, job);
    const jobKeywords = Array.from(
      new Set([...job.keywords, ...extractKeywords(job.description, 12)]),
    );
    const text = `${profileText(profile)} ${summary}`.toLowerCase();
    const covered = jobKeywords.filter((k) => text.includes(k.toLowerCase()));
    keywordCoverage = Math.round((covered.length / Math.max(1, jobKeywords.length)) * 100);
    score += Math.round(keywordCoverage * 0.12);
    if (keywordCoverage >= 60) {
      strengths.push({
        label: "Boa cobertura de palavras-chave",
        detail: `${covered.length} de ${jobKeywords.length} termos desta vaga aparecem no currículo.`,
      });
    } else {
      improvements.push({
        label: "Poucas palavras-chave da vaga",
        detail: `Apenas ${covered.length} de ${jobKeywords.length} termos desta vaga aparecem no currículo.`,
      });
    }
    if (match.missingRequired.length) {
      improvements.push({
        label: "Requisitos obrigatórios ausentes",
        detail: match.missingRequired.join(", "),
      });
    }
  }

  const years = yearsOfExperience(profile);
  if (years > 0) score += 4;

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    strengths,
    improvements,
    keywordCoverage,
  };
}
