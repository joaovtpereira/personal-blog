"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { summarizeProgress, type Study, type StudyProgress, type StudyProgressSummary } from "@/domain/entities";
import type { GetStudyProgress, SetLessonCompleted, WatchStudyProgress } from "@/domain/use-cases";

type StudyProgressValue = {
  /** false até ler o navegador (no servidor e no 1º render tudo aparece como não iniciado). */
  ready: boolean;
  byStudy: Map<string, StudyProgress>;
  setLessonCompleted: (studyId: string, lessonId: string, completed: boolean) => Promise<void>;
};

const StudyProgressContext = createContext<StudyProgressValue | null>(null);

type StudyProgressProviderProps = {
  getProgress: GetStudyProgress;
  setLesson: SetLessonCompleted;
  watch: WatchStudyProgress;
  children: ReactNode;
};

/** Recebe os casos de uso por injeção (a composição fica em main/). */
export function StudyProgressProvider({ getProgress, setLesson, watch, children }: StudyProgressProviderProps) {
  const [list, setList] = useState<StudyProgress[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const load = () =>
      getProgress.execute().then((progress) => {
        if (!active) return;
        setList(progress);
        setReady(true);
      });
    load();
    const unsubscribe = watch.subscribe(load);
    return () => {
      active = false;
      unsubscribe();
    };
  }, [getProgress, watch]);

  const setLessonCompleted = useCallback(
    async (studyId: string, lessonId: string, completed: boolean) => {
      await setLesson.execute({ studyId, lessonId, completed });
    },
    [setLesson],
  );

  const value = useMemo(
    () => ({ ready, byStudy: new Map(list.map((item) => [item.studyId, item])), setLessonCompleted }),
    [ready, list, setLessonCompleted],
  );

  return <StudyProgressContext.Provider value={value}>{children}</StudyProgressContext.Provider>;
}

function useStudyProgressContext() {
  const context = useContext(StudyProgressContext);
  if (!context) throw new Error("useStudyProgress precisa estar dentro de <StudyProgressProvider>.");
  return context;
}

/** Resumo do progresso do visitante em um estudo. */
export function useStudyProgress(study: Study): StudyProgressSummary & { ready: boolean } {
  const { ready, byStudy } = useStudyProgressContext();
  return { ...summarizeProgress(study, byStudy.get(study.id)), ready };
}

/** Resumo de vários estudos de uma vez (filtros da listagem). */
export function useStudiesProgress(studies: Study[]): { ready: boolean; summaries: Map<string, StudyProgressSummary> } {
  const { ready, byStudy } = useStudyProgressContext();
  const summaries = useMemo(
    () => new Map(studies.map((study) => [study.id, summarizeProgress(study, byStudy.get(study.id))])),
    [studies, byStudy],
  );
  return { ready, summaries };
}

/** Ids das aulas que o visitante já concluiu num estudo. */
export function useCompletedLessons(studyId: string): { ready: boolean; completed: Set<string> } {
  const { ready, byStudy } = useStudyProgressContext();
  const progress = byStudy.get(studyId);
  const completed = useMemo(() => new Set(progress?.completedLessonIds ?? []), [progress]);
  return { ready, completed };
}

/** Progresso bruto de um estudo (para regras como "continuar de onde parou"). */
export function useRawStudyProgress(studyId: string): StudyProgress | undefined {
  return useStudyProgressContext().byStudy.get(studyId);
}

/** Progresso de todos os estudos (para telas que cruzam vários, como coleções). */
export function useStudyProgressMap(): { ready: boolean; byStudy: Map<string, StudyProgress> } {
  const { ready, byStudy } = useStudyProgressContext();
  return { ready, byStudy };
}

export function useSetLessonCompleted() {
  return useStudyProgressContext().setLessonCompleted;
}
