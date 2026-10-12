import { ContactMessageSender, FeaturedStudies, LatestPosts, Projects, ResumeLoader } from "@/data/use-cases";
import type {
  GetFeaturedStudies,
  GetLatestPosts,
  GetProjects,
  GetResume,
  SendContactMessage,
} from "@/domain/use-cases";
import { EXTERNAL } from "@/main/routes";
import {
  makePostsDataSource,
  makeProjectsDataSource,
  makeResumeDataSource,
  makeStudiesDataSource,
} from "../infra/data-sources";
import { makeEmailSender } from "../infra/email-sender";
import {
  makeContactMessageMapper,
  makePostMapper,
  makeProjectMapper,
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
