import { promises as fs } from "node:fs";
import path from "node:path";
import { CONTENT_DIR } from "@/domain/entities";
import type { ContentFileSource } from "@/shared/content";

/** Lê os .md de content/ no disco (build e servidor). Pasta inexistente = nenhum conteúdo. */
export class FsContentFileSource implements ContentFileSource {
  constructor(private readonly root: string = process.cwd()) {}

  async list(): Promise<string[]> {
    return this.walk(path.join(this.root, CONTENT_DIR));
  }

  read(file: string): Promise<string> {
    const full = path.resolve(this.root, file);
    if (!full.startsWith(path.join(this.root, CONTENT_DIR) + path.sep)) throw new Error(`Fora de ${CONTENT_DIR}/: ${file}`);
    return fs.readFile(full, "utf8");
  }

  private async walk(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
    const nested = await Promise.all(
      entries.map((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return this.walk(full);
        return entry.isFile() && entry.name.endsWith(".md") ? [path.relative(this.root, full).split(path.sep).join("/")] : [];
      }),
    );
    return nested.flat().sort();
  }
}
