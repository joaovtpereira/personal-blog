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
import { InMemoryDataSource } from "@/infra/data-source";
import {
  COLLECTIONS_MOCK,
  LESSON_COMMENTS_MOCK,
  LESSONS_MOCK,
  POST_COMMENTS_MOCK,
  POST_CONTENTS_MOCK,
  POSTS_MOCK,
  PROJECTS_MOCK,
  RESUME_MOCK,
  STUDIES_MOCK,
} from "@/infra/mocks";
import type { CollectionDataSource } from "@/shared/data-source";

/* Trocar por fontes de markdown/API aqui, sem tocar nos casos de uso. */
export const makePostsDataSource = (): CollectionDataSource<PostModel> => new InMemoryDataSource(POSTS_MOCK);

export const makeStudiesDataSource = (): CollectionDataSource<StudyModel> => new InMemoryDataSource(STUDIES_MOCK);

export const makeProjectsDataSource = (): CollectionDataSource<ProjectModel> => new InMemoryDataSource(PROJECTS_MOCK);

export const makeResumeDataSource = (): CollectionDataSource<ResumeModel> => new InMemoryDataSource(RESUME_MOCK);

export const makeLessonsDataSource = (): CollectionDataSource<LessonModel> => new InMemoryDataSource(LESSONS_MOCK);

export const makeCollectionsDataSource = (): CollectionDataSource<CollectionModel> =>
  new InMemoryDataSource(COLLECTIONS_MOCK);

export const makeLessonCommentsDataSource = (): CollectionDataSource<LessonCommentModel> =>
  new InMemoryDataSource(LESSON_COMMENTS_MOCK);

export const makePostContentsDataSource = (): CollectionDataSource<PostContentModel> =>
  new InMemoryDataSource(POST_CONTENTS_MOCK);

export const makePostCommentsDataSource = (): CollectionDataSource<PostCommentModel> =>
  new InMemoryDataSource(POST_COMMENTS_MOCK);
