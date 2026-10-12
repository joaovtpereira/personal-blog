import type { ContentBlock } from "./content-block";
import type { VideoSource } from "./video-source";

export type LessonFormat = "video" | "text";

/** O que a lista de aulas e a navegação precisam saber de cada aula. */
export type LessonSummary = {
  id: string;
  slug: string;
  /** 1, 2, 3... na ordem da trilha */
  number: number;
  title: string;
  format: LessonFormat;
  durationSeconds: number | null;
  readingMinutes: number;
};

export type LessonMaterialKind = "pdf" | "link" | "file";

export type LessonMaterial = {
  id: string;
  title: string;
  kind: LessonMaterialKind;
  url: string;
};

/** Cartão-resumo de aulas em texto dentro de estudos com vídeo. */
export type LessonSummaryCard = {
  keyIdea: string;
  text: string;
};

export type Lesson = LessonSummary & {
  studyId: string;
  video: VideoSource | null;
  summary: LessonSummaryCard | null;
  /** Anotações (estudo com vídeo) ou o texto da aula (estudo só texto). */
  blocks: ContentBlock[];
  materials: LessonMaterial[];
};
