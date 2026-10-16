import { MarkdownCatalogModelMapper } from "@/data/mappers";
import { FsContentFileSource, MarkdownContentCatalog } from "@/infra/content";
import { DirectiveMarkdownParser } from "@/infra/markdown";
import type { ContentCatalog } from "@/shared/content";

let catalog: ContentCatalog | null = null;

/** Leitura direta dos .md de content/ (sem cache: o cache do Next fica em main/cache). */
export const makeFileContentCatalog = (): ContentCatalog =>
  (catalog ??= new MarkdownContentCatalog(
    new FsContentFileSource(),
    new DirectiveMarkdownParser(),
    new MarkdownCatalogModelMapper((message) => console.warn(message)),
    false,
  ));
