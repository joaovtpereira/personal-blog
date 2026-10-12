import type { LanguageLevel, Resume, ResumeDate } from "@/domain/entities";
import type { ResumeMapper } from "@/domain/mappers";
import type { ResumeModel } from "@/domain/models";
import { toLocale } from "./locale";

type ModelLevel = ResumeModel["languages"][number]["level"];

const LEVEL_BY_MODEL: Record<ModelLevel, LanguageLevel> = {
  nativo: "native",
  avancado: "advanced",
  intermediario: "intermediate",
  "basico-intermediario": "basicIntermediate",
  basico: "basic",
};

const MODEL_BY_LEVEL = Object.fromEntries(
  Object.entries(LEVEL_BY_MODEL).map(([model, level]) => [level, model]),
) as Record<LanguageLevel, ModelLevel>;

const toDate = (value: string): ResumeDate => {
  const [year, month] = value.split("-").map(Number);
  return { year, month: month ? month : null };
};

const fromDate = (date: ResumeDate): string =>
  date.month ? `${date.year}-${String(date.month).padStart(2, "0")}` : String(date.year);

const toDisplayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export class ResumeModelMapper implements ResumeMapper {
  toEntity(model: ResumeModel): Resume {
    return {
      locale: toLocale(model.locale),
      location: model.location,
      summary: model.summary,
      careerStartYear: model.career_start_year,
      platforms: [...model.platforms],
      companiesCount: model.companies_count,
      stack: [...model.stack],
      experiences: model.experiences.map((experience) => ({
        id: experience.id,
        role: experience.role,
        organization: experience.organization,
        description: experience.description,
        start: toDate(experience.start),
        end: experience.end ? toDate(experience.end) : null,
      })),
      education: model.education.map((education) => ({
        id: education.id,
        degree: education.degree,
        institution: education.institution,
        institutionShort: education.institution_short,
        startYear: education.start_year,
        endYear: education.end_year,
        thesis: education.thesis ? { ...education.thesis } : null,
      })),
      skills: model.skills.map((group) => ({ id: group.id, label: group.label, items: [...group.items] })),
      languages: model.languages.map((language) => ({ code: language.code, level: LEVEL_BY_MODEL[language.level] })),
      currentCompany: model.current_company
        ? { ...model.current_company, displayUrl: toDisplayUrl(model.current_company.url) }
        : null,
      pdfUrl: model.pdf_url ?? null,
    };
  }

  toModel(entity: Resume): ResumeModel {
    return {
      locale: entity.locale,
      location: entity.location,
      summary: entity.summary,
      career_start_year: entity.careerStartYear,
      platforms: [...entity.platforms],
      companies_count: entity.companiesCount,
      stack: [...entity.stack],
      experiences: entity.experiences.map((experience) => ({
        id: experience.id,
        role: experience.role,
        organization: experience.organization,
        description: experience.description,
        start: fromDate(experience.start),
        end: experience.end ? fromDate(experience.end) : null,
      })),
      education: entity.education.map((education) => ({
        id: education.id,
        degree: education.degree,
        institution: education.institution,
        institution_short: education.institutionShort,
        start_year: education.startYear,
        end_year: education.endYear,
        thesis: education.thesis ? { ...education.thesis } : null,
      })),
      skills: entity.skills.map((group) => ({ id: group.id, label: group.label, items: [...group.items] })),
      languages: entity.languages.map((language) => ({ code: language.code, level: MODEL_BY_LEVEL[language.level] })),
      current_company: entity.currentCompany
        ? { name: entity.currentCompany.name, role: entity.currentCompany.role, url: entity.currentCompany.url }
        : null,
      pdf_url: entity.pdfUrl,
    };
  }
}
