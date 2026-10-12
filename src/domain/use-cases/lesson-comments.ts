import type { CommentFieldErrors, Locale, PublicComment } from "../entities";

export interface GetLessonComments {
  /** Só os aprovados, do mais novo para o mais antigo. */
  execute(params: { lessonId: string }): Promise<PublicComment[]>;
}

export type PostLessonCommentParams = {
  studyId: string;
  lessonId: string;
  lessonTitle: string;
  name: string;
  text: string;
  locale: Locale;
};

export type PostLessonCommentResult =
  | { status: "pending" }
  | { status: "invalid"; errors: CommentFieldErrors }
  | { status: "failed" };

/** Envia para moderação — o comentário não aparece na hora. */
export interface PostLessonComment {
  execute(params: PostLessonCommentParams): Promise<PostLessonCommentResult>;
}
