import type { ContentCatalogModel } from "@/domain/models";

/** Todo o conteúdo publicado (posts, aulas, estudos, coleções) já como models. */
export interface ContentCatalog {
  load(): Promise<ContentCatalogModel>;
}
