import type { PostKind } from "@/domain/entities";

/** Estado do blog que vive na URL: ?categoria=livros&tag=filmes&q=...&pagina=2 */
export type BlogQuery = {
  kind: PostKind | null;
  tag: string | null;
  query: string;
  page: number;
};

export const BLOG_QUERY_KEYS = { kind: "categoria", tag: "tag", query: "q", page: "pagina" } as const;

/** Slugs estáveis da categoria na URL (iguais em todos os idiomas). */
const KIND_SLUG: Record<PostKind, string> = { thought: "pensamentos", book: "livros", game: "jogos" };
const SLUG_KIND = Object.fromEntries(Object.entries(KIND_SLUG).map(([kind, slug]) => [slug, kind])) as Record<string, PostKind>;

type RawParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

export function parseBlogQuery(params: RawParams): BlogQuery {
  const page = Number.parseInt(first(params[BLOG_QUERY_KEYS.page]), 10);
  return {
    kind: SLUG_KIND[first(params[BLOG_QUERY_KEYS.kind])] ?? null,
    tag: first(params[BLOG_QUERY_KEYS.tag]).trim() || null,
    query: first(params[BLOG_QUERY_KEYS.query]).trim().slice(0, 80),
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/** Monta a query para links; mudar filtro/busca sempre volta para a página 1. */
export function blogQueryString(current: BlogQuery, patch: Partial<BlogQuery>): Record<string, string> {
  const next = { ...current, ...patch };
  if (!("page" in patch)) next.page = 1;
  const out: Record<string, string> = {};
  if (next.kind) out[BLOG_QUERY_KEYS.kind] = KIND_SLUG[next.kind];
  if (next.tag) out[BLOG_QUERY_KEYS.tag] = next.tag;
  if (next.query) out[BLOG_QUERY_KEYS.query] = next.query;
  if (next.page > 1) out[BLOG_QUERY_KEYS.page] = String(next.page);
  return out;
}

export const hasActiveFilters = (query: BlogQuery): boolean => !!(query.kind || query.tag || query.query);
