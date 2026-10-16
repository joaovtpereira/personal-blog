import type { Firestore } from "firebase-admin/firestore";
import type { PostReactionCountsModel } from "@/domain/models";
import type { ReactionCountKey, ReactionCounterStore } from "@/shared/feedback";

const EMPTY = { likes: 0, fez_sentido: 0, me_fez_pensar: 0, discordo: 0 };

/** post_reactions/<post_id> com um total por reação, alterado em transação. */
export class FirestoreReactionCounterStore implements ReactionCounterStore {
  constructor(
    private readonly db: Firestore,
    private readonly collection = "post_reactions",
  ) {}

  async get(postId: string): Promise<PostReactionCountsModel> {
    const doc = await this.db.collection(this.collection).doc(postId).get();
    return { ...EMPTY, ...(doc.data() as Partial<PostReactionCountsModel> | undefined), post_id: postId };
  }

  apply(postId: string, changes: Partial<Record<ReactionCountKey, number>>): Promise<PostReactionCountsModel> {
    const ref = this.db.collection(this.collection).doc(postId);
    return this.db.runTransaction(async (tx) => {
      const current = { ...EMPTY, ...((await tx.get(ref)).data() as Partial<PostReactionCountsModel> | undefined) };
      const next: PostReactionCountsModel = { ...current, post_id: postId };
      for (const [key, delta] of Object.entries(changes) as [ReactionCountKey, number][]) {
        next[key] = Math.max(0, (current[key] ?? 0) + delta);
      }
      tx.set(ref, next);
      return next;
    });
  }
}
