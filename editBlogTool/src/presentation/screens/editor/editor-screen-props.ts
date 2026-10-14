import type { IdFactory } from "@editor/domain/entities";
import type { BlockPreviewMapper } from "@editor/domain/mappers";
import type {
  ExportDraft,
  GetEditorCatalog,
  ListContentFiles,
  LoadWorkspace,
  OpenContentFile,
  PickContentFile,
  PickImage,
  SaveWorkspace,
  ValidateDraft,
} from "@editor/domain/use-cases";

/** Dependências da tela, injetadas pela factory (main/factories/screens). */
export type EditorScreenProps = {
  loadWorkspace: LoadWorkspace;
  saveWorkspace: SaveWorkspace;
  getCatalog: GetEditorCatalog;
  validateDraft: ValidateDraft;
  exportDraft: ExportDraft;
  pickImage: PickImage;
  listContentFiles: ListContentFiles;
  openContentFile: OpenContentFile;
  pickContentFile: PickContentFile;
  preview: BlockPreviewMapper;
  newId: IdFactory;
};
