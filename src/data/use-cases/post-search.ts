import { matchesSearch, normalizeSearch, POST_KINDS, type Post, type PostKind } from "@/domain/entities";
import type { PostMapper } from "@/domain/mappers";
import type { PostModel } from "@/domain/models";
import type { GetFeaturedPost, PostSearchResult, SearchPosts, SearchPostsParams } from "@/domain/use-cases";
import type { CollectionDataSource } from "@/shared/data-source";

const byNewest = (a: Post, b: Post) => b.publishedAt.localeCompare(a.publishedAt);

/** Busca, filtra e pagina os textos do blog no servidor. */
export class PostSearch implements SearchPosts {
  constructor(
    private readonly dataSource: CollectionDataSource<PostModel>,
    private readonly mapper: PostMapper,
  ) {}

  async execute({ locale, kind, tag, query, page, pageSize, fromPage }: SearchPostsParams): Promise<PostSearchResult> {
    const models = await this.dataSource.findAll();
    const all = models
      .filter((model) => model.locale === locale)
      .map((model) => this.mapper.toEntity(model))
      .sort(byNewest);

    const wantedTag = tag ? normalizeSearch(tag) : null;
    const matchesTag = (post: Post) => !wantedTag || post.tags.some((item) => normalizeSearch(item) === wantedTag);
    const searched = all.filter((post) => matchesTag(post) && matchesSearch(post, query ?? ""));
    const filtered = kind ? searched.filter((post) => post.kind === kind) : searched;

    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    const current = Math.min(Math.max(1, page), pageCount);
    const start = Math.min(Math.max(1, fromPage ?? current), current);
    const pages = Array.from({ length: current - start + 1 }, (_, i) =>
      filtered.slice((start + i - 1) * pageSize, (start + i) * pageSize),
    );

    const counts = Object.fromEntries([
      ["all", searched.length],
      ...POST_KINDS.map((item) => [item, searched.filter((post) => post.kind === item).length]),
    ]) as Record<PostKind | "all", number>;

    const frequency = new Map<string, number>();
    all.forEach((post) => post.tags.forEach((item) => frequency.set(item, (frequency.get(item) ?? 0) + 1)));
    const tags = [...frequency.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([name]) => name);

    return { pages, total: filtered.length, page: current, pageCount, counts, tags };
  }
}

export class FeaturedPost implements GetFeaturedPost {
  constructor(
    private readonly dataSource: CollectionDataSource<PostModel>,
    private readonly mapper: PostMapper,
  ) {}

  async execute({ locale }: { locale: string }): Promise<Post | null> {
    const models = await this.dataSource.findAll();
    const posts = models
      .filter((model) => model.locale === locale)
      .map((model) => this.mapper.toEntity(model))
      .sort(byNewest);
    return posts.find((post) => post.featured) ?? posts[0] ?? null;
  }
}
