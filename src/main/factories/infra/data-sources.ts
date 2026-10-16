import type {
  CollectionModel,
  LessonCommentModel,
  LessonModel,
  PostCommentModel,
  PostContentModel,
  PostModel,
  ProjectModel,
  ResumeModel,
  StudyModel,
} from "@/domain/models";
import { MarkdownCatalogModelMapper } from "@/data/mappers";
import { FsContentFileSource, MarkdownContentCatalog } from "@/infra/content";
import { CatalogDataSource, InMemoryDataSource } from "@/infra/data-source";
import { DirectiveMarkdownParser } from "@/infra/markdown";
import { LESSON_COMMENTS_MOCK, POST_COMMENTS_MOCK, PROJECTS_MOCK, RESUME_MOCK } from "@/infra/mocks";
import type { ContentCatalog } from "@/shared/content";
import type { CollectionDataSource } from "@/shared/data-source";

/* Posts, aulas, estudos e coleções vêm dos .md em content/ (gravados pelo editor em editBlogTool). */

let catalog: ContentCatalog | null = null;

/** Uma leitura de content/ por processo; em desenvolvimento relê a cada pedido para mostrar o arquivo salvo. */
const makeContentCatalog = (): ContentCatalog =>
  (catalog ??= new MarkdownContentCatalog(
    new FsContentFileSource(),
    new DirectiveMarkdownParser(),
    new MarkdownCatalogModelMapper((message) => console.warn(message)),
    process.env.NODE_ENV === "production",
  ));

export const makePostsDataSource = (): CollectionDataSource<PostModel> => new CatalogDataSource(makeContentCatalog(), "posts");

export const makePostContentsDataSource = (): CollectionDataSource<PostContentModel> =>
  new CatalogDataSource(makeContentCatalog(), "postContents");

export const makeStudiesDataSource = (): CollectionDataSource<StudyModel> => new CatalogDataSource(makeContentCatalog(), "studies");

export const makeLessonsDataSource = (): CollectionDataSource<LessonModel> => new CatalogDataSource(makeContentCatalog(), "lessons");

export const makeCollectionsDataSource = (): CollectionDataSource<CollectionModel> =>
  new CatalogDataSource(makeContentCatalog(), "collections");

/* Ainda sem back-end/markdown: projetos, currículo e comentários seguem mockados. */
export const makeProjectsDataSource = (): CollectionDataSource<ProjectModel> => new InMemoryDataSource(PROJECTS_MOCK);

export const makeResumeDataSource = (): CollectionDataSource<ResumeModel> => new InMemoryDataSource(RESUME_MOCK);

export const makeLessonCommentsDataSource = (): CollectionDataSource<LessonCommentModel> =>
  new InMemoryDataSource(LESSON_COMMENTS_MOCK);

export const makePostCommentsDataSource = (): CollectionDataSource<PostCommentModel> =>
  new InMemoryDataSource(POST_COMMENTS_MOCK);
