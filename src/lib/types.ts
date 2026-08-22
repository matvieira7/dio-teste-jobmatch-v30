export type WorkModel = "presencial" | "hibrido" | "remoto";
export type Seniority = "estagio" | "junior" | "pleno" | "senior" | "especialista";
export type EmploymentType = "clt" | "pj" | "estagio" | "temporario" | "freelance";

export interface PersonalInfo {
  name: string;
  photo?: string | undefined;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  linkedin?: string | undefined;
  github?: string | undefined;
  portfolio?: string | undefined;
}

export interface CareerGoal {
  targetRole: string;
  area: string;
  seniority: Seniority;
  workModel: WorkModel;
  desiredLocation: string;
  salaryExpectation?: number | undefined;
  availability: string;
}

export interface Education {
  id: string;
  course: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string | undefined;
  ongoing: boolean;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  employmentType: EmploymentType;
  location: string;
  startDate: string;
  endDate?: string | undefined;
  current: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
}

export interface Skills {
  hard: string[];
  soft: string[];
  tools: string[];
  languages: string[];
  frameworks: string[];
  databases: string[];
  certifications: string[];
  idioms: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link?: string | undefined;
  stack: string[];
}

export interface Profile {
  personal: PersonalInfo;
  goal: CareerGoal;
  education: Education[];
  experiences: Experience[];
  skills: Skills;
  projects: Project[];
  summary: string;
  onboardingCompleted: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  description: string;
  location: string;
  workModel: WorkModel;
  salaryMin?: number | undefined;
  salaryMax?: number | undefined;
  currency: string;
  seniority: Seniority;
  employmentType: EmploymentType;
  requiredSkills: string[];
  desiredSkills: string[];
  educationRequirements: string;
  experienceRequirements: number;
  responsibilities: string[];
  benefits: string[];
  keywords: string[];
  source: string;
  sourceUrl: string;
  publishedAt: string;
}

export interface MatchBreakdown {
  skills: number;
  experience: number;
  education: number;
  seniority: number;
  location: number;
  keywords: number;
}

export interface MatchResult {
  score: number;
  breakdown: MatchBreakdown;
  matchedSkills: string[];
  missingRequired: string[];
  missingDesired: string[];
  reasons: string[];
  totalRequirements: number;
  metRequirements: number;
}

export interface AtsIssue {
  label: string;
  detail: string;
}

export interface AtsResult {
  score: number;
  strengths: AtsIssue[];
  improvements: AtsIssue[];
  keywordCoverage: number;
}

export interface ResumeVersion {
  id: string;
  name: string;
  jobId?: string | undefined;
  jobTitle?: string | undefined;
  company?: string | undefined;
  createdAt: string;
  atsScore: number;
  matchScore: number;
  summary: string;
  highlightedSkills: string[];
  addedKeywords: string[];
  experienceOrder: string[];
  notes: string[];
}

export type ApplicationStatus =
  | "interessado"
  | "aplicado"
  | "entrevista"
  | "teste"
  | "oferta"
  | "rejeitado";

export interface Application {
  id: string;
  jobId: string;
  status: ApplicationStatus;
  createdAt: string;
  resumeVersionId?: string | undefined;
}

export interface Settings {
  emailAlerts: boolean;
  matchAlerts: boolean;
  analytics: boolean;
  compactResume: boolean;
  minMatch: number;
}
