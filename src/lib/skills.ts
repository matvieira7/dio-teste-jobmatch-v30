/** Normalização e equivalência de competências (base para busca semântica futura). */

const ALIASES: Record<string, string> = {
  js: "javascript",
  "javascript es6": "javascript",
  ts: "typescript",
  "react.js": "react",
  reactjs: "react",
  "next.js": "nextjs",
  next: "nextjs",
  "node.js": "nodejs",
  node: "nodejs",
  "vue.js": "vue",
  postgres: "postgresql",
  "postgre sql": "postgresql",
  psql: "postgresql",
  mongo: "mongodb",
  "aws cloud": "aws",
  "amazon web services": "aws",
  gcp: "google cloud",
  k8s: "kubernetes",
  "rest": "api rest",
  "restful": "api rest",
  "apis rest": "api rest",
  "ci cd": "ci/cd",
  cicd: "ci/cd",
  "test unitario": "testes",
  "testes unitarios": "testes",
  jest: "testes",
  "spring boot": "spring",
  "c sharp": "c#",
  dotnet: ".net",
  "asp.net": ".net",
  "tailwind css": "tailwind",
  "styled components": "css",
  scss: "css",
  html5: "html",
  css3: "css",
  "english": "ingles",
  "inglês": "ingles",
};

export function normalizeSkill(raw: string): string {
  const base = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
  return ALIASES[base] ?? base;
}

export function normalizeAll(list: string[]): string[] {
  return Array.from(new Set(list.filter(Boolean).map(normalizeSkill)));
}

export function skillsEqual(a: string, b: string): boolean {
  const na = normalizeSkill(a);
  const nb = normalizeSkill(b);
  if (na === nb) return true;
  if (na.length > 3 && nb.length > 3 && (na.includes(nb) || nb.includes(na))) return true;
  return false;
}

export function hasSkill(pool: string[], target: string): boolean {
  return pool.some((s) => skillsEqual(s, target));
}

export function extractKeywords(text: string, limit = 24): string[] {
  const stop = new Set(
    "a o e de da do das dos para com em no na nos nas por que se um uma como ser ter sua seu the and for with you our will to of in on at is are as we".split(
      " ",
    ),
  );
  const counts = new Map<string, number>();
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9+#./]+/)
    .filter((w) => w.length > 2 && !stop.has(w) && !/^\d+$/.test(w))
    .forEach((w) => counts.set(w, (counts.get(w) ?? 0) + 1));
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
}
