import { ContentBlockModelMapper } from "@/data/mappers";
import {
  ContentPreviewMapper,
  EditorBlockModelMapper,
  LessonDocumentModelMapper,
  PostDocumentModelMapper,
  StudyDocumentModelMapper,
  WorkspaceCacheModelMapper,
} from "@editor/data/mappers";
import type { IdFactory } from "@editor/domain/entities";
import type {
  BlockPreviewMapper,
  EditorBlockMapper,
  LessonDocumentMapper,
  PostDocumentMapper,
  StudyDocumentMapper,
  WorkspaceCacheMapper,
} from "@editor/domain/mappers";

export const makeIdFactory = (): IdFactory => () => crypto.randomUUID();

export const makeEditorBlockMapper = (): EditorBlockMapper => new EditorBlockModelMapper(makeIdFactory());

export const makePostDocumentMapper = (): PostDocumentMapper => new PostDocumentModelMapper(makeEditorBlockMapper(), makeIdFactory());

export const makeLessonDocumentMapper = (): LessonDocumentMapper => new LessonDocumentModelMapper(makeEditorBlockMapper(), makeIdFactory());

export const makeWorkspaceCacheMapper = (): WorkspaceCacheMapper => new WorkspaceCacheModelMapper();

/** Pré-visualização com o mapper de blocos do próprio blog. */
export const makeBlockPreviewMapper = (): BlockPreviewMapper => new ContentPreviewMapper(makeEditorBlockMapper(), new ContentBlockModelMapper());

export const makeStudyDocumentMapper = (): StudyDocumentMapper => new StudyDocumentModelMapper();
