"use client";

import { useState, type ReactNode } from "react";
import { StudyProgressProvider } from "@/presentation/contexts/StudyProgressContext";
import {
  makeGetStudyProgress,
  makeSetLessonCompleted,
  makeWatchStudyProgress,
} from "../factories/use-cases/study-progress";

/** Composição no cliente: liga os casos de uso de progresso (localStorage) ao contexto da apresentação. */
export function AppStudyProgressProvider({ children }: { children: ReactNode }) {
  const [useCases] = useState(() => ({
    getProgress: makeGetStudyProgress(),
    setLesson: makeSetLessonCompleted(),
    watch: makeWatchStudyProgress(),
  }));
  return <StudyProgressProvider {...useCases}>{children}</StudyProgressProvider>;
}
