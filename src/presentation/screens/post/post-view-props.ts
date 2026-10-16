import type { PostPage, PostReactions, PublicComment, ShareTarget } from "@/domain/entities";
import type { CommentFormAction } from "@/presentation/components/Comments";
import type { ReactionFormAction } from "@/presentation/components/ReactionButtons/reaction-form-state";

export type PostViewProps = {
  page: PostPage;
  comments: PublicComment[];
  commentAction: CommentFormAction;
  /** Campos ocultos do formulário de comentário (montados pela factory). */
  commentContext: Record<string, string>;
  /** Painel de compartilhar (imagem para story e link). */
  share: ShareTarget;
  /** Totais de curtidas/reações (dado vivo, com cache do Next). */
  reactions: PostReactions;
  reactionAction: ReactionFormAction;
};
