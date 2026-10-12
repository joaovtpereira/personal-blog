import { THOUGHT_REACTIONS, type PostReactionChoice } from "@/domain/entities";
import type { PostReactionStoreModel } from "@/domain/models";
import type { GetPostReactionChoices, SetPostReactionChoice, WatchPostReactionChoices } from "@/domain/use-cases";
import type { KeyValueCache } from "@/shared/cache";

export const POST_REACTIONS_KEY = "post-reactions";

const VALID = new Set<string>(["like", ...THOUGHT_REACTIONS]);

const read = (cache: KeyValueCache): Record<string, string> => {
  const store = cache.get<PostReactionStoreModel>(POST_REACTIONS_KEY);
  return store?.version === 1 && store.choices && typeof store.choices === "object" ? store.choices : {};
};

export class CachedGetPostReactionChoices implements GetPostReactionChoices {
  constructor(private readonly cache: KeyValueCache) {}

  async execute(): Promise<Record<string, PostReactionChoice>> {
    return Object.fromEntries(
      Object.entries(read(this.cache)).filter(([, choice]) => VALID.has(choice)),
    ) as Record<string, PostReactionChoice>;
  }
}

export class CachedSetPostReactionChoice implements SetPostReactionChoice {
  constructor(private readonly cache: KeyValueCache) {}

  async execute({ postId, choice }: { postId: string; choice: PostReactionChoice | null }): Promise<void> {
    const choices = { ...read(this.cache) };
    if (choice) choices[postId] = choice;
    else delete choices[postId];
    this.cache.set<PostReactionStoreModel>(POST_REACTIONS_KEY, { version: 1, choices });
  }
}

export class CachedWatchPostReactionChoices implements WatchPostReactionChoices {
  constructor(private readonly cache: KeyValueCache) {}

  subscribe(listener: () => void): () => void {
    return this.cache.subscribe(POST_REACTIONS_KEY, listener);
  }
}
