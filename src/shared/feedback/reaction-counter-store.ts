import type { PostReactionCountsModel } from "@/domain/models";

export type ReactionCountKey = Exclude<keyof PostReactionCountsModel, "post_id">;

/** Totais de reações por post. As mudanças são aplicadas de forma atômica e nunca ficam abaixo de zero. */
export interface ReactionCounterStore {
  get(postId: string): Promise<PostReactionCountsModel>;
  apply(postId: string, changes: Partial<Record<ReactionCountKey, number>>): Promise<PostReactionCountsModel>;
}
