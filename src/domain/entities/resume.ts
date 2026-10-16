import type { Locale } from "./locale";

/** Mês opcional: "2021" ou "2021-02". */
export type ResumeDate = { year: number; month: number | null };

export type ResumeExperience = {
  id: string;
  role: string;
  organization: string;
  description: string;
  start: ResumeDate;
  /** null = até hoje */
  end: ResumeDate | null;
};

export type ResumeThesis = {
  title: string;
  summary: string;
  year: number;
  url: string;
};

export type ResumeEducation = {
  id: string;
  degree: string;
  institution: string;
  institutionShort: string;
  startYear: number;
  endYear: number | null;
  thesis: ResumeThesis | null;
};

export type ResumeSkillGroup = {
  id: string;
  label: string;
  items: string[];
};

export type LanguageLevel = "native" | "advanced" | "intermediate" | "basicIntermediate" | "basic";

export type ResumeLanguage = {
  /** Código ISO do idioma falado (pt, en, es...). */
  code: string;
  level: LanguageLevel;
};

export type ResumeCompany = {
  name: string;
  role: string;
  url: string;
  displayUrl: string;
};

export type Resume = {
  locale: Locale;
  location: string;
  summary: string;
  careerStartYear: number;
  platforms: string[];
  companiesCount: number;
  stack: string[];
  experiences: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkillGroup[];
  languages: ResumeLanguage[];
  currentCompany: ResumeCompany | null;
  /** PDF para download; o botão só aparece quando existe. */
  pdfUrl: string | null;
};

export const isCurrentExperience = (experience: ResumeExperience): boolean => experience.end === null;

/** `currentYear` vem de fora: o domínio não lê o relógio (páginas prerenderizadas). */
export const yearsOfExperience = (resume: Resume, currentYear: number): number =>
  Math.max(0, currentYear - resume.careerStartYear);
