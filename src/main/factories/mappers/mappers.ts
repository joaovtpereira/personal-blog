import {
  ContactMessageModelMapper,
  PostModelMapper,
  ProjectModelMapper,
  ResumeModelMapper,
  StudyModelMapper,
} from "@/data/mappers";
import type { ContactMessageMapper, PostMapper, ProjectMapper, ResumeMapper, StudyMapper } from "@/domain/mappers";

export const makePostMapper = (): PostMapper => new PostModelMapper();

export const makeStudyMapper = (): StudyMapper => new StudyModelMapper();

export const makeProjectMapper = (): ProjectMapper => new ProjectModelMapper();

export const makeContactMessageMapper = (): ContactMessageMapper => new ContactMessageModelMapper();

export const makeResumeMapper = (): ResumeMapper => new ResumeModelMapper();
