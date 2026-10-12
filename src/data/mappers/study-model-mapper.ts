import type { Study } from "@/domain/entities";
import type { StudyMapper } from "@/domain/mappers";
import type { StudyModel } from "@/domain/models";
import { toLocale } from "./locale";

export class StudyModelMapper implements StudyMapper {
  toEntity(model: StudyModel): Study {
    return {
      id: model.id,
      slug: model.slug,
      locale: toLocale(model.locale),
      title: model.title,
      tags: [...model.tags],
      totalLessons: model.lessons.length,
      completedLessons: model.lessons.filter((lesson) => lesson.completed).length,
      videoLessons: model.lessons.filter((lesson) => lesson.format === "video").length,
    };
  }

  toModel(entity: Study): StudyModel {
    return {
      id: entity.id,
      slug: entity.slug,
      locale: entity.locale,
      title: entity.title,
      tags: [...entity.tags],
      lessons: Array.from({ length: entity.totalLessons }, (_, i) => ({
        id: `l${i + 1}`,
        format: i < entity.videoLessons ? "video" : "texto",
        completed: i < entity.completedLessons,
      })),
      updated_at: new Date().toISOString(),
    };
  }
}
