import type { PostModel, ProjectModel, ResumeModel, StudyModel } from "@/domain/models";
import { InMemoryDataSource } from "@/infra/data-source";
import { POSTS_MOCK, PROJECTS_MOCK, RESUME_MOCK, STUDIES_MOCK } from "@/infra/mocks";
import type { CollectionDataSource } from "@/shared/data-source";

/* Trocar por fontes de markdown/API aqui, sem tocar nos casos de uso. */
export const makePostsDataSource = (): CollectionDataSource<PostModel> => new InMemoryDataSource(POSTS_MOCK);

export const makeStudiesDataSource = (): CollectionDataSource<StudyModel> => new InMemoryDataSource(STUDIES_MOCK);

export const makeProjectsDataSource = (): CollectionDataSource<ProjectModel> => new InMemoryDataSource(PROJECTS_MOCK);

export const makeResumeDataSource = (): CollectionDataSource<ResumeModel> => new InMemoryDataSource(RESUME_MOCK);
