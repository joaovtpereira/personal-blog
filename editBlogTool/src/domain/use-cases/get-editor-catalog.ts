import type { EditorCatalog } from "../entities";

/** Busca no blog as resenhas anteriores, coleções de jogos, estudos e tags existentes. */
export interface GetEditorCatalog {
  load(): Promise<EditorCatalog>;
}
