import type { Locale, StudyLessonPage } from "../entities";

export type GetStudyLessonParams = {
  locale: Locale;
  studySlug: string;
  /** Sem slug = primeira aula do estudo. */
  lessonSlug?: string;
};

export interface GetStudyLesson {
  /** null quando o estudo ou a aula não existem nesse idioma. */
  execute(params: GetStudyLessonParams): Promise<StudyLessonPage | null>;
}

export type StudyLessonRoute = { locale: Locale; studySlug: string; lessonSlug: string };

/** Todas as rotas de aula (geração estática). */
export interface GetStudyLessonRoutes {
  execute(): Promise<StudyLessonRoute[]>;
}
