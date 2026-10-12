import type { Resume } from "../entities";
import type { ResumeModel } from "../models";
import type { Mapper } from "./mapper";

export type ResumeMapper = Mapper<ResumeModel, Resume>;
