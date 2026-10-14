import { fileNameOf, kindOfPath, type ContentFileSummary } from "@editor/domain/entities";
import type { ListContentFiles } from "@editor/domain/use-cases";
import type { ContentFileReader } from "@editor/shared/content-files";
import type { MarkdownParser } from "@editor/shared/markdown";

/** Posts e aulas em content/post, com o título lido do frontmatter. */
export class ContentFileCatalog implements ListContentFiles {
  constructor(
    private readonly reader: ContentFileReader,
    private readonly parser: MarkdownParser,
  ) {}

  async list(): Promise<ContentFileSummary[]> {
    const entries = (await this.reader.list()).flatMap((entry) => {
      const kind = kindOfPath(entry.path);
      return kind ? [{ ...entry, kind }] : [];
    });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const title = await this.reader
          .read(entry.path)
          .then((text) => this.parser.parse(text).frontmatter.title)
          .catch(() => null);
        return { ...entry, title: typeof title === "string" && title.trim() ? title : fileNameOf(entry.path) };
      }),
    );
    return files.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
  }
}
