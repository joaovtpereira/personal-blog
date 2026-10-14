import type { ContentSource, EditorCatalog, EditorWorkspace } from "../entities";

export type ExportedFile = { path: string; kind: "markdown" | "image"; overwritten: boolean };

/** Arquivo gravado por rascunho: depois de salvar, o rascunho passa a editar este arquivo. */
export type SavedSource = { lessonId: string | null; source: ContentSource };

export type ExportResult = { files: ExportedFile[]; saved: SavedSource[] };

/**
 * Grava o rascunho aberto como markdown no repositório do blog e copia as imagens para public/images.
 * Rascunho aberto de um arquivo substitui o próprio arquivo (mesmo nome, id e data de publicação).
 */
export interface ExportDraft {
  /** Arquivos .md que serão gravados (para mostrar antes de exportar). */
  targets(workspace: EditorWorkspace, catalog: EditorCatalog): string[];
  export(workspace: EditorWorkspace, catalog: EditorCatalog): Promise<ExportResult>;
}
