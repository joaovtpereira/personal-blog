"use client";

import { useTranslations } from "next-intl";
import { lessonToResume, type LessonSummary, type Study } from "@/domain/entities";
import { Link } from "@/main/i18n/navigation";
import { ROUTES } from "@/main/routes";
import { useRawStudyProgress, useStudyProgress } from "@/presentation/contexts/StudyProgressContext";
import { ProgressBar } from "../ProgressBar";
import styles from "./StudyProgressMeter.module.css";

type StudyProgressMeterProps = {
  study: Study;
  lessons: LessonSummary[];
  currentLessonId: string;
  mode: "video" | "reading";
  /** Ex.: " · 32 MIN NO TOTAL" no modo leitura. */
  suffix?: string;
};

/**
 * "03 DE 08 CONCLUÍDAS · 37%" com barra. Se o visitante já começou e está numa aula vista,
 * oferece continuar da primeira aula que ainda falta.
 */
export function StudyProgressMeter({ study, lessons, currentLessonId, mode, suffix = "" }: StudyProgressMeterProps) {
  const t = useTranslations("Lesson");
  const progress = useStudyProgress(study);
  const raw = useRawStudyProgress(study.id);
  const resume = lessonToResume(lessons, raw);
  const pad = (n: number) => String(n).padStart(2, "0");
  const label = t(mode === "reading" ? "progressReading" : "progressVideo", { done: pad(progress.done), total: pad(progress.total) });
  const showResume = resume && resume.id !== currentLessonId && raw?.completedLessonIds.includes(currentLessonId);

  return (
    <div className={styles.meter}>
      <div className={`mono ${styles.row}`}>
        <span>
          {label}
          {suffix}
        </span>
        <span>{progress.status === "completed" ? t("completed").toUpperCase() : `${Math.round(progress.ratio * 100)}%`}</span>
      </div>
      <div className={styles.bar}>
        <ProgressBar key={progress.ready ? "ready" : "loading"} value={progress.ratio} label={label} />
      </div>
      {showResume && (
        <Link href={ROUTES.lesson(study.slug, resume.slug)} className={`ul ${styles.resume}`}>
          {t("resume", { number: pad(resume.number) })} →
        </Link>
      )}
    </div>
  );
}
