import { totalLessons, type Study } from "./study";

/** Aulas que o visitante marcou como vistas em um estudo. */
export type StudyProgress = {
  studyId: string;
  completedLessonIds: string[];
  updatedAt: string;
};

export type StudyStatus = "notStarted" | "inProgress" | "completed";

export type StudyProgressSummary = {
  done: number;
  total: number;
  /** 0 a 1 */
  ratio: number;
  status: StudyStatus;
};

/** Cruza o progresso salvo com as aulas que existem hoje (aulas removidas não contam). */
export function summarizeProgress(study: Study, progress: StudyProgress | undefined): StudyProgressSummary {
  const total = totalLessons(study);
  const lessons = new Set(study.lessonIds);
  const done = progress ? progress.completedLessonIds.filter((id) => lessons.has(id)).length : 0;
  const status: StudyStatus = done === 0 ? "notStarted" : done >= total ? "completed" : "inProgress";
  return { done, total, ratio: total === 0 ? 0 : done / total, status };
}
