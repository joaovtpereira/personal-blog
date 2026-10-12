import type { Lesson, LessonSummary } from "./lesson";
import type { Study } from "./study";
import type { StudyCollectionPosition } from "./study-collection";

/** Tudo que a tela de aula precisa: estudo, trilha de aulas, aula aberta e coleção. */
export type StudyLessonPage = {
  study: Study;
  lessons: LessonSummary[];
  lesson: Lesson;
  /** null quando o estudo não está em coleção (ou a coleção tem 1 item). */
  collection: StudyCollectionPosition | null;
};

export type StudyLayout = "video" | "reading";

/** Estudo sem nenhuma aula em vídeo abre no modo leitura (sumário + texto). */
export const studyLayout = (lessons: LessonSummary[]): StudyLayout =>
  lessons.some((lesson) => lesson.format === "video") ? "video" : "reading";

export const neighbours = (lessons: LessonSummary[], lessonId: string) => {
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  return {
    index,
    previous: index > 0 ? lessons[index - 1] : null,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null,
  };
};

export const totalReadingMinutes = (lessons: LessonSummary[]): number =>
  lessons.reduce((sum, lesson) => sum + lesson.readingMinutes, 0);
