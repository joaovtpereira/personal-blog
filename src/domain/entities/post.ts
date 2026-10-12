import type { Locale } from "./locale";

export type PostKind = "thought" | "book" | "game";

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
};
