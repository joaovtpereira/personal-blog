import type { MarkdownDocumentModel } from "@editor/domain/models";

/** Transforma o documento (frontmatter + blocos) no texto do arquivo .md. */
export interface MarkdownSerializer {
  serialize(document: MarkdownDocumentModel): string;
}
