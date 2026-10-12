import {
  CachedGetStudyProgress,
  CachedSetLessonCompleted,
  CachedWatchStudyProgress,
} from "@/data/use-cases/cached-study-progress";
import type { GetStudyProgress, SetLessonCompleted, WatchStudyProgress } from "@/domain/use-cases";
import { makeBrowserCache } from "../infra/cache";
import { makeStudyProgressMapper } from "../mappers/mappers";

/* Só no cliente: o progresso fica no navegador do visitante. */

export const makeGetStudyProgress = (): GetStudyProgress =>
  new CachedGetStudyProgress(makeBrowserCache(), makeStudyProgressMapper());

export const makeSetLessonCompleted = (): SetLessonCompleted =>
  new CachedSetLessonCompleted(makeBrowserCache(), makeStudyProgressMapper());

export const makeWatchStudyProgress = (): WatchStudyProgress => new CachedWatchStudyProgress(makeBrowserCache());
