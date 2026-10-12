"use client";

import { useTranslations } from "next-intl";
import { formatDuration, type LessonSummary } from "@/domain/entities";
import { Link } from "@/main/i18n/navigation";
import { ROUTES } from "@/main/routes";
import { useCompletedLessons } from "@/presentation/contexts/StudyProgressContext";
import { Icon } from "../Icon";
import styles from "./LessonList.module.css";

type LessonListProps = {
  studyId: string;
  studySlug: string;
  lessons: LessonSummary[];
  currentId: string;
  /** video: ícone de formato à direita · reading: sumário só com texto */
  mode: "video" | "reading";
  label: string;
  size?: "m" | "s";
};

/** Trilha de aulas: número ou ✓ (visto pelo visitante), atual em superfície invertida. */
export function LessonList({ studyId, studySlug, lessons, currentId, mode, label, size = "m" }: LessonListProps) {
  const t = useTranslations("Lesson");
  const { completed } = useCompletedLessons(studyId);

  return (
    <nav aria-label={label}>
      <ol className={`${styles.list} ${styles[size]}`}>
        {lessons.map((lesson) => {
          const current = lesson.id === currentId;
          const done = completed.has(lesson.id);
          const duration = formatDuration(lesson.durationSeconds);
          const meta =
            lesson.format === "video"
              ? duration
                ? t("meta.video", { duration })
                : t("meta.videoNoDuration")
              : t("meta.text", { minutes: lesson.readingMinutes });
          const doneMeta = done ? t(mode === "reading" ? "meta.read" : "meta.done") : "";

          return (
            <li key={lesson.id}>
              <Link
                href={ROUTES.lesson(studySlug, lesson.slug)}
                aria-current={current ? "step" : undefined}
                className={`${styles.item} ${current ? styles.current : ""} ${mode === "reading" ? styles.reading : ""}`}
                scroll={false}
              >
                <span className={styles.badge} aria-hidden="true">
                  {done ? <Icon name="check" size={16} strokeWidth={2} /> : <span className="mono">{String(lesson.number).padStart(2, "0")}</span>}
                </span>
                <span className={styles.text}>
                  <span className={styles.title}>{lesson.title}</span>
                  <span className={`mono ${styles.meta}`}>
                    {meta}
                    {doneMeta}
                    {current && <span className="sr-only"> ({t("currentLesson")})</span>}
                  </span>
                </span>
                {mode === "video" && (
                  <Icon name={lesson.format === "video" ? "play" : "doc"} size={lesson.format === "video" ? 12 : 16} className={styles.format} />
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
