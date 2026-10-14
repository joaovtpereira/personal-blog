import type { ParsedDocumentModel } from "@editor/domain/models";

/** Lê o texto de um .md (frontmatter + blocos). O inverso do MarkdownSerializer. */
export interface MarkdownParser {
  parse(text: string): ParsedDocumentModel;
}
