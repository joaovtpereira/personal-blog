/** Formato externo (markdown/API). Não usar na camada de apresentação. */
export type StudyLessonModel = {
  id: string;
  format: "video" | "texto";
};

export type StudyModel = {
  id: string;
  slug: string;
  locale: string;
  title: string;
  description: string;
  tags: string[];
  lessons: StudyLessonModel[];
  /** Ordem de exibição na trilha de estudos (1 = primeiro). */
  order: number;
};
