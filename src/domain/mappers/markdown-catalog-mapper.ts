import type { ContentFileInfo } from "../entities";
import type { ContentCatalogModel, ParsedDocumentModel } from "../models";

/** Um .md de content/ já lido: caminho, o que o caminho diz (tipo, idioma, slug) e o documento. */
export type ContentFileModel = {
  path: string;
  info: ContentFileInfo;
  document: ParsedDocumentModel;
};

/** Traduz os .md (frontmatter + blocos) para os models que os casos de uso do blog já usam. */
export interface MarkdownCatalogMapper {
  toCatalog(files: ContentFileModel[]): ContentCatalogModel;
}
