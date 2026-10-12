import { useTranslations } from "next-intl";
import { isCompletedStudy, isTextOnlyStudy, studyProgress, type Study } from "@/domain/entities";
import { Link } from "@/main/i18n/navigation";
import { ROUTES } from "@/main/routes";
import { Badge } from "../Badge";
import { Icon } from "../Icon";
import { ProgressBar } from "../ProgressBar";
import styles from "./StudyCard.module.css";

type StudyCardProps = {
  study: Study;
  index: number;
};

/** Celular: card compacto em carrossel. Tablet/desktop: card com cabeçalho em grade e número grande. */
export function StudyCard({ study, index }: StudyCardProps) {
  const t = useTranslations("Home.studies");
  const textOnly = isTextOnlyStudy(study);
  const completed = isCompletedStudy(study);
  const lessons = t("lessons", { count: study.totalLessons });
  const badge = textOnly ? (
    <Badge variant="surface">{t("textOnly")}</Badge>
  ) : (
    <Badge variant="solid">
      <Icon name="play" size={9} />
      {t("videos", { count: study.videoLessons })}
    </Badge>
  );

  return (
    <Link href={ROUTES.study(study.slug)} className={`lift ${styles.card}`}>
      <div className={styles.cover} aria-hidden="true">
        <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
        <span className={styles.coverBadge}>{badge}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.top}>
          <span className={`mono ${styles.count}`}>{lessons}</span>
          {badge}
        </div>
        <h3 className={styles.title}>{study.title}</h3>
        <span className={`mono ${styles.tags}`}>{study.tags.map((tag) => `#${tag}`).join("  ")}</span>
        <div>
          <div className={`mono ${styles.status}`}>
            <span>{completed ? t("completed") : t("inProgress")}</span>
            <span>{t("progress", { done: study.completedLessons, total: study.totalLessons })}</span>
          </div>
          <div className={styles.progress}>
            <ProgressBar value={studyProgress(study)} label={lessons} />
          </div>
        </div>
      </div>
    </Link>
  );
}
