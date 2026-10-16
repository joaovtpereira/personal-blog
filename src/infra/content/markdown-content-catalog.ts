import { contentFileInfo } from "@/domain/entities";
import type { ContentFileModel, MarkdownCatalogMapper } from "@/domain/mappers";
import type { ContentCatalogModel } from "@/domain/models";
import type { ContentCatalog, ContentFileSource } from "@/shared/content";
import type { MarkdownParser } from "@/shared/markdown";

/**
 * Lê todos os .md de content/, interpreta e traduz para models. O resultado fica em memória
 * (`cache: true`, padrão em produção); em desenvolvimento cada leitura pega o arquivo atual.
 */
export class MarkdownContentCatalog implements ContentCatalog {
  private pending: Promise<ContentCatalogModel> | null = null;

  constructor(
    private readonly source: ContentFileSource,
    private readonly parser: MarkdownParser,
    private readonly mapper: MarkdownCatalogMapper,
    private readonly cache = true,
  ) {}

  load(): Promise<ContentCatalogModel> {
    if (!this.cache) return this.read();
    this.pending ??= this.read().catch((error) => {
      this.pending = null;
      throw error;
    });
    return this.pending;
  }

  private async read(): Promise<ContentCatalogModel> {
    const paths = await this.source.list();
    const files = await Promise.all(
      paths.map(async (path): Promise<ContentFileModel[]> => {
        const info = contentFileInfo(path);
        if (!info) return [];
        const document = this.parser.parse(await this.source.read(path));
        return [{ path, info, document }];
      }),
    );
    return this.mapper.toCatalog(files.flat());
  }
}
