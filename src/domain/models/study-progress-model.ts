/** Formato salvo no navegador do visitante. Não usar na camada de apresentação. */
export type StudyProgressModel = {
  study_id: string;
  completed_lessons: string[];
  updated_at: string;
};

/** Documento único guardado no cache. */
export type StudyProgressStoreModel = {
  version: 1;
  studies: StudyProgressModel[];
};
