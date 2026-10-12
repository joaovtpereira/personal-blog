/** Coleção de estudos relacionados, em ordem. Não usar na apresentação. */
export type StudyCollectionModel = {
  id: string;
  slug: string;
  locale: string;
  name: string;
  study_ids: string[];
};
