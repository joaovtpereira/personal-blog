import { useTranslations } from "next-intl";
import { POST_KINDS, type Post } from "@/domain/entities";
import type { PostSearchResult } from "@/domain/use-cases";
import { Link } from "@/main/i18n/navigation";
import { ROUTES } from "@/main/routes";
import { FeaturedPostCard } from "@/presentation/components/FeaturedPostCard";
import { CategoryLinks, TagLinks } from "@/presentation/components/FilterLinks";
import { LoadMoreLink, Pagination } from "@/presentation/components/Pagination";
import { PostListItem } from "@/presentation/components/PostListItem";
import { blogQueryString, hasActiveFilters, type BlogQuery } from "@/presentation/utils/blog-query";
import { pad2 } from "@/presentation/utils/format";
import { BlogSearch } from "./sections/BlogSearch";
import styles from "./BlogScreen.module.css";

export type BlogScreenProps = {
  query: BlogQuery;
  result: PostSearchResult;
  featured: Post | null;
  pageSize: number;
};

/**
 * Blog: busca, categorias, tags, destaque e lista.
 * Celular/tablet: tudo em coluna e "Carregar mais" acumulando páginas.
 * Desktop: filtros numa coluna à esquerda e paginação numerada (só a página atual na lista).
 */
export function BlogScreen({ query, result, featured, pageSize }: BlogScreenProps) {
  const t = useTranslations("Blog");
  const href = (patch: Partial<BlogQuery>) => ({ pathname: ROUTES.blog, query: blogQueryString(query, patch) });
  const filtered = hasActiveFilters(query);

  const categories = [
    { id: "all", label: t("categories.all"), count: result.counts.all, href: href({ kind: null }), selected: !query.kind },
    ...POST_KINDS.map((kind) => ({
      id: kind,
      label: t(`categories.${kind}`),
      count: result.counts[kind],
      href: href({ kind }),
      selected: query.kind === kind,
    })),
  ];

  const tags = result.tags.map((name) => {
    const selected = query.tag === name;
    return { name, selected, href: href({ tag: selected ? null : name }), label: selected ? t("tags.remove", { tag: name }) : `#${name}` };
  });

  const heading = query.query
    ? t("heading.search", { query: query.query })
    : query.kind
      ? t(`categories.${query.kind}`)
      : t("heading.all");

  const firstPage = result.page - result.pages.length + 1;

  return (
    <main id="conteudo" className={`wrap ${styles.page}`}>
      <div className={styles.head}>
        <h1 className={styles.title}>
          <span className={`rise d1 ${styles.line}`}>{t("titleLine1")}</span>
          <span className={`rise d2 serif ${styles.line} ${styles.accent}`}>{t("titleLine2")}</span>
        </h1>
        <p className={`rise d3 ${styles.lead}`}>{t("lead")}</p>
      </div>
      <div className={styles.rule} aria-hidden="true" />

      <aside className={styles.aside}>
        <BlogSearch query={query} className={`rise d4 ${styles.search}`} />
        <div className={`rise d5 ${styles.categories}`}>
          <CategoryLinks options={categories} label={t("categories.aria")} heading={t("categories.label")} />
        </div>
        {tags.length > 0 && (
          <div className={`rise d5 ${styles.tags}`}>
            <TagLinks options={tags} label={t("tags.aria")} heading={t("tags.label")} />
          </div>
        )}
      </aside>

      <div className={styles.main}>
        {featured && !filtered && (
          <section className={styles.featured} aria-labelledby="featured-label">
            <div id="featured-label" className={`mono ${styles.featuredLabel}`}>
              {t("featured.label")}
            </div>
            <FeaturedPostCard post={featured} />
          </section>
        )}

        <section className={styles.list} aria-labelledby="blog-list-title">
          <div className={styles.listHead}>
            <h2 id="blog-list-title" className={styles.listTitle}>
              {heading}
            </h2>
            <span className={`mono ${styles.total}`}>{t("total", { count: result.total, padded: pad2(result.total) })}</span>
          </div>

          {result.total === 0 ? (
            <div className={`swap ${styles.empty}`} role="status">
              <p>{t("empty")}</p>
              <Link href={{ pathname: ROUTES.blog }} className="ul">
                {t("clearFilters")}
              </Link>
            </div>
          ) : (
            <ol className={styles.posts}>
              {result.pages.flatMap((posts, pageIndex) =>
                posts.map((post, i) => {
                  const pageNumber = firstPage + pageIndex;
                  return (
                    <PostListItem
                      key={post.id}
                      post={post}
                      position={(pageNumber - 1) * pageSize + i + 1}
                      delay={(pageNumber === result.page ? i : 0) * 0.07}
                      className={pageNumber < result.page ? styles.earlier : undefined}
                    />
                  );
                }),
              )}
            </ol>
          )}

          {result.page < result.pageCount && (
            <LoadMoreLink href={href({ page: result.page + 1 })} label={t("loadMore")} className={styles.loadMore} />
          )}
          <Pagination
            page={result.page}
            pageCount={result.pageCount}
            hrefFor={(page) => href({ page })}
            label={t("pagination")}
            pageLabel={(page) => t("page", { page })}
            previousLabel={t("previousPage")}
            nextLabel={t("nextPage")}
            className={styles.pagination}
          />
        </section>
      </div>
    </main>
  );
}
