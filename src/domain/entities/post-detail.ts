import type { ContentBlock } from "./content-block";
import type { Post } from "./post";
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
