import { useTranslations } from "next-intl";
import type { LessonSummary } from "@/domain/entities";
import { Link } from "@/main/i18n/navigation";
import { ROUTES } from "@/main/routes";
import { Icon } from "@/presentation/components/Icon";
import styles from "./LessonNav.module.css";

type LessonNavProps = {
  studySlug: string;
  previous: LessonSummary | null;
  next: LessonSummary | null;
};

/** Botões redondos ← → (estudo com vídeo). Desabilitados no início/fim da trilha. */
export function LessonArrow({ studySlug, lesson, direction }: { studySlug: string; lesson: LessonSummary | null; direction: "previous" | "next" }) {
  const t = useTranslations("Lesson");
  const label = t(direction);
  const icon = <Icon name={direction === "previous" ? "chevronLeft" : "arrowRight"} />;
  if (!lesson) {
    return (
      <span className={`${styles.round} ${styles.disabled}`} aria-disabled="true" role="link" aria-label={label}>
        {icon}
      </span>
    );
  }
  return (
    <Link href={ROUTES.lesson(studySlug, lesson.slug)} className={styles.round} aria-label={`${label}: ${lesson.title}`} scroll={false}>
      {icon}
    </Link>
  );
}

/** Cards ← ANTERIOR / PRÓXIMA → com o título da aula (modo leitura). */
export function LessonNavCards({ studySlug, previous, next }: LessonNavProps) {
  const t = useTranslations("Lesson");
  const card = (lesson: LessonSummary | null, direction: "previous" | "next") => {
    const label = t(direction === "previous" ? "prevLabel" : "nextLabel");
    const title = lesson?.title ?? t(direction === "previous" ? "studyStart" : "studyEnd");
    const className = `${styles.card} ${direction === "next" ? styles.cardNext : ""}`;
    return lesson ? (
      <Link href={ROUTES.lesson(studySlug, lesson.slug)} className={className}>
        <span className={`mono ${styles.cardLabel}`}>{label}</span>
        <span className={styles.cardTitle}>{title}</span>
      </Link>
    ) : (
      <span className={`${className} ${styles.disabled}`} aria-disabled="true">
        <span className={`mono ${styles.cardLabel}`}>{label}</span>
        <span className={styles.cardTitle}>{title}</span>
      </span>
    );
  };
  return (
    <nav className={styles.cards} aria-label={t("lessonsNav")}>
      {card(previous, "previous")}
      {card(next, "next")}
    </nav>
  );
}
