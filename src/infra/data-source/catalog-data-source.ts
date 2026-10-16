import type { ContentCatalogModel } from "@/domain/models";
import type { ContentCatalog } from "@/shared/content";
import type { CollectionDataSource } from "@/shared/data-source";

/** Uma lista do catálogo de conteúdo (posts, aulas...) como fonte de dados dos casos de uso. */
export class CatalogDataSource<K extends keyof ContentCatalogModel> implements CollectionDataSource<ContentCatalogModel[K][number]> {
  constructor(
    private readonly catalog: ContentCatalog,
    private readonly key: K,
  ) {}

  async findAll(): Promise<ContentCatalogModel[K][number][]> {
    const catalog = await this.catalog.load();
    return structuredClone(catalog[this.key]) as ContentCatalogModel[K][number][];
  }
}
