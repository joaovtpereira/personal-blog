import type { EditorWorkspace } from "../entities";

/** Recupera o rascunho salvo neste computador. */
export interface LoadWorkspace {
  load(): EditorWorkspace | null;
}

/** Salva o rascunho a cada mudança (sobrevive a fechar o app). */
export interface SaveWorkspace {
  save(workspace: EditorWorkspace): void;
}
