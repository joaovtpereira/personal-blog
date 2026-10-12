import type { Study } from "../entities";
import type { StudyModel } from "../models";
import type { Mapper } from "./mapper";

export type StudyMapper = Mapper<StudyModel, Study>;
