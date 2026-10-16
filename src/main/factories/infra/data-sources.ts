import type {
  CollectionModel,
  LessonModel,
  PostContentModel,
  PostModel,
  ProjectModel,
  ResumeModel,
  StudyModel,
} from "@/domain/models";
import { CatalogDataSource, InMemoryDataSource } from "@/infra/data-source";
import { PROJECTS_MOCK, RESUME_MOCK } from "@/infra/mocks";
import { CachedContentCatalog } from "@/main/cache/cached-content-catalog";
import type { ContentCatalog } from "@/shared/content";
import type { CollectionDataSource } from "@/shared/data-source";

/* Posts, aulas, estudos e coleções vêm dos .md em content/ (gravados pelo editor em editBlogTool). */

/** Uma instância: a leitura dos arquivos e o cache do Next ficam em content-catalog.ts e main/cache. */
const catalog: ContentCatalog = new CachedContentCatalog();
const makeContentCatalog = (): ContentCatalog => catalog;

export const makePostsDataSource = (): CollectionDataSource<PostModel> => new CatalogDataSource(makeContentCatalog(), "posts");

export const makePostContentsDataSource = (): CollectionDataSource<PostContentModel> =>
  new CatalogDataSource(makeContentCatalog(), "postContents");

export const makeStudiesDataSource = (): CollectionDataSource<StudyModel> => new CatalogDataSource(makeContentCatalog(), "studies");

export const makeLessonsDataSource = (): CollectionDataSource<LessonModel> => new CatalogDataSource(makeContentCatalog(), "lessons");

export const makeCollectionsDataSource = (): CollectionDataSource<CollectionModel> =>
  new CatalogDataSource(makeContentCatalog(), "collections");

/* Ainda sem back-end/markdown: projetos e currículo seguem mockados. Comentários e reações: factories/infra/feedback.ts. */
export const makeProjectsDataSource = (): CollectionDataSource<ProjectModel> => new InMemoryDataSource(PROJECTS_MOCK);

export const makeResumeDataSource = (): CollectionDataSource<ResumeModel> => new InMemoryDataSource(RESUME_MOCK);
