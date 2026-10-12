import { notFound } from "next/navigation";
import type { Locale } from "@/domain/entities";
import { LESSON_COMMENT_CONTEXT } from "@/main/actions/lesson-comment-context";
import { postLessonCommentAction } from "@/main/actions/post-lesson-comment.action";
import { StudyLessonScreen } from "@/presentation/screens/study-lesson";
import { makeGetLessonComments, makeGetStudyLesson } from "../use-cases/use-cases";

export async function loadStudyLesson(locale: Locale, studySlug: string, lessonSlug?: string) {
  return makeGetStudyLesson().execute({ locale, studySlug, lessonSlug });
}

export async function makeStudyLessonScreen(locale: Locale, studySlug: string, lessonSlug?: string) {
  const page = await loadStudyLesson(locale, studySlug, lessonSlug);
  if (!page) notFound();

  const comments = await makeGetLessonComments().execute({ lessonId: page.lesson.id });

  return (
    <StudyLessonScreen
      page={page}
      comments={comments}
      commentAction={postLessonCommentAction}
      commentContext={{
        [LESSON_COMMENT_CONTEXT.studyId]: page.study.id,
        [LESSON_COMMENT_CONTEXT.lessonId]: page.lesson.id,
        [LESSON_COMMENT_CONTEXT.lessonTitle]: page.lesson.title,
      }}
    />
  );
}
