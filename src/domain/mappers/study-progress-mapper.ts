import type { StudyProgress } from "../entities";
import type { StudyProgressModel } from "../models";
import type { Mapper } from "./mapper";

export type StudyProgressMapper = Mapper<StudyProgressModel, StudyProgress>;
