import type { DraftReport, EditorCatalog, EditorWorkspace } from "../entities";

/** Confere os campos obrigatórios do tipo aberto e as recomendações de publicação. */
export interface ValidateDraft {
  validate(workspace: EditorWorkspace, catalog: EditorCatalog): DraftReport;
}
