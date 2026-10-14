import type { ContentBlock } from "@/domain/entities";
import type { ContentBlockMapper } from "@/domain/mappers";
import type { ContentBlockModel } from "@/domain/models";
import type { FreeBlock } from "@editor/domain/entities";
import type { BlockPreviewMapper, EditorBlockMapper } from "@editor/domain/mappers";

/** Reaproveita o ContentBlockModelMapper do blog: editor → model do markdown → entidade do DS. */
export class ContentPreviewMapper implements BlockPreviewMapper {
  constructor(
    private readonly editorBlocks: EditorBlockMapper,
    private readonly blogBlocks: ContentBlockMapper,
  ) {}

  toContentBlock(block: FreeBlock): ContentBlock {
    if (block.type === "raw") {
      return this.blogBlocks.toEntity({ type: "callout", tone: "atencao", title: "MARKDOWN NÃO RECONHECIDO · MANTIDO COMO ESTÁ", text: block.markdown });
    }
    const model = this.editorBlocks.toModel(block) as ContentBlockModel;
    // O título do DS não tem itálico inline: a palavra de destaque aparece sem os asteriscos.
    if (model.type === "heading") return this.blogBlocks.toEntity({ ...model, text: model.text.replace(/\*/g, "") });
    return this.blogBlocks.toEntity(model);
  }

  lead(text: string): ContentBlock {
    return this.blogBlocks.toEntity({ type: "lead", text });
  }
}
