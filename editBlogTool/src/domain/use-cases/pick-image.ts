import type { ImageRef } from "../entities";

/** Abre o seletor de imagens do sistema. null = cancelado. */
export interface PickImage {
  pick(): Promise<ImageRef | null>;
}
