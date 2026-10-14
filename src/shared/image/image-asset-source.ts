/** Resolve uma imagem do conteúdo (capa, captura) para algo que o gerador de imagem consegue desenhar. */
export interface ImageAssetSource {
  /** Data URI ou URL absoluta; null quando não dá para carregar. */
  resolve(src: string): Promise<string | null>;
}
