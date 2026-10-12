import { FeaturedStudies, LatestPosts, Projects } from "@/data/use-cases";
import type { GetFeaturedStudies, GetLatestPosts, GetProjects } from "@/domain/use-cases";
import { makePostsDataSource, makeProjectsDataSource, makeStudiesDataSource } from "../infra/data-sources";
import { makePostMapper, makeProjectMapper, makeStudyMapper } from "../mappers/mappers";

export const makeGetLatestPosts = (): GetLatestPosts => new LatestPosts(makePostsDataSource(), makePostMapper());

export const makeGetFeaturedStudies = (): GetFeaturedStudies =>
  new FeaturedStudies(makeStudiesDataSource(), makeStudyMapper());

export const makeGetProjects = (): GetProjects => new Projects(makeProjectsDataSource(), makeProjectMapper());
