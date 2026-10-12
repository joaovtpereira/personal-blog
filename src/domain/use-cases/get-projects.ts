import type { Locale, Project } from "../entities";

export type GetProjectsParams = {
  locale: Locale;
};

export interface GetProjects {
  execute(params: GetProjectsParams): Promise<Project[]>;
}
