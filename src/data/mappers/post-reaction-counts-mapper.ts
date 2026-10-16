import type { PostKind, PostReactionChoice, PostReactions } from "@/domain/entities";
import type { PostReactionCountsModel } from "@/domain/models";

/** Nome de cada reação no documento do Firestore. */
export const REACTION_FIELD: Record<PostReactionChoice, Exclude<keyof PostReactionCountsModel, "post_id">> = {
  like: "likes",
  agree: "fez_sentido",
  think: "me_fez_pensar",
  disagree: "discordo",
};

/** Totais gravados → o que a tela mostra para o tipo de post. */
export function toPostReactions(kind: PostKind, model: PostReactionCountsModel): PostReactions {
  if (kind !== "thought") return { type: "like", count: model.likes };
  return { type: "thought", counts: { agree: model.fez_sentido, think: model.me_fez_pensar, disagree: model.discordo } };
}
