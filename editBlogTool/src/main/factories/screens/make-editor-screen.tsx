import { EditorScreen } from "@editor/presentation/screens/editor";
import { makeBlockPreviewMapper, makeIdFactory } from "../mappers/mappers";
import {
  makeExportDraft,
  makeGetEditorCatalog,
  makeListContentFiles,
  makeLoadWorkspace,
  makeOpenContentFile,
  makePickContentFile,
  makePickImage,
  makeSaveWorkspace,
  makeValidateDraft,
} from "../use-cases/use-cases";

/* Instâncias criadas uma vez: a tela usa as mesmas em toda a sessão. */
const dependencies = {
  loadWorkspace: makeLoadWorkspace(),
  saveWorkspace: makeSaveWorkspace(),
  getCatalog: makeGetEditorCatalog(),
  validateDraft: makeValidateDraft(),
  exportDraft: makeExportDraft(),
  pickImage: makePickImage(),
  listContentFiles: makeListContentFiles(),
  openContentFile: makeOpenContentFile(),
  pickContentFile: makePickContentFile(),
  preview: makeBlockPreviewMapper(),
  newId: makeIdFactory(),
};

export function makeEditorScreen() {
  return <EditorScreen {...dependencies} />;
}
