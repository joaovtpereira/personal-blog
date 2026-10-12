import type { CommentFieldErrors, Locale, PostPage, PostReactionChoice, PublicComment } from "../entities";

export interface GetPostPage {
  /** null quando o post não existe no idioma. */
  execute(params: { locale: Locale; slug: string }): Promise<PostPage | null>;
}

export interface GetPostRoutes {
  execute(): Promise<{ locale: Locale; slug: string }[]>;
}

export interface GetPostComments {
  /** Só os aprovados, do mais novo para o mais antigo. */
  execute(params: { postId: string }): Promise<PublicComment[]>;
}

export type PostCommentParams = {
  postId: string;
  postTitle: string;
  name: string;
  email: string;
  text: string;
  locale: Locale;
};

export type PostCommentResult =
  | { status: "pending" }
  | { status: "invalid"; errors: CommentFieldErrors }
  | { status: "failed" };

/** Envia para moderação — não aparece na hora. */
export interface PostPostComment {
  execute(params: PostCommentParams): Promise<PostCommentResult>;
}

/** Reação do visitante a cada post (no navegador). */
export interface GetPostReactionChoices {
  execute(): Promise<Record<string, PostReactionChoice>>;
}

export interface SetPostReactionChoice {
  /** null remove a reação. */
  execute(params: { postId: string; choice: PostReactionChoice | null }): Promise<void>;
}

export interface WatchPostReactionChoices {
  subscribe(listener: () => void): () => void;
}
