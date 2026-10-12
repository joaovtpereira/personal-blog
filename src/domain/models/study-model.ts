/** Formato externo (markdown/API). Não usar na camada de apresentação. */
export type StudyLessonModel = {
  id: string;
  format: "video" | "texto";
  completed: boolean;
};

export type StudyModel = {
  id: string;
  slug: string;
  locale: string;
  title: string;
  tags: string[];
  lessons: StudyLessonModel[];
  updated_at: string;
};
