import type { PostReactionCountsModel } from "@/domain/models";
import type { CommentStore, RateLimiter, ReactionCountKey, ReactionCounterStore } from "@/shared/feedback";

/* Versões em memória para desenvolvimento sem Firebase: somem ao reiniciar o servidor. */

export class InMemoryCommentStore<TModel extends { id: string }> implements CommentStore<TModel> {
  constructor(
    private readonly items: TModel[],
    private readonly targetField: keyof TModel,
  ) {}

  async listFor(targetId: string): Promise<TModel[]> {
    return structuredClone(this.items.filter((item) => item[this.targetField] === targetId));
  }

  async add(model: TModel): Promise<void> {
    this.items.push(structuredClone(model));
  }
}

export class InMemoryReactionCounterStore implements ReactionCounterStore {
  private readonly counts = new Map<string, PostReactionCountsModel>();

  async get(postId: string): Promise<PostReactionCountsModel> {
    return { ...(this.counts.get(postId) ?? { post_id: postId, likes: 0, fez_sentido: 0, me_fez_pensar: 0, discordo: 0 }) };
  }

  async apply(postId: string, changes: Partial<Record<ReactionCountKey, number>>): Promise<PostReactionCountsModel> {
    const next = await this.get(postId);
    for (const [key, delta] of Object.entries(changes) as [ReactionCountKey, number][]) next[key] = Math.max(0, next[key] + delta);
    this.counts.set(postId, next);
    return { ...next };
  }
}

export class InMemoryRateLimiter implements RateLimiter {
  private readonly hits = new Map<string, { count: number; start: number }>();

  constructor(
    private readonly limit: number,
    private readonly windowSeconds: number,
  ) {}

  async consume(key: string): Promise<boolean> {
    const now = Date.now();
    const entry = this.hits.get(key);
    const fresh = !entry || now - entry.start >= this.windowSeconds * 1000;
    const count = fresh ? 1 : entry.count + 1;
    if (count > this.limit) return false;
    this.hits.set(key, { count, start: fresh ? now : entry.start });
    return true;
  }
}
