import { PostModelMapper, ProjectModelMapper, StudyModelMapper } from "@/data/mappers";
import type { PostMapper, ProjectMapper, StudyMapper } from "@/domain/mappers";

export const makePostMapper = (): PostMapper => new PostModelMapper();

export const makeStudyMapper = (): StudyMapper => new StudyModelMapper();

export const makeProjectMapper = (): ProjectMapper => new ProjectModelMapper();
