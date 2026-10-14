export type ImageFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 500;
  style: "normal" | "italic";
};

/** Fontes do DS para gerar imagens (story e prévia do link) no servidor. */
export interface ImageFontSource {
  load(): Promise<ImageFont[]>;
}
