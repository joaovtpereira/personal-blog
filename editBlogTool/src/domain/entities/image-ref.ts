/** Imagem escolhida no computador. Só é copiada para o blog na exportação. */
export type ImageRef = {
  /** caminho absoluto do arquivo original */
  sourcePath: string;
  fileName: string;
  /** URL para exibir a imagem dentro do editor */
  previewUrl: string;
  /** URL pública quando a imagem já está em public/images do blog (não precisa copiar) */
  publicUrl?: string | null;
};
