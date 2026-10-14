import { FileImageFontSource, PublicImageAssetSource } from "@/infra/image";
import type { ImageAssetSource, ImageFontSource } from "@/shared/image";

/* Só no servidor: leem arquivos do projeto. */

let fonts: ImageFontSource | null = null;

/** Uma instância por processo: as fontes ficam em memória depois da primeira imagem. */
export const makeImageFontSource = (): ImageFontSource => (fonts ??= new FileImageFontSource());

export const makeImageAssetSource = (): ImageAssetSource => new PublicImageAssetSource();
