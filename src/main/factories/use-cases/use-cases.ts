import {
  CollectionLoader,
  CollectionRoutesLoader,
  ContactMessageSender,
  FeaturedStudies,
  LessonCommentModeration,
  LessonCommentsLoader,
  LatestPosts,
  Projects,
  ResumeLoader,
  StudiesCatalog,
  StudyLessonLoader,
  StudyLessonRoutesLoader,
} from "@/data/use-cases";
import type {
  GetCollection,
  GetCollectionRoutes,
  GetFeaturedStudies,
  GetLessonComments,
  GetLatestPosts,
  GetProjects,
  GetResume,
  GetStudies,
  GetStudyLesson,
  GetStudyLessonRoutes,
  PostLessonComment,
  SendContactMessage,
} from "@/domain/use-cases";
import { EXTERNAL } from "@/main/routes";
import {
  makeLessonCommentsDataSource,
  makeLessonsDataSource,
  makePostsDataSource,
  makeProjectsDataSource,
  makeResumeDataSource,
  makeStudiesDataSource,
  makeCollectionsDataSource,
} from "../infra/data-sources";
import { makeEmailSender } from "../infra/email-sender";
import {
  makeCollectionMapper,
  makeContactMessageMapper,
  makeLessonMapper,
  makePostMapper,
  makeProjectMapper,
  makePublicCommentMapper,
  makeResumeMapper,
  makeStudyMapper,
} from "../mappers/mappers";

export const makeGetLatestPosts = (): GetLatestPosts => new LatestPosts(makePostsDataSource(), makePostMapper());

export const makeGetFeaturedStudies = (): GetFeaturedStudies =>
  new FeaturedStudies(makeStudiesDataSource(), makeStudyMapper());

export const makeGetProjects = (): GetProjects => new Projects(makeProjectsDataSource(), makeProjectMapper());

export const makeSendContactMessage = (): SendContactMessage =>
  new ContactMessageSender(makeEmailSender(), makeContactMessageMapper(), EXTERNAL.email);

export const makeGetResume = (): GetResume => new ResumeLoader(makeResumeDataSource(), makeResumeMapper());

export const makeGetStudies = (): GetStudies => new StudiesCatalog(makeStudiesDataSource(), makeStudyMapper());

export const makeGetStudyLesson = (): GetStudyLesson =>
  new StudyLessonLoader(
    {
      studies: makeStudiesDataSource(),
      lessons: makeLessonsDataSource(),
      collections: makeCollectionsDataSource(),
    },
    makeStudyMapper(),
    makeLessonMapper(),
  );

export const makeGetStudyLessonRoutes = (): GetStudyLessonRoutes =>
  new StudyLessonRoutesLoader(makeStudiesDataSource(), makeLessonsDataSource());

export const makeGetLessonComments = (): GetLessonComments =>
  new LessonCommentsLoader(makeLessonCommentsDataSource(), makePublicCommentMapper());

export const makePostLessonComment = (): PostLessonComment =>
  new LessonCommentModeration(makeEmailSender(), EXTERNAL.email);

export const makeGetCollection = (): GetCollection =>
  new CollectionLoader(
    {
      collections: makeCollectionsDataSource(),
      studies: makeStudiesDataSource(),
      lessons: makeLessonsDataSource(),
      posts: makePostsDataSource(),
    },
    makeCollectionMapper(),
    makePostMapper(),
  );

export const makeGetCollectionRoutes = (): GetCollectionRoutes => new CollectionRoutesLoader(makeCollectionsDataSource());
