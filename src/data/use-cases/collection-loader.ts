import { isCollection, publishedEntries, type Collection, type Locale } from "@/domain/entities";
import type { CollectionItemResolver, CollectionMapper, PostMapper } from "@/domain/mappers";
import type { CollectionModel, LessonModel, PostModel, StudyModel } from "@/domain/models";
import type { GetCollection, GetCollectionRoutes } from "@/domain/use-cases";
import type { CollectionDataSource } from "@/shared/data-source";
import { toLocale } from "../mappers/locale";

type Sources = {
  collections: CollectionDataSource<CollectionModel>;
  studies: CollectionDataSource<StudyModel>;
  lessons: CollectionDataSource<LessonModel>;
  posts: CollectionDataSource<PostModel>;
};

/** Minutos de uma aula: duração do vídeo (arredondada para cima) ou tempo de leitura. */
const lessonMinutes = (lesson: LessonModel) =>
  lesson.format === "video" && lesson.video?.duration_seconds
    ? Math.ceil(lesson.video.duration_seconds / 60)
    : lesson.reading_minutes;

export class CollectionLoader implements GetCollection {
  constructor(
    private readonly sources: Sources,
    private readonly mapper: CollectionMapper,
    private readonly postMapper: PostMapper,
  ) {}

  async execute({ locale, slug }: { locale: Locale; slug: string }): Promise<Collection | null> {
    const [collections, studies, lessons, posts] = await Promise.all([
      this.sources.collections.findAll(),
      this.sources.studies.findAll(),
      this.sources.lessons.findAll(),
      this.sources.posts.findAll(),
    ]);

    const model = collections.find((item) => item.locale === locale && item.slug === slug);
    if (!model) return null;

    const resolve: CollectionItemResolver =
      model.kind === "estudos" ? this.studyResolver(locale, studies, lessons) : this.postResolver(locale, posts);
    const collection = this.mapper.toEntity(model, resolve);

    // Regra de negócio: com menos de 2 itens publicados não é coleção.
    return isCollection(publishedEntries(collection).length) ? collection : null;
  }

  private studyResolver(locale: Locale, studies: StudyModel[], lessons: LessonModel[]): CollectionItemResolver {
    return (refId) => {
      const study = studies.find((model) => model.id === refId && model.locale === locale);
      if (!study) return null;
      const studyLessons = lessons.filter((lesson) => lesson.study_id === study.id && lesson.locale === locale);
      return {
        title: study.title,
        ref: {
          type: "study",
          id: study.id,
          slug: study.slug,
          lessons: study.lessons.map((lesson) => ({ id: lesson.id, slug: lesson.slug })),
        },
        lessonCount: study.lessons.length,
        minutes: studyLessons.reduce((sum, lesson) => sum + lessonMinutes(lesson), 0) || null,
        rating: null,
      };
    };
  }

  private postResolver(locale: Locale, posts: PostModel[]): CollectionItemResolver {
    return (refId) => {
      const model = posts.find((item) => item.id === refId && item.locale === locale);
      if (!model) return null;
      const post = this.postMapper.toEntity(model);
      return {
        title: post.title,
        ref: { type: "post", id: post.id, slug: post.slug },
        lessonCount: null,
        minutes: post.readingMinutes,
        rating: post.rating,
      };
    };
  }
}

export class CollectionRoutesLoader implements GetCollectionRoutes {
  constructor(private readonly collections: CollectionDataSource<CollectionModel>) {}

  async execute(): Promise<{ locale: Locale; slug: string }[]> {
    const models = await this.collections.findAll();
    return models.map((model) => ({ locale: toLocale(model.locale), slug: model.slug }));
  }
}
