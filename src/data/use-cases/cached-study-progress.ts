import type { StudyProgress } from "@/domain/entities";
import type { StudyProgressMapper } from "@/domain/mappers";
import type { StudyProgressModel, StudyProgressStoreModel } from "@/domain/models";
import type {
  GetStudyProgress,
  SetLessonCompleted,
  SetLessonCompletedParams,
  WatchStudyProgress,
} from "@/domain/use-cases";
import type { KeyValueCache } from "@/shared/cache";

export const STUDY_PROGRESS_KEY = "study-progress";

/** Lê e grava o documento único de progresso no cache. */
class StudyProgressStore {
  constructor(private readonly cache: KeyValueCache) {}

  read(): StudyProgressModel[] {
    const store = this.cache.get<StudyProgressStoreModel>(STUDY_PROGRESS_KEY);
    return store?.version === 1 && Array.isArray(store.studies) ? store.studies : [];
  }

  write(studies: StudyProgressModel[]) {
    this.cache.set<StudyProgressStoreModel>(STUDY_PROGRESS_KEY, { version: 1, studies });
  }

  subscribe(listener: () => void) {
    return this.cache.subscribe(STUDY_PROGRESS_KEY, listener);
  }
}

export class CachedGetStudyProgress implements GetStudyProgress {
  private readonly store: StudyProgressStore;

  constructor(cache: KeyValueCache, private readonly mapper: StudyProgressMapper) {
    this.store = new StudyProgressStore(cache);
  }

  async execute(): Promise<StudyProgress[]> {
    return this.store.read().map((model) => this.mapper.toEntity(model));
  }
}

export class CachedSetLessonCompleted implements SetLessonCompleted {
  private readonly store: StudyProgressStore;

  constructor(cache: KeyValueCache, private readonly mapper: StudyProgressMapper) {
    this.store = new StudyProgressStore(cache);
  }

  async execute({ studyId, lessonId, completed }: SetLessonCompletedParams): Promise<StudyProgress> {
    const studies = this.store.read();
    const current = studies.find((model) => model.study_id === studyId);
    const lessons = new Set(current ? this.mapper.toEntity(current).completedLessonIds : []);
    if (completed) lessons.add(lessonId);
    else lessons.delete(lessonId);

    const entity: StudyProgress = { studyId, completedLessonIds: [...lessons], updatedAt: new Date().toISOString() };
    this.store.write([...studies.filter((model) => model.study_id !== studyId), this.mapper.toModel(entity)]);
    return entity;
  }
}

export class CachedWatchStudyProgress implements WatchStudyProgress {
  private readonly store: StudyProgressStore;

  constructor(cache: KeyValueCache) {
    this.store = new StudyProgressStore(cache);
  }

  subscribe(listener: () => void): () => void {
    return this.store.subscribe(listener);
  }
}
