import {
  isCollection,
  type Lesson,
  type LessonSummary,
  type Locale,
  type StudyCollectionPosition,
  type StudyLessonPage,
} from "@/domain/entities";
import type { LessonMapper, StudyMapper } from "@/domain/mappers";
import type { LessonModel, StudyCollectionModel, StudyModel } from "@/domain/models";
import type {
  GetStudyLesson,
  GetStudyLessonParams,
  GetStudyLessonRoutes,
  StudyLessonRoute,
} from "@/domain/use-cases";
import type { CollectionDataSource } from "@/shared/data-source";
import { toLocale } from "../mappers/locale";

type Sources = {
  studies: CollectionDataSource<StudyModel>;
  lessons: CollectionDataSource<LessonModel>;
  collections: CollectionDataSource<StudyCollectionModel>;
};

const toSummary = ({ id, slug, number, title, format, durationSeconds, readingMinutes }: Lesson): LessonSummary => ({
  id,
  slug,
  number,
  title,
  format,
  durationSeconds,
  readingMinutes,
});

export class StudyLessonLoader implements GetStudyLesson {
  constructor(
    private readonly sources: Sources,
    private readonly studyMapper: StudyMapper,
    private readonly lessonMapper: LessonMapper,
  ) {}

  async execute({ locale, studySlug, lessonSlug }: GetStudyLessonParams): Promise<StudyLessonPage | null> {
    const [studies, lessonModels, collections] = await Promise.all([
      this.sources.studies.findAll(),
      this.sources.lessons.findAll(),
      this.sources.collections.findAll(),
    ]);

    const studyModel = studies.find((model) => model.locale === locale && model.slug === studySlug);
    if (!studyModel) return null;

    const lessons = lessonModels
      .filter((model) => model.locale === locale && model.study_id === studyModel.id)
      .sort((a, b) => a.order - b.order)
      .map((model) => this.lessonMapper.toEntity(model));
    if (lessons.length === 0) return null;

    const lesson = lessonSlug ? lessons.find((item) => item.slug === lessonSlug) : lessons[0];
    if (!lesson) return null;

    return {
      study: this.studyMapper.toEntity(studyModel),
      lessons: lessons.map(toSummary),
      lesson,
      collection: this.collectionOf(studyModel, studies, collections, locale),
    };
  }

  private collectionOf(
    study: StudyModel,
    studies: StudyModel[],
    collections: StudyCollectionModel[],
    locale: Locale,
  ): StudyCollectionPosition | null {
    const collection = collections.find((model) => model.locale === locale && model.study_ids.includes(study.id));
    if (!collection) return null;

    const items = collection.study_ids
      .map((id) => studies.find((model) => model.id === id && model.locale === locale))
      .filter((model): model is StudyModel => !!model)
      .map((model, i) => ({ slug: model.slug, title: model.title, position: i + 1 }));

    // Regra de negócio: com 1 item (ou estudos despublicados) não há coleção.
    if (!isCollection(items.length)) return null;

    const index = items.findIndex((item) => item.slug === study.slug);
    return {
      id: collection.id,
      slug: collection.slug,
      name: collection.name,
      position: index + 1,
      total: items.length,
      previous: items[index - 1] ?? null,
      current: items[index],
      next: items[index + 1] ?? null,
    };
  }
}

export class StudyLessonRoutesLoader implements GetStudyLessonRoutes {
  constructor(
    private readonly studies: CollectionDataSource<StudyModel>,
    private readonly lessons: CollectionDataSource<LessonModel>,
  ) {}

  async execute(): Promise<StudyLessonRoute[]> {
    const [studies, lessons] = await Promise.all([this.studies.findAll(), this.lessons.findAll()]);
    return lessons.flatMap((lesson) => {
      const study = studies.find((model) => model.id === lesson.study_id && model.locale === lesson.locale);
      return study ? [{ locale: toLocale(lesson.locale), studySlug: study.slug, lessonSlug: lesson.slug }] : [];
    });
  }
}
