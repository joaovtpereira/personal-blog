import type { Project } from "../entities";
import type { ProjectModel } from "../models";
import type { Mapper } from "./mapper";

export type ProjectMapper = Mapper<ProjectModel, Project>;
