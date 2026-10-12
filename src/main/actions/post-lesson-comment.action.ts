"use server";

import { getLocale } from "next-intl/server";
import { toLocale } from "@/data/mappers/locale";
import { makePostLessonComment } from "@/main/factories/use-cases/use-cases";
import { LESSON_COMMENT_CONTEXT } from "./lesson-comment-context";
import { COMMENT_FORM_FIELDS as F, type CommentFormState } from "@/presentation/components/Comments/comment-form-state";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "");

export async function postLessonCommentAction(_: CommentFormState, formData: FormData): Promise<CommentFormState> {
  // Robô preencheu o campo oculto: finge que foi para a moderação e descarta.
  if (text(formData, F.honeypot).trim()) return { status: "pending" };

  const result = await makePostLessonComment().execute({
    studyId: text(formData, LESSON_COMMENT_CONTEXT.studyId),
    lessonId: text(formData, LESSON_COMMENT_CONTEXT.lessonId),
    lessonTitle: text(formData, LESSON_COMMENT_CONTEXT.lessonTitle),
    name: text(formData, F.name),
    text: text(formData, F.text),
    locale: toLocale(await getLocale()),
  });

  if (result.status === "pending") return { status: "pending" };
  if (result.status === "invalid") return { status: "invalid", errors: result.errors };
  return { status: "failed" };
}
