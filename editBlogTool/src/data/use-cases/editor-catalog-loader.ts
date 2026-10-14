import type { CollectionModel, PostModel, StudyModel } from "@/domain/models";
import type { EditorCatalog, ReviewSeries } from "@editor/domain/entities";
import type { GetEditorCatalog } from "@editor/domain/use-cases";
import type { CollectionDataSource } from "@editor/shared/data-source";

/** O editor escreve em português: busca o conteúdo publicado em pt. */
const LOCALE = "pt";

export class EditorCatalogLoader implements GetEditorCatalog {
  constructor(
    private readonly posts: CollectionDataSource<PostModel>,
    private readonly collections: CollectionDataSource<CollectionModel>,
    private readonly studies: CollectionDataSource<StudyModel>,
  ) {}

  async load(): Promise<EditorCatalog> {
    const [allPosts, allCollections, allStudies] = await Promise.all([
      this.posts.findAll(),
      this.collections.findAll(),
      this.studies.findAll(),
    ]);
    const posts = allPosts.filter((p) => p.locale === LOCALE);
    const studies = allStudies.filter((s) => s.locale === LOCALE).sort((a, b) => a.order - b.order);
    const series = allCollections.filter((c) => c.locale === LOCALE && c.kind === "resenhas");

    const toSeries = (c: CollectionModel): ReviewSeries => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      publishedCount: c.items.filter((item) => item.status === "publicado").length,
    });
    const seriesOf = (postId: string) => series.find((c) => c.items.some((item) => item.ref_id === postId)) ?? null;
    const postType = (id: string | null) => posts.find((p) => p.id === id)?.type;

    const byNewest = (a: PostModel, b: PostModel) => b.published_at.localeCompare(a.published_at);

    return {
      previousBookReviews: posts
        .filter((p) => p.type === "resenha-livro")
        .sort(byNewest)
        .map((p) => {
          const s = seriesOf(p.id);
          return { id: p.id, slug: p.slug, title: p.title, series: s ? toSeries(s) : null };
        }),
      gameCollections: series.filter((c) => c.items.some((item) => postType(item.ref_id) === "resenha-jogo")).map(toSeries),
      studies: studies.map((s) => ({ id: s.id, slug: s.slug, title: s.title, lessonCount: s.lessons.length })),
      tags: [...new Set([...posts, ...studies].flatMap((item) => item.tags))].sort((a, b) => a.localeCompare(b, "pt")),
    };
  }
}
