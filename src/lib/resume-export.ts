import type { Profile, ResumeVersion } from "./types";

export interface ResumeDoc {
  title: string;
  summary: string;
  highlightedSkills: string[];
}

function section(title: string, body: string) {
  return body.trim() ? `${title.toUpperCase()}\n${body.trim()}\n\n` : "";
}

/** Texto plano no formato ATS Friendly: sem colunas, sem gráficos, títulos padronizados. */
export function buildAtsText(profile: Profile, doc: ResumeDoc): string {
  const p = profile.personal;
  const contact = [p.email, p.phone, [p.city, p.state, p.country].filter(Boolean).join(", "), p.linkedin, p.github, p.portfolio]
    .filter(Boolean)
    .join(" | ");

  const experiences = profile.experiences
    .map((e) => {
      const period = `${e.startDate || "-"} a ${e.current ? "Atual" : e.endDate || "-"}`;
      const bullets = [...e.responsibilities, ...e.achievements]
        .map((b) => `- ${b}`)
        .join("\n");
      return `${e.role} | ${e.company} | ${e.location || "-"} | ${period}\n${e.description}\n${bullets}`.trim();
    })
    .join("\n\n");

  const education = profile.education
    .map(
      (e) =>
        `${e.degree} em ${e.course} | ${e.institution} | ${e.startDate} a ${e.ongoing ? "Em andamento" : e.endDate || "-"}`,
    )
    .join("\n");

  const s = profile.skills;
  const skills = [
    s.hard.length && `Técnicas: ${s.hard.join(", ")}`,
    s.frameworks.length && `Frameworks: ${s.frameworks.join(", ")}`,
    s.languages.length && `Linguagens: ${s.languages.join(", ")}`,
    s.databases.length && `Bancos de dados: ${s.databases.join(", ")}`,
    s.tools.length && `Ferramentas: ${s.tools.join(", ")}`,
    s.soft.length && `Comportamentais: ${s.soft.join(", ")}`,
    s.idioms.length && `Idiomas: ${s.idioms.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  const projects = profile.projects
    .map((pr) => `${pr.name}${pr.link ? ` (${pr.link})` : ""}\n${pr.description}\n${pr.stack.join(", ")}`)
    .join("\n\n");

  return (
    `${p.name || "Currículo"}\n${doc.title}\n${contact}\n\n` +
    section("Resumo profissional", doc.summary) +
    section("Competências", skills) +
    section("Experiência profissional", experiences) +
    section("Formação acadêmica", education) +
    section("Certificações", profile.skills.certifications.join("\n")) +
    section("Projetos", projects)
  );
}

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportDocx(profile: Profile, doc: ResumeDoc) {
  const text = buildAtsText(profile, doc);
  const html = `<!DOCTYPE html><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${doc.title}</title></head><body style="font-family:Arial,sans-serif;font-size:11pt;white-space:pre-wrap">${text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")}</body></html>`;
  download(html, `${slug(profile.personal.name || "curriculo")}-${slug(doc.title)}.docx`, "application/msword");
}

export function exportTxt(profile: Profile, doc: ResumeDoc) {
  download(
    buildAtsText(profile, doc),
    `${slug(profile.personal.name || "curriculo")}-${slug(doc.title)}.txt`,
    "text/plain;charset=utf-8",
  );
}

/** PDF via janela de impressão do navegador com layout ATS simples. */
export function exportPdf(profile: Profile, doc: ResumeDoc) {
  const text = buildAtsText(profile, doc);
  const win = window.open("", "_blank", "width=820,height=1000");
  if (!win) return;
  win.document.write(
    `<html><head><title>${escapeHtml(doc.title)}</title><style>
      body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;line-height:1.5;color:#111;padding:48px;white-space:pre-wrap}
    </style></head><body>${escapeHtml(text)}</body></html>`,
  );
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 350);
}

function escapeHtml(v: string) {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function slug(v: string) {
  return v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

export function versionDoc(version: ResumeVersion): ResumeDoc {
  return {
    title: version.name,
    summary: version.summary,
    highlightedSkills: version.highlightedSkills,
  };
}
