import type { ContentFileSource } from "@/shared/content";
import type { ContentFileReader } from "@editor/shared/content-files";

/** Os .md do blog lidos pelo processo do Electron, no contrato de leitura do blog. */
export class ElectronContentFileSource implements ContentFileSource {
  constructor(private readonly reader: ContentFileReader) {}

  async list(): Promise<string[]> {
    return (await this.reader.list()).map((entry) => entry.path);
  }

  read(path: string): Promise<string> {
    return this.reader.read(path);
  }
}
