import type { Locale } from "@/domain/entities";
import { BlogScreen } from "@/presentation/screens/blog";
import type { BlogQuery } from "@/presentation/utils/blog-query";
import { makeGetFeaturedPost, makeSearchPosts } from "../use-cases/use-cases";

export const BLOG_PAGE_SIZE = 6;

export async function makeBlogScreen(locale: Locale, query: BlogQuery) {
  const [result, featured] = await Promise.all([
    makeSearchPosts().execute({
      locale,
      kind: query.kind,
      tag: query.tag,
      query: query.query,
      page: query.page,
      pageSize: BLOG_PAGE_SIZE,
      // Celular/tablet mostram as páginas acumuladas ("carregar mais"); o desktop esconde as anteriores.
      fromPage: 1,
    }),
    makeGetFeaturedPost().execute({ locale }),
  ]);

  return <BlogScreen query={{ ...query, page: result.page }} result={result} featured={featured} pageSize={BLOG_PAGE_SIZE} />;
}
