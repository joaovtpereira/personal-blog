import {
  CachedWorkspaceStorage,
  ContentFileCatalog,
  DesktopContentPicker,
  DesktopImageSelector,
  DraftValidator,
  EditorCatalogLoader,
  MarkdownContentOpener,
  MarkdownDraftExporter,
} from "@editor/data/use-cases";
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
import { makeCache } from "../infra/cache";
import { makeCollectionsDataSource, makePostsDataSource, makeStudiesDataSource } from "../infra/data-sources";
import { makeContentFileReader, makeContentFileWriter, makeImagePicker, makeMarkdownParser, makeMarkdownSerializer } from "../infra/desktop";
import { makeLessonDocumentMapper, makePostDocumentMapper, makeWorkspaceCacheMapper } from "../mappers/mappers";

const makeWorkspaceStorage = () => new CachedWorkspaceStorage(makeCache(), makeWorkspaceCacheMapper());

export const makeLoadWorkspace = (): LoadWorkspace => makeWorkspaceStorage();

export const makeSaveWorkspace = (): SaveWorkspace => makeWorkspaceStorage();

export const makeGetEditorCatalog = (): GetEditorCatalog =>
  new EditorCatalogLoader(makePostsDataSource(), makeCollectionsDataSource(), makeStudiesDataSource());

export const makeValidateDraft = (): ValidateDraft => new DraftValidator();

export const makeExportDraft = (): ExportDraft =>
  new MarkdownDraftExporter(makeValidateDraft(), makePostDocumentMapper(), makeLessonDocumentMapper(), makeMarkdownSerializer(), makeContentFileWriter());

export const makePickImage = (): PickImage => new DesktopImageSelector(makeImagePicker());

export const makeListContentFiles = (): ListContentFiles => new ContentFileCatalog(makeContentFileReader(), makeMarkdownParser());

export const makeOpenContentFile = (): OpenContentFile =>
  new MarkdownContentOpener(makeContentFileReader(), makeMarkdownParser(), makePostDocumentMapper(), makeLessonDocumentMapper(), makeImagePicker());

export const makePickContentFile = (): PickContentFile => new DesktopContentPicker(makeContentFileReader());
