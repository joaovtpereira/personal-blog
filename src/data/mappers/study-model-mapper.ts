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
      description: model.description,
      tags: [...model.tags],
      lessonIds: model.lessons.map((lesson) => lesson.id),
      videoLessons: model.lessons.filter((lesson) => lesson.format === "video").length,
    };
  }

  toModel(entity: Study): StudyModel {
    return {
      id: entity.id,
      slug: entity.slug,
      locale: entity.locale,
      title: entity.title,
      description: entity.description,
      tags: [...entity.tags],
      lessons: entity.lessonIds.map((id, i) => ({ id, slug: id, format: i < entity.videoLessons ? "video" : "texto" })),
      order: 0,
    };
  }
}
