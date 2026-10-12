import { collectionPositionOf, type CollectionPosition, type Locale, type Post, type PostPage } from "@/domain/entities";
import type { PostDetailMapper, PostMapper } from "@/domain/mappers";
import type { CollectionModel, PostContentModel, PostModel } from "@/domain/models";
import type { GetPostPage, GetPostRoutes } from "@/domain/use-cases";
import type { CollectionDataSource } from "@/shared/data-source";
import { toLocale } from "../mappers/locale";

type Sources = {
  posts: CollectionDataSource<PostModel>;
  contents: CollectionDataSource<PostContentModel>;
  collections: CollectionDataSource<CollectionModel>;
};

/** Quantos "Outros pensamentos" mostrar. */
const OTHER_THOUGHTS = 2;

export class PostPageLoader implements GetPostPage {
  constructor(
    private readonly sources: Sources,
    private readonly detailMapper: PostDetailMapper,
    private readonly postMapper: PostMapper,
  ) {}

  async execute({ locale, slug }: { locale: Locale; slug: string }): Promise<PostPage | null> {
    const [posts, contents, collections] = await Promise.all([
      this.sources.posts.findAll(),
      this.sources.contents.findAll(),
      this.sources.collections.findAll(),
    ]);

    const model = posts.find((item) => item.locale === locale && item.slug === slug);
    if (!model) return null;
    const content = contents.find((item) => item.post_id === model.id && item.locale === locale);
    if (!content) return null;

    const detail = this.detailMapper.toEntity(model, content);
    const localePosts = posts
      .filter((item) => item.locale === locale)
      .map((item) => this.postMapper.toEntity(item))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    const collection = this.collectionOf(model, localePosts, collections, locale);

    return { detail, collection, related: this.related(detail.post, localePosts, collection) };
  }

  private collectionOf(post: PostModel, posts: Post[], collections: CollectionModel[], locale: Locale): CollectionPosition | null {
    const collection = collections.find(
      (item) =>
        item.locale === locale &&
        item.kind === "resenhas" &&
        item.items.some((entry) => entry.status === "publicado" && entry.ref_id === post.id),
    );
    if (!collection) return null;
    const items = collection.items
      .filter((entry) => entry.status === "publicado" && entry.ref_id)
      .map((entry) => posts.find((item) => item.id === entry.ref_id))
      .filter((item): item is Post => !!item)
      .map((item) => ({ slug: item.slug, title: item.title }));
    return collectionPositionOf({ kind: "reviews", id: collection.id, slug: collection.slug, name: collection.name }, items, post.slug);
  }

  /**
   * Regras: resenha → próxima parte da coleção; sem ela, a resenha mais recente (1 item).
   * Pensamento → outros pensamentos, primeiro os que dividem tags, depois os mais recentes.
   */
  private related(post: Post, posts: Post[], collection: CollectionPosition | null): Post[] {
    const others = posts.filter((item) => item.id !== post.id);
    if (post.kind === "thought") {
      const thoughts = others.filter((item) => item.kind === "thought");
      const shared = (item: Post) => item.tags.filter((tag) => post.tags.includes(tag)).length;
      return [...thoughts].sort((a, b) => shared(b) - shared(a)).slice(0, OTHER_THOUGHTS);
    }
    const nextInCollection = collection?.next ? others.find((item) => item.slug === collection.next?.slug) : undefined;
    const fallback = others.find((item) => item.kind !== "thought");
    const next = nextInCollection ?? fallback;
    return next ? [next] : [];
  }
}

export class PostRoutesLoader implements GetPostRoutes {
  constructor(
    private readonly posts: CollectionDataSource<PostModel>,
    private readonly contents: CollectionDataSource<PostContentModel>,
  ) {}

  async execute(): Promise<{ locale: Locale; slug: string }[]> {
    const [posts, contents] = await Promise.all([this.posts.findAll(), this.contents.findAll()]);
    return posts
      .filter((post) => contents.some((content) => content.post_id === post.id && content.locale === post.locale))
      .map((post) => ({ locale: toLocale(post.locale), slug: post.slug }));
  }
}
