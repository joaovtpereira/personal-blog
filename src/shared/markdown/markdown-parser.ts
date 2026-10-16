import type { ParsedDocumentModel } from "@/domain/models";

/** Lê o texto de um .md (frontmatter + blocos). */
export interface MarkdownParser {
  parse(text: string): ParsedDocumentModel;
}
