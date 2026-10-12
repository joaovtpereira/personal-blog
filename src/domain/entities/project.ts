import type { Locale } from "./locale";

export type ProjectKind = "company" | "app";

export type Project = {
  id: string;
  locale: Locale;
  kind: ProjectKind;
  /** Parte do nome em Geist. */
  name: string;
  /** Parte final do nome em serif itálico (ex.: "Studio"). */
  nameAccent: string | null;
  description: string;
  url: string;
  displayUrl: string;
  platforms: string[];
  coverImage: string | null;
  iconImage: string | null;
};

export const projectFullName = (project: Project): string =>
  project.name + (project.nameAccent ?? "");
