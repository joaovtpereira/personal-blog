"use client";

import { useMemo } from "react";
import {
  collectionProgress,
  lessonToResume,
  type Collection,
  type CollectionEntry,
  type CollectionProgress,
  type EntryProgress,
  type StudyProgress,
} from "@/domain/entities";
import { ROUTES } from "@/main/routes";
import { useStudyProgressMap } from "@/presentation/contexts/StudyProgressContext";

export type CollectionProgressView = CollectionProgress & {
  /** Há acompanhamento de progresso para este tipo de coleção? */
  tracked: boolean;
  ready: boolean;
};

const studyState = (entry: CollectionEntry, progress: StudyProgress | undefined): EntryProgress => {
  if (entry.ref?.type !== "study" || !progress) return "todo";
  const done = new Set(progress.completedLessonIds);
  const seen = entry.ref.lessons.filter((lesson) => done.has(lesson.id)).length;
  if (seen === 0) return "todo";
  return seen >= entry.ref.lessons.length ? "done" : "started";
};

/** Progresso do visitante na coleção: estudos usam as aulas vistas; resenhas ainda não têm acompanhamento. */
export function useCollectionProgress(collection: Collection): CollectionProgressView {
  const { ready, byStudy } = useStudyProgressMap();
  return useMemo(() => {
    const tracked = collection.kind === "studies";
    const progress = collectionProgress(collection, (entry) =>
      tracked && entry.ref ? studyState(entry, byStudy.get(entry.ref.id)) : "todo",
    );
    return { ...progress, tracked, ready };
  }, [collection, byStudy, ready]);
}

/** Link de um item: estudos abrem na aula para continuar (se houver), resenhas no post. */
export function useEntryHref() {
  const { byStudy } = useStudyProgressMap();
  return (entry: CollectionEntry): string | null => {
    if (!entry.ref) return null;
    if (entry.ref.type === "post") return ROUTES.post(entry.ref.slug);
    const resume = lessonToResume(entry.ref.lessons, byStudy.get(entry.ref.id));
    return resume ? ROUTES.lesson(entry.ref.slug, resume.slug) : ROUTES.study(entry.ref.slug);
  };
}
