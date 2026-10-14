import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import type { ImageAssetSource } from "@/shared/image";

const PUBLIC_DIR = join(process.cwd(), "public");

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

/** Imagens de /public viram data URI (funciona no build, sem servidor); URLs http(s) passam direto. */
export class PublicImageAssetSource implements ImageAssetSource {
  async resolve(src: string): Promise<string | null> {
    if (/^https?:\/\//.test(src) || src.startsWith("data:")) return src;
    if (!src.startsWith("/")) return null;

    const file = normalize(join(PUBLIC_DIR, src));
    const mime = MIME[extname(file).toLowerCase()];
    if (!file.startsWith(PUBLIC_DIR) || !mime) return null;
    try {
      const data = await readFile(file);
      return `data:${mime};base64,${data.toString("base64")}`;
    } catch {
      return null;
    }
  }
}
