import { ContactMessageSender, FeaturedStudies, LatestPosts, Projects } from "@/data/use-cases";
import type { GetFeaturedStudies, GetLatestPosts, GetProjects, SendContactMessage } from "@/domain/use-cases";
import { EXTERNAL } from "@/main/routes";
import { makePostsDataSource, makeProjectsDataSource, makeStudiesDataSource } from "../infra/data-sources";
import { makeEmailSender } from "../infra/email-sender";
import { makeContactMessageMapper, makePostMapper, makeProjectMapper, makeStudyMapper } from "../mappers/mappers";

export const makeGetLatestPosts = (): GetLatestPosts => new LatestPosts(makePostsDataSource(), makePostMapper());

export const makeGetFeaturedStudies = (): GetFeaturedStudies =>
  new FeaturedStudies(makeStudiesDataSource(), makeStudyMapper());

export const makeGetProjects = (): GetProjects => new Projects(makeProjectsDataSource(), makeProjectMapper());

export const makeSendContactMessage = (): SendContactMessage =>
  new ContactMessageSender(makeEmailSender(), makeContactMessageMapper(), EXTERNAL.email);
