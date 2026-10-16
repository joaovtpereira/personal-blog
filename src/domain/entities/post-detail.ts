import type { ContentBlock } from "./content-block";
import type { Post, PostKind } from "./post";
import type { CollectionPosition } from "./study-collection";

export type Verdict = {
  /** 0 a 5 */
  score: number;
  line: string;
};

/** Campos obrigatórios da resenha de livro (os mesmos do editor de conteúdo). */
export type BookReview = {
  kind: "book";
  author: string;
  year: string;
  pages: string;
  genres: string[];
  coverImage: string | null;
  verdict: Verdict;
  pros: string[];
  cons: string[];
};

/** Campos obrigatórios da resenha de jogo (os mesmos do editor de conteúdo). */
export type GameReview = {
  kind: "game";
  studio: string;
  platform: string;
  hours: string;
  release: string;
  genre: string;
  /** Jogo zerado (selo ✓ ZERADO). */
  completed: boolean;
  captureImage: string | null;
  worth: string;
  difficulty: string;
  audience: string;
  verdict: Verdict;
  pros: string[];
  cons: string[];
};

export type Review = BookReview | GameReview;

export const THOUGHT_REACTIONS = ["agree", "think", "disagree"] as const;
export type ThoughtReaction = (typeof THOUGHT_REACTIONS)[number];

/** Totais de reações vindos do back-end (resenhas: curtidas · pensamentos: três reações). */
export type PostReactions =
  | { type: "like"; count: number }
  | { type: "thought"; counts: Record<ThoughtReaction, number> };

/** Reação que o visitante escolheu: "like" nas resenhas ou uma das três nos pensamentos. */
export type PostReactionChoice = "like" | ThoughtReaction;

/** Reações que cada tipo de post aceita: pensamentos têm três; resenhas, só "curtir". */
export const reactionChoicesFor = (kind: PostKind): readonly PostReactionChoice[] => (kind === "thought" ? THOUGHT_REACTIONS : ["like"]);

/** Regra de troca: tocar na mesma reação desfaz; em outra, passa a ser ela. */
export const nextReactionChoice = (previous: PostReactionChoice | null, touched: PostReactionChoice): PostReactionChoice | null =>
  previous === touched ? null : touched;

/** Totais depois de trocar `previous` por `next` (atualização otimista na tela, igual à do servidor). */
export function applyReactionChange(
  reactions: PostReactions,
  previous: PostReactionChoice | null,
  next: PostReactionChoice | null,
): PostReactions {
  if (reactions.type === "like") {
    const delta = (next === "like" ? 1 : 0) - (previous === "like" ? 1 : 0);
    return { type: "like", count: Math.max(0, reactions.count + delta) };
  }
  const counts = { ...reactions.counts };
  if (previous && previous !== "like") counts[previous] = Math.max(0, counts[previous] - 1);
  if (next && next !== "like") counts[next] += 1;
  return { type: "thought", counts };
}

export const isReactionChoice = (value: unknown): value is PostReactionChoice =>
  value === "like" || THOUGHT_REACTIONS.includes(value as ThoughtReaction);

export type PostDetail = {
  post: Post;
  /** Linha fina (pensamentos). */
  lead: string | null;
  blocks: ContentBlock[];
  review: Review | null;
  reactions: PostReactions;
};

/** Tudo que a tela de leitura precisa. */
export type PostPage = {
  detail: PostDetail;
  collection: CollectionPosition | null;
  /** "Próxima leitura" (resenhas) ou "Outros pensamentos". */
  related: Post[];
};
