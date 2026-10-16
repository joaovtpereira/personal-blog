import { notFound } from "next/navigation";
import { lessonShareCard, type Locale } from "@/domain/entities";
import { LESSON_COMMENT_CONTEXT } from "@/main/actions/lesson-comment-context";
import { postLessonCommentAction } from "@/main/actions/post-lesson-comment.action";
import { ROUTES } from "@/main/routes";
import { StudyLessonScreen } from "@/presentation/screens/study-lesson";
import { makeShareTarget } from "../share/share-target";
import { cachedLessonComments } from "@/main/cache/feedback-cache";
import { makeGetStudyLesson } from "../use-cases/use-cases";

export async function loadStudyLesson(locale: Locale, studySlug: string, lessonSlug?: string) {
  return makeGetStudyLesson().execute({ locale, studySlug, lessonSlug });
}

export async function makeStudyLessonScreen(locale: Locale, studySlug: string, lessonSlug?: string) {
  const page = await loadStudyLesson(locale, studySlug, lessonSlug);
  if (!page) notFound();

  const comments = await cachedLessonComments(page.lesson.id);

  return (
    <StudyLessonScreen
      page={page}
      comments={comments}
      share={makeShareTarget(lessonShareCard(page, ROUTES.lesson(page.study.slug, page.lesson.slug)))}
      commentAction={postLessonCommentAction}
      commentContext={{
        [LESSON_COMMENT_CONTEXT.studyId]: page.study.id,
        [LESSON_COMMENT_CONTEXT.lessonId]: page.lesson.id,
        [LESSON_COMMENT_CONTEXT.lessonTitle]: page.lesson.title,
      }}
    />
  );
}
