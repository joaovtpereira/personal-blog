import type { EditorWorkspace } from "../entities";
import type { WorkspaceCacheModel } from "../models";

/** Rascunho ⇄ cache. toEntity devolve null quando o cache é de outra versão ou está corrompido. */
export interface WorkspaceCacheMapper {
  toModel(entity: EditorWorkspace): WorkspaceCacheModel;
  toEntity(model: WorkspaceCacheModel | null): EditorWorkspace | null;
}
