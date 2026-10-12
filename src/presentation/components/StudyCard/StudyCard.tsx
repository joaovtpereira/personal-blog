"use client";

import { useTranslations } from "next-intl";
import { isAllVideoStudy, isTextOnlyStudy, totalLessons, type Study } from "@/domain/entities";
import { Link } from "@/main/i18n/navigation";
import { ROUTES } from "@/main/routes";
import { useStudyProgress } from "@/presentation/contexts/StudyProgressContext";
import { Badge } from "../Badge";
import { Icon } from "../Icon";
import { ProgressBar } from "../ProgressBar";
import { Tag } from "../Tag";
import styles from "./StudyCard.module.css";

type StudyCardProps = {
  study: Study;
  index: number;
  /**
   * featured: Home — compacto no celular, capa em grade a partir do tablet.
   * catalog: listagem de estudos — capa em todos os tamanhos e descrição.
   */
  variant?: "featured" | "catalog";
  delay?: number;
};

/** Card de estudo. O progresso é o do visitante, salvo no navegador. */
export function StudyCard({ study, index, variant = "featured", delay }: StudyCardProps) {
  const t = useTranslations("Studies");
  const progress = useStudyProgress(study);
  const total = totalLessons(study);
  const lessons = t("lessons", { count: total });

  const badge = isTextOnlyStudy(study) ? (
    <Badge variant="surface">{t("textOnly")}</Badge>
  ) : (
    <Badge variant="solid">
      <Icon name="play" size={9} />
      {isAllVideoStudy(study) ? t("allVideo") : t("videos", { count: study.videoLessons })}
    </Badge>
  );

  return (
    <Link
      href={ROUTES.study(study.slug)}
      className={`lift ${styles.card} ${styles[variant]} ${delay !== undefined ? "swap" : ""}`}
      style={delay !== undefined ? { animationDelay: `${delay}s` } : undefined}
    >
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
        {variant === "catalog" && <p className={styles.description}>{study.description}</p>}
        <div className={styles.tagChips}>
          {study.tags.map((tag) => (
            <Tag key={tag} name={tag} />
          ))}
        </div>
        <span className={`mono ${styles.tagLine}`}>{study.tags.map((tag) => `#${tag}`).join("  ")}</span>
        <div>
          <div className={`mono ${styles.status}`}>
            <span>{t(`status.${progress.status}`)}</span>
            <span>{t("progress", { done: progress.done, total })}</span>
          </div>
          <div className={styles.progress}>
            <ProgressBar key={progress.ready ? "ready" : "loading"} value={progress.ratio} label={lessons} />
          </div>
        </div>
      </div>
    </Link>
  );
}
