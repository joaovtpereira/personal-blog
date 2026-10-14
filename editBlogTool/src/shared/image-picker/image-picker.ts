import type { PickedImageModel } from "@editor/domain/models";

/** Seletor de imagem do sistema operacional. */
export interface ImagePicker {
  pick(): Promise<PickedImageModel | null>;
  /** URL para exibir a imagem local dentro do editor. */
  previewUrlOf(path: string): string;
}
