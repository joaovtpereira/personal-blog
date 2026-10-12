"use server";

import { getLocale } from "next-intl/server";
import { toLocale } from "@/data/mappers/locale";
import { makePostPostComment } from "@/main/factories/use-cases/use-cases";
import { COMMENT_FORM_FIELDS as F, type CommentFormState } from "@/presentation/components/Comments/comment-form-state";
import { POST_COMMENT_CONTEXT } from "./post-comment-context";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "");

export async function postPostCommentAction(_: CommentFormState, formData: FormData): Promise<CommentFormState> {
  // Robô preencheu o campo oculto: finge que foi para a moderação e descarta.
  if (text(formData, F.honeypot).trim()) return { status: "pending" };

  const result = await makePostPostComment().execute({
    postId: text(formData, POST_COMMENT_CONTEXT.postId),
    postTitle: text(formData, POST_COMMENT_CONTEXT.postTitle),
    name: text(formData, F.name),
    email: text(formData, F.email),
    text: text(formData, F.text),
    locale: toLocale(await getLocale()),
  });

  if (result.status === "pending") return { status: "pending" };
  if (result.status === "invalid") return { status: "invalid", errors: result.errors };
  return { status: "failed" };
}
