import {
  CollectionModelMapper,
  ContactMessageModelMapper,
  ContentBlockModelMapper,
  LessonModelMapper,
  PublicCommentModelMapper,
  PostDetailModelMapper,
  PostModelMapper,
  ProjectModelMapper,
  ResumeModelMapper,
  StudyModelMapper,
  StudyProgressModelMapper,
} from "@/data/mappers";
import type {
  CollectionMapper,
  ContactMessageMapper,
  LessonMapper,
  PublicCommentMapper,
  PostDetailMapper,
  PostMapper,
  ProjectMapper,
  ResumeMapper,
  StudyMapper,
  StudyProgressMapper,
} from "@/domain/mappers";

export const makePostMapper = (): PostMapper => new PostModelMapper();

export const makeStudyMapper = (): StudyMapper => new StudyModelMapper();

export const makeProjectMapper = (): ProjectMapper => new ProjectModelMapper();

export const makeContactMessageMapper = (): ContactMessageMapper => new ContactMessageModelMapper();

export const makeResumeMapper = (): ResumeMapper => new ResumeModelMapper();

export const makeStudyProgressMapper = (): StudyProgressMapper => new StudyProgressModelMapper();

export const makeLessonMapper = (): LessonMapper => new LessonModelMapper(new ContentBlockModelMapper());

export const makePublicCommentMapper = (): PublicCommentMapper => new PublicCommentModelMapper();

export const makeCollectionMapper = (): CollectionMapper => new CollectionModelMapper();

export const makePostDetailMapper = (): PostDetailMapper =>
  new PostDetailModelMapper(new PostModelMapper(), new ContentBlockModelMapper());
