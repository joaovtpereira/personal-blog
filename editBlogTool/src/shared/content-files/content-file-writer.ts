import type { WriteResultModel } from "@editor/domain/models";

/** Gravação no repositório do blog. Caminhos sempre relativos à raiz do blog. */
export interface ContentFileWriter {
  exists(relativePath: string): Promise<boolean>;
  writeMarkdown(relativePath: string, content: string): Promise<WriteResultModel>;
  copyImage(sourcePath: string, relativeDestination: string): Promise<WriteResultModel>;
}
