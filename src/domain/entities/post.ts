import type { Locale } from "./locale";

export type PostKind = "thought" | "book" | "game";

export const POST_KINDS: PostKind[] = ["thought", "book", "game"];

export type Post = {
  id: string;
  slug: string;
  locale: Locale;
  kind: PostKind;
  title: string;
  excerpt: string;
  tags: string[];
  readingMinutes: number;
  /** ISO 8601 — string para atravessar a fronteira server/client. */
  publishedAt: string;
  /** Nota de 0 a 5. Só existe em resenhas. */
  rating: number | null;
  /** Autor do livro ou plataforma do jogo (resenhas). */
  subject: string | null;
  /** Capa do livro ou captura do jogo. */
  coverImage: string | null;
  /** Marcado para "Em destaque" no topo do blog. */
  featured: boolean;
};

export const isReview = (post: Post): boolean => post.kind !== "thought";

/** Busca simples: título, resumo, autor/plataforma e tags, sem acento e sem caixa. */
export const normalizeSearch = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

export const matchesSearch = (post: Post, query: string): boolean => {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = normalizeSearch([post.title, post.excerpt, post.subject ?? "", ...post.tags].join(" "));
  return terms.every((term) => haystack.includes(term));
};
