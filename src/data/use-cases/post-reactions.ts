import { isReactionChoice, nextReactionChoice, reactionChoicesFor, type PostKind, type PostReactions } from "@/domain/entities";
import type { PostModel } from "@/domain/models";
import type { GetPostReactions, ReactToPost, ReactToPostParams, ReactToPostResult } from "@/domain/use-cases";
import type { CollectionDataSource } from "@/shared/data-source";
import type { RateLimiter, ReactionCountKey, ReactionCounterStore } from "@/shared/feedback";
import { REACTION_FIELD, toPostReactions } from "../mappers/post-reaction-counts-mapper";
import { toPostKind } from "../mappers/post-model-mapper";

/** Tipo do post publicado (o id vem do formulário: só posts que existem recebem reação). */
async function kindOf(posts: CollectionDataSource<PostModel>, postId: string): Promise<PostKind | null> {
  const post = (await posts.findAll()).find((model) => model.id === postId);
  return post ? toPostKind(post.type) : null;
}

export class StoredPostReactions implements GetPostReactions {
  constructor(
    private readonly posts: CollectionDataSource<PostModel>,
    private readonly counter: ReactionCounterStore,
  ) {}

  async execute({ postId }: { postId: string }): Promise<PostReactions> {
    const kind = (await kindOf(this.posts, postId)) ?? "thought";
    return toPostReactions(kind, await this.counter.get(postId));
  }
}

export class CountedReactToPost implements ReactToPost {
  constructor(
    private readonly posts: CollectionDataSource<PostModel>,
    private readonly counter: ReactionCounterStore,
    private readonly limiter: RateLimiter,
  ) {}

  async execute({ postId, choice, previous, visitorKey }: ReactToPostParams): Promise<ReactToPostResult> {
    const kind = await kindOf(this.posts, postId);
    const allowed = kind ? reactionChoicesFor(kind) : [];
    if (!kind || !allowed.includes(choice)) return { status: "invalid" };
    let before = isReactionChoice(previous) && allowed.includes(previous) ? previous : null;

    if (!(await this.limiter.consume(`reaction:${visitorKey}:${postId}`))) return { status: "limited" };

    // A escolha guardada no navegador pode ser de um voto que não está no banco (ex.: dados trocados,
    // totais zerados). Desfazer uma reação com total zero não faz sentido: vale como voto novo.
    if (before) {
      const current = await this.counter.get(postId);
      if (current[REACTION_FIELD[before]] === 0) before = null;
    }

    // Tocar na mesma reação desfaz; em outra, troca.
    const next = nextReactionChoice(before, choice);
    const changes: Partial<Record<ReactionCountKey, number>> = {};
    if (before) changes[REACTION_FIELD[before]] = -1;
    if (next) changes[REACTION_FIELD[next]] = (changes[REACTION_FIELD[next]] ?? 0) + 1;

    const counts = await this.counter.apply(postId, changes);
    return { status: "ok", reactions: toPostReactions(kind, counts), choice: next };
  }
}
