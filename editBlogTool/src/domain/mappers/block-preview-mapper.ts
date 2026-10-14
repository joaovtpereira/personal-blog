import type { ContentBlock } from "@/domain/entities";
import type { FreeBlock } from "../entities";

/** Bloco do editor → bloco do Design System do blog (para pré-visualizar com o ContentRenderer). */
export interface BlockPreviewMapper {
  toContentBlock(block: FreeBlock): ContentBlock;
  lead(text: string): ContentBlock;
}
