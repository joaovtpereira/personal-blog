import { useTranslations } from "next-intl";
import { formatDuration, neighbours, type StudyLessonPage } from "@/domain/entities";
import { CollectionNav } from "@/presentation/components/CollectionNav";
import { Comments, type CommentFormAction } from "@/presentation/components/Comments";
import { ContentRenderer } from "@/presentation/components/Content";
import { LessonDoneButton } from "@/presentation/components/LessonDoneButton";
import { LessonList } from "@/presentation/components/LessonList";
import { MaterialList } from "@/presentation/components/MaterialList";
import { ShareTrigger } from "@/presentation/components/ShareSheet";
import { VideoPlayer } from "@/presentation/components/VideoPlayer";
import type { PublicComment, ShareTarget } from "@/domain/entities";
import { LessonArrow } from "./LessonNav";
import { StudyHero } from "./StudyHero";
import styles from "./VideoLessonView.module.css";

export type LessonViewProps = {
  page: StudyLessonPage;
  comments: PublicComment[];
  commentAction: CommentFormAction;
  commentContext: Record<string, string>;
  share: ShareTarget;
};

/**
 * Estudo com vídeo.
 * Celular: player → título/ações → anotações → material → comentários → aulas.
 * Tablet: anotações e lista de aulas lado a lado. Desktop: lista de aulas fixa à direita.
 */
export function VideoLessonView({ page, comments, commentAction, commentContext, share }: LessonViewProps) {
  const t = useTranslations("Lesson");
  const { study, lessons, lesson } = page;
  const { previous, next } = neighbours(lessons, lesson.id);
  const videoCount = lessons.filter((item) => item.format === "video").length;
  const isVideo = lesson.format === "video";
  const duration = isVideo ? formatDuration(lesson.durationSeconds) : t("minutes", { minutes: lesson.readingMinutes });

  return (
    <>
      <StudyHero page={page} layout="video" />
      {page.collection && (
        <div className={`wrap rise d4 ${styles.collection}`}>
          <CollectionNav collection={page.collection} />
        </div>
      )}

      <section className={`wrap ${styles.body}`} aria-labelledby="lesson-title">
        <div className={styles.media} key={lesson.id}>
          {isVideo ? (
            <VideoPlayer video={lesson.video} title={lesson.title} />
          ) : (
            <div className={styles.textCard}>
              <div className={`mono ${styles.textCardMeta}`}>
                <span>{t("textCard")}</span>
                <span>{duration}</span>
              </div>
              {lesson.summary && (
                <>
                  <div className={`serif ${styles.textCardIdea}`}>“{lesson.summary.keyIdea}”</div>
                  <p className={styles.textCardSummary}>{lesson.summary.text}</p>
                </>
              )}
            </div>
          )}
        </div>

        <div className={styles.head}>
          <div>
            <div className={`mono ${styles.kicker}`}>
              {t("kindLabel", { number: String(lesson.number).padStart(2, "0"), kind: t(`kind.${lesson.format}`) })}
            </div>
            <h2 id="lesson-title" className={styles.lessonTitle}>
              {lesson.title}
            </h2>
          </div>
          <div className={styles.actions}>
            <LessonArrow studySlug={study.slug} lesson={previous} direction="previous" />
            <LessonDoneButton studyId={study.id} lessonId={lesson.id} mode="video" className={styles.done} />
            <LessonArrow studySlug={study.slug} lesson={next} direction="next" />
            <ShareTrigger target={share} variant="round" className={styles.share} />
          </div>
        </div>

        {(lesson.blocks.length > 0 || lesson.materials.length > 0) && (
          <div className={styles.notes}>
            {lesson.blocks.length > 0 && (
              <section aria-label={t("notes")}>
                <h3 className={`mono ${styles.label}`}>{t("notes")}</h3>
                <ContentRenderer blocks={lesson.blocks} variant="notes" className={styles.notesContent} />
              </section>
            )}
            {lesson.materials.length > 0 && (
              <section aria-label={t("materials")} className={styles.materials}>
                <h3 className={`mono ${styles.label}`}>{t("materials")}</h3>
                <MaterialList materials={lesson.materials} />
              </section>
            )}
          </div>
        )}

        <aside className={styles.lessons}>
          <div className={styles.lessonsHead}>
            <h2 className={styles.lessonsTitle}>{t("lessons")}</h2>
            <span className={`mono ${styles.count}`}>{t("videoCount", { count: String(videoCount).padStart(2, "0") })}</span>
          </div>
          <div className={styles.lessonsList}>
            <LessonList
              studyId={study.id}
              studySlug={study.slug}
              lessons={lessons}
              currentId={lesson.id}
              mode="video"
              label={t("lessonsNav")}
            />
          </div>
          <div className={styles.lessonsListCompact}>
            <LessonList
              studyId={study.id}
              studySlug={study.slug}
              lessons={lessons}
              currentId={lesson.id}
              mode="video"
              label={t("lessonsNav")}
              size="s"
            />
          </div>
        </aside>

        <div className={styles.comments}>
          <Comments id="comentarios-aula" comments={comments} action={commentAction} context={commentContext} />
        </div>
      </section>
    </>
  );
}
