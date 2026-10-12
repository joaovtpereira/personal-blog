import type { StudyProgress } from "../entities";

/** Lê o progresso do visitante em todos os estudos. */
export interface GetStudyProgress {
  execute(): Promise<StudyProgress[]>;
}

export type SetLessonCompletedParams = {
  studyId: string;
  lessonId: string;
  completed: boolean;
};

/** Marca ou desmarca uma aula como vista. Retorna o progresso atualizado do estudo. */
export interface SetLessonCompleted {
  execute(params: SetLessonCompletedParams): Promise<StudyProgress>;
}

/** Avisa quando o progresso muda (outra aba, outra tela). */
export interface WatchStudyProgress {
  subscribe(listener: () => void): () => void;
}
