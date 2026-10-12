import { useTranslations } from "next-intl";
import { neighbours, totalReadingMinutes } from "@/domain/entities";
import { CollectionNav } from "@/presentation/components/CollectionNav";
import { Comments } from "@/presentation/components/Comments";
import { ContentRenderer } from "@/presentation/components/Content";
import { LessonDoneButton } from "@/presentation/components/LessonDoneButton";
import { LessonList } from "@/presentation/components/LessonList";
import { MaterialList } from "@/presentation/components/MaterialList";
import { LessonNavCards } from "./LessonNav";
import { ReadingArticle, ReadingSession } from "./ReadingSession";
import { StudyHero } from "./StudyHero";
import type { LessonViewProps } from "./VideoLessonView";
import styles from "./ReadingLessonView.module.css";

/**
 * Estudo só texto (modo leitura).
 * Celular: texto → marcar como lida → anterior/próxima → comentários → sumário.
 * Tablet/desktop: sumário fixo à esquerda e o texto à direita.
 */
export function ReadingLessonView({ page, comments, commentAction, commentContext }: LessonViewProps) {
  const t = useTranslations("Lesson");
  const { study, lessons, lesson } = page;
  const { previous, next } = neighbours(lessons, lesson.id);
  const pad = (n: number) => String(n).padStart(2, "0");
  const counter = t("counter", { current: pad(lesson.number), total: pad(lessons.length) });

  return (
    <ReadingSession counter={counter}>
      <StudyHero page={page} layout="reading" />
      {page.collection && (
        <div className={`wrap rise d4 ${styles.collection}`}>
          <CollectionNav collection={page.collection} />
        </div>
      )}

      <section className={`wrap ${styles.body}`}>
        <aside className={styles.toc}>
          <div className={styles.tocHead}>
            <h2 className={styles.tocTitle}>{t("toc")}</h2>
            <span className={`mono ${styles.tocTime}`}>{t("totalTime", { minutes: totalReadingMinutes(lessons) })}</span>
          </div>
          <div className={styles.tocList}>
            <LessonList
              studyId={study.id}
              studySlug={study.slug}
              lessons={lessons}
              currentId={lesson.id}
              mode="reading"
              label={t("toc")}
              size="s"
            />
          </div>
        </aside>

        <div className={styles.main}>
          <ReadingArticle key={lesson.id} className={styles.article}>
            <div className={`mono ${styles.kicker}`}>
              <span className={styles.kickerCounter}>{counter} · </span>
              {t("readTime", { minutes: lesson.readingMinutes })}
            </div>
            <h2 className={styles.title}>{lesson.title}</h2>
            <ContentRenderer blocks={lesson.blocks} className={styles.content} />
            {lesson.materials.length > 0 && (
              <section aria-label={t("materials")} className={styles.materials}>
                <h3 className={`mono ${styles.label}`}>{t("materials")}</h3>
                <MaterialList materials={lesson.materials} />
              </section>
            )}
          </ReadingArticle>

          <div className={styles.actions}>
            <LessonDoneButton studyId={study.id} lessonId={lesson.id} mode="reading" className={styles.done} />
            <LessonNavCards studySlug={study.slug} previous={previous} next={next} />
          </div>

          <div className={styles.comments}>
            <Comments id="comentarios-aula" comments={comments} action={commentAction} context={commentContext} />
          </div>
        </div>
      </section>
    </ReadingSession>
  );
}
