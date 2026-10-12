import type { PostPage, PublicComment } from "@/domain/entities";
import type { CommentFormAction } from "@/presentation/components/Comments";

export type PostViewProps = {
  page: PostPage;
  comments: PublicComment[];
  commentAction: CommentFormAction;
  /** Campos ocultos do formulário de comentário (montados pela factory). */
  commentContext: Record<string, string>;
};
