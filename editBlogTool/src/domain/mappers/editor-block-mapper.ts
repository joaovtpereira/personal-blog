import type { Mapper } from "@/domain/mappers/mapper";
import type { EditorBlock, ImageRef } from "../entities";
import type { DocumentBlockModel } from "../models";

/** Onde a imagem vai estar: URL de preview no editor ou URL pública depois de copiada. */
export type ImageUrlResolver = (image: ImageRef) => string;

/** URL gravada no arquivo → imagem exibível no editor. */
export type ImageReader = (url: string) => ImageRef;

/** Bloco do editor ⇄ bloco do markdown. Blocos fixos viram marcações de posição (slot). */
export interface EditorBlockMapper extends Mapper<DocumentBlockModel, EditorBlock> {
  toModel(entity: EditorBlock, resolveImage?: ImageUrlResolver): DocumentBlockModel;
  toEntity(model: DocumentBlockModel, readImage?: ImageReader): EditorBlock;
}
