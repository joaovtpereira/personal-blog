import { ContactMessageModelMapper, PostModelMapper, ProjectModelMapper, StudyModelMapper } from "@/data/mappers";
import type { ContactMessageMapper, PostMapper, ProjectMapper, StudyMapper } from "@/domain/mappers";

export const makePostMapper = (): PostMapper => new PostModelMapper();

export const makeStudyMapper = (): StudyMapper => new StudyModelMapper();

export const makeProjectMapper = (): ProjectMapper => new ProjectModelMapper();

export const makeContactMessageMapper = (): ContactMessageMapper => new ContactMessageModelMapper();
