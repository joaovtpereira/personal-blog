/** Formato externo do currículo (markdown/API), um documento por idioma. Não usar na apresentação. */
export type ResumeModel = {
  locale: string;
  location: string;
  summary: string;
  career_start_year: number;
  platforms: string[];
  companies_count: number;
  stack: string[];
  experiences: {
    id: string;
    role: string;
    organization: string;
    description: string;
    /** "AAAA" ou "AAAA-MM" */
    start: string;
    /** "AAAA", "AAAA-MM" ou null (atual) */
    end: string | null;
  }[];
  education: {
    id: string;
    degree: string;
    institution: string;
    institution_short: string;
    start_year: number;
    end_year: number | null;
    thesis?: { title: string; summary: string; year: number; url: string } | null;
  }[];
  skills: { id: string; label: string; items: string[] }[];
  languages: { code: string; level: "nativo" | "avancado" | "intermediario" | "basico-intermediario" | "basico" }[];
  current_company?: { name: string; role: string; url: string } | null;
  pdf_url?: string | null;
};
