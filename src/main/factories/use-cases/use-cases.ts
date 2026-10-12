import {
  CollectionLoader,
  CollectionRoutesLoader,
  ContactMessageSender,
  FeaturedPost,
  FeaturedStudies,
  LessonCommentModeration,
  LessonCommentsLoader,
  LatestPosts,
  PostCommentModeration,
  PostCommentsLoader,
  PostPageLoader,
  PostRoutesLoader,
  PostSearch,
  Projects,
  ResumeLoader,
  StudiesCatalog,
  StudyLessonLoader,
  StudyLessonRoutesLoader,
} from "@/data/use-cases";
import type {
  GetCollection,
  GetCollectionRoutes,
  GetFeaturedPost,
  GetFeaturedStudies,
  GetLessonComments,
  GetPostComments,
  GetPostPage,
  GetPostRoutes,
  GetLatestPosts,
  GetProjects,
  GetResume,
  GetStudies,
  GetStudyLesson,
  GetStudyLessonRoutes,
  PostLessonComment,
  PostPostComment,
  SearchPosts,
  SendContactMessage,
} from "@/domain/use-cases";
import { EXTERNAL } from "@/main/routes";
import {
  makeLessonCommentsDataSource,
  makeLessonsDataSource,
  makePostCommentsDataSource,
  makePostContentsDataSource,
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
  makePostDetailMapper,
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

export const makeSearchPosts = (): SearchPosts => new PostSearch(makePostsDataSource(), makePostMapper());

export const makeGetFeaturedPost = (): GetFeaturedPost => new FeaturedPost(makePostsDataSource(), makePostMapper());

export const makeGetPostPage = (): GetPostPage =>
  new PostPageLoader(
    { posts: makePostsDataSource(), contents: makePostContentsDataSource(), collections: makeCollectionsDataSource() },
    makePostDetailMapper(),
    makePostMapper(),
  );

export const makeGetPostRoutes = (): GetPostRoutes => new PostRoutesLoader(makePostsDataSource(), makePostContentsDataSource());

export const makeGetPostComments = (): GetPostComments => new PostCommentsLoader(makePostCommentsDataSource());

export const makePostPostComment = (): PostPostComment => new PostCommentModeration(makeEmailSender(), EXTERNAL.email);
