"use client";

import { useTranslations } from "next-intl";
import { useCompletedLessons, useSetLessonCompleted } from "@/presentation/contexts/StudyProgressContext";
import { Icon } from "../Icon";
import styles from "./LessonDoneButton.module.css";

type LessonDoneButtonProps = {
  studyId: string;
  lessonId: string;
  mode: "video" | "reading";
  className?: string;
};

/** Marca/desmarca a aula como vista no progresso do visitante. */
export function LessonDoneButton({ studyId, lessonId, mode, className }: LessonDoneButtonProps) {
  const t = useTranslations("Lesson.mark");
  const { ready, completed } = useCompletedLessons(studyId);
  const setLesson = useSetLessonCompleted();
  const done = completed.has(lessonId);

  return (
    <button
      type="button"
      className={`${styles.button} ${done ? styles.on : ""} ${className ?? ""}`}
      aria-pressed={done}
      disabled={!ready}
      onClick={() => setLesson(studyId, lessonId, !done)}
    >
      <span key={String(done)} className={styles.icon}>
        <Icon name={done ? "check" : "doc"} size={16} strokeWidth={done ? 2 : 1.6} />
      </span>
      {done ? t(mode === "reading" ? "readingDone" : "videoDone") : t(mode)}
    </button>
  );
}
