import type { ContentEntryModel } from "@editor/domain/models";

/** Leitura dos .md do blog. Caminhos relativos à raiz do blog. */
export interface ContentFileReader {
  /** caminho absoluto da raiz do blog (para exibir imagens de public/) */
  blogRoot(): Promise<string>;
  list(): Promise<ContentEntryModel[]>;
  read(relativePath: string): Promise<string>;
  /** seletor de arquivo do sistema; null = cancelado */
  pick(): Promise<string | null>;
}
