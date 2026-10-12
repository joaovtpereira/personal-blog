import { useTranslations } from "next-intl";
import { totalReadingMinutes, type StudyLayout, type StudyLessonPage } from "@/domain/entities";
import { StudyProgressMeter } from "@/presentation/components/StudyProgressMeter";
import styles from "./StudyHero.module.css";

/** Selo + tags, nome do estudo, descrição e progresso do visitante. */
export function StudyHero({ page, layout }: { page: StudyLessonPage; layout: StudyLayout }) {
  const t = useTranslations("Lesson");
  const { study, lessons, lesson } = page;
  const reading = layout === "reading";

  return (
    <section className={`wrap ${styles.hero}`} aria-labelledby="study-title">
      <div className={styles.text}>
        <div className={`rise d1 mono ${styles.badges}`}>
          <span className={styles.badge}>{reading ? t("badgeReading") : t("badge")}</span>
          {study.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
        <h1 id="study-title" className={`rise d2 ${styles.title}`}>
          {study.title}
        </h1>
        <p className={`rise d3 ${styles.description}`}>{study.description}</p>
      </div>
      <div className={`rise d4 ${styles.meter}`}>
        <StudyProgressMeter
          study={study}
          lessons={lessons}
          currentLessonId={lesson.id}
          mode={reading ? "reading" : "video"}
          suffix={reading ? t("progressTotalTime", { minutes: totalReadingMinutes(lessons) }) : ""}
        />
      </div>
    </section>
  );
}
