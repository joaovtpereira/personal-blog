import type { Locale, Post, PostKind } from "../entities";

export type SearchPostsParams = {
  locale: Locale;
  kind?: PostKind | null;
  tag?: string | null;
  query?: string | null;
  /** Página pedida (1-based). */
  page: number;
  pageSize: number;
  /** Devolve as páginas desde esta (para "carregar mais" acumulado). Padrão = page. */
  fromPage?: number;
};

export type PostSearchResult = {
  /** Uma lista por página, de fromPage até page. */
  pages: Post[][];
  /** Total de textos que batem com o filtro. */
  total: number;
  page: number;
  pageCount: number;
  /** Quantos textos por categoria com a busca/tag atuais (para os contadores). */
  counts: Record<PostKind | "all", number>;
  /** Tags existentes no idioma, das mais usadas para as menos. */
  tags: string[];
};

export interface SearchPosts {
  execute(params: SearchPostsParams): Promise<PostSearchResult>;
}

export interface GetFeaturedPost {
  /** Post marcado como destaque; sem marcação, o mais recente. */
  execute(params: { locale: Locale }): Promise<Post | null>;
}
