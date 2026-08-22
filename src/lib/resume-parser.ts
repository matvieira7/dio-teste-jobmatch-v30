import type { Education, Experience, Profile } from "./types";

export interface ParsedResume {
  name?: string | undefined;
  email?: string | undefined;
  phone?: string | undefined;
  linkedin?: string | undefined;
  github?: string | undefined;
  summary?: string | undefined;
  skills: string[];
  experiences: Experience[];
  education: Education[];
}


const SKILL_DICTIONARY = [
  "JavaScript","TypeScript","React","Next.js","Node.js","Vue","Angular","Java","Spring","Python",
  "Django","Go","Rust","PHP","Laravel","C#",".NET","SQL","PostgreSQL","MySQL","MongoDB","Redis",
  "Docker","Kubernetes","AWS","Azure","Google Cloud","Terraform","CI/CD","Git","HTML","CSS",
  "Tailwind","Figma","Testes","Cypress","Jest","Kafka","GraphQL","API REST","React Native",
  "Power BI","Excel","Scrum","Kanban","Inglês","Espanhol","Liderança","Comunicação",
];

const id = () => Math.random().toString(36).slice(2, 10);

export function parseResumeText(text: string): ParsedResume {
  const clean = text.replace(/\r/g, "");
  const lines = clean
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const email = clean.match(/[\w.+-]+@[\w-]+\.[\w.]+/)?.[0];
  const phone = clean.match(/(\(?\d{2}\)?\s?)?9?\d{4}[-\s]?\d{4}/)?.[0];
  const linkedin = clean.match(/(https?:\/\/)?(www\.)?linkedin\.com\/[^\s,]+/i)?.[0];
  const github = clean.match(/(https?:\/\/)?(www\.)?github\.com\/[^\s,]+/i)?.[0];

  const name = lines.find(
    (l) => /^[A-ZÀ-Ú][a-zà-ú]+(\s+[A-ZÀ-Ú][a-zà-ú]+){1,3}$/.test(l) && l.length < 60,
  );

  const skills = SKILL_DICTIONARY.filter((s) =>
    new RegExp(`(^|[^a-z])${s.replace(/[.+*?^${}()|[\]\\]/g, "\\$&")}([^a-z]|$)`, "i").test(clean),
  );

  const summaryIdx = lines.findIndex((l) =>
    /^(resumo|perfil|sobre|objetivo|summary)/i.test(l),
  );
  const summary =
    summaryIdx >= 0
      ? lines
          .slice(summaryIdx + 1, summaryIdx + 4)
          .filter((l) => l.length > 30)
          .join(" ")
      : lines.find((l) => l.length > 90);

  const experiences: Experience[] = [];
  const expRegex = /^(.{3,60})\s+[-–|@]\s+(.{2,60})\s*\(?(\d{2}\/\d{4}|\d{4})\s*[-–]\s*(atual|presente|\d{2}\/\d{4}|\d{4})\)?/i;
  lines.forEach((line, i) => {
    const m = line.match(expRegex);
    if (m) {
      const role = m[1] ?? "";
      const company = m[2] ?? "";
      const start = m[3] ?? "";
      const end = m[4] ?? "";
      const current = /atual|presente/i.test(end);
      const next = lines[i + 1] ?? "";
      experiences.push({
        id: id(),
        role: role.trim(),
        company: company.trim(),
        employmentType: "clt",
        location: "",
        startDate: toIsoMonth(start),
        endDate: current ? undefined : toIsoMonth(end),
        current,
        description: next.length > 20 ? next : "",
        responsibilities: lines
          .slice(i + 1, i + 5)
          .filter((l) => /^[-•*]/.test(l))
          .map((l) => l.replace(/^[-•*]\s*/, "")),
        achievements: [],
      });
    }
  });

  const education: Education[] = [];
  lines.forEach((line) => {
    if (/(bacharelado|tecnólogo|tecnologo|licenciatura|graduação|graduacao|mba|pós|pos-graduação|ciência da computação|sistemas de informação|engenharia)/i.test(line)) {
      const years = line.match(/(\d{4})\D+(\d{4}|atual|cursando)/i);
      const parts = line.split(/[-–|,]/);
      const endYear = years?.[2] ?? "";
      const hasEnd = /\d{4}/.test(endYear);
      education.push({
        id: id(),
        course: (parts[0] ?? line).trim().slice(0, 80),
        institution: (parts[1] ?? "").trim().slice(0, 80),
        degree: /mba|pós|pos/i.test(line) ? "Pós-graduação" : "Graduação",
        startDate: years?.[1] ? `${years[1]}-01` : "",
        endDate: hasEnd ? `${endYear}-12` : undefined,
        ongoing: years ? !hasEnd : false,
      });
    }
  });


  return { name, email, phone, linkedin, github, summary, skills, experiences, education };
}

function toIsoMonth(value: string): string {
  if (/^\d{4}$/.test(value)) return `${value}-01`;
  const [m, y] = value.split("/");
  return y ? `${y}-${m}` : "";
}

export function applyParsedResume(profile: Profile, parsed: ParsedResume): Profile {
  return {
    ...profile,
    personal: {
      ...profile.personal,
      name: parsed.name ?? profile.personal.name,
      email: parsed.email ?? profile.personal.email,
      phone: parsed.phone ?? profile.personal.phone,
      linkedin: parsed.linkedin ?? profile.personal.linkedin,
      github: parsed.github ?? profile.personal.github,
    },
    summary: parsed.summary ?? profile.summary,
    skills: {
      ...profile.skills,
      hard: Array.from(new Set([...profile.skills.hard, ...parsed.skills])),
    },
    experiences: [...profile.experiences, ...parsed.experiences],
    education: [...profile.education, ...parsed.education],
  };
}

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_MIME = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export async function readResumeFile(file: File): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Arquivo maior que 5 MB.");
  const okType =
    ACCEPTED_MIME.includes(file.type) || /\.(pdf|docx|txt)$/i.test(file.name);
  if (!okType) throw new Error("Formato não suportado. Envie PDF, DOCX ou TXT.");

  const buffer = await file.arrayBuffer();
  const raw = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
  // Extração textual best-effort: mantém apenas trechos legíveis do binário.
  const readable = raw
    .replace(/[^\p{L}\p{N}\p{P}\p{Zs}\n]/gu, " ")
    .replace(/[ \t]{2,}/g, " ")
    .split("\n")
    .filter((l) => l.trim().length > 1)
    .join("\n");
  return readable;
}
