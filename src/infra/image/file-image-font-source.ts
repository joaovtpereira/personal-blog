import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ImageFont, ImageFontSource } from "@/shared/image";

const FONT_DIR = join(process.cwd(), "src/assets/fonts");

const FONTS: (Omit<ImageFont, "data"> & { file: string })[] = [
  { name: "Geist", weight: 400, style: "normal", file: "Geist-Regular.ttf" },
  { name: "Geist", weight: 500, style: "normal", file: "Geist-Medium.ttf" },
  { name: "Geist Mono", weight: 400, style: "normal", file: "GeistMono-Regular.ttf" },
  { name: "Instrument Serif", weight: 400, style: "italic", file: "InstrumentSerif-Italic.ttf" },
];

/** Lê os .ttf de src/assets/fonts uma vez e reaproveita. */
export class FileImageFontSource implements ImageFontSource {
  private cache: Promise<ImageFont[]> | null = null;

  load(): Promise<ImageFont[]> {
    this.cache ??= Promise.all(
      FONTS.map(async ({ file, ...font }) => {
        const buffer = await readFile(join(FONT_DIR, file));
        const data = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
        return { ...font, data };
      }),
    );
    return this.cache;
  }
}
