import type { Lesson, LessonMaterialKind } from "@/domain/entities";
import type { ContentBlockMapper, LessonMapper } from "@/domain/mappers";
import type { LessonModel } from "@/domain/models";
import { toVideoRefModel, toVideoSource } from "./video-source-mapper";

type ModelMaterial = NonNullable<LessonModel["materials"]>[number]["type"];

const MATERIAL: Record<ModelMaterial, LessonMaterialKind> = { pdf: "pdf", link: "link", arquivo: "file" };
const MODEL_MATERIAL: Record<LessonMaterialKind, ModelMaterial> = { pdf: "pdf", link: "link", file: "arquivo" };

export class LessonModelMapper implements LessonMapper {
  constructor(private readonly blocks: ContentBlockMapper) {}

  toEntity(model: LessonModel): Lesson {
    const video = model.video ? toVideoSource(model.video) : null;
    return {
      id: model.id,
      studyId: model.study_id,
      slug: model.slug,
      number: model.order,
      title: model.title,
      format: model.format === "video" ? "video" : "text",
      durationSeconds: video?.durationSeconds ?? null,
      readingMinutes: model.reading_minutes,
      video,
      summary: model.summary ? { keyIdea: model.summary.key_idea, text: model.summary.text } : null,
      blocks: model.blocks.map((block) => this.blocks.toEntity(block)),
      materials: (model.materials ?? []).map((material) => ({
        id: material.id,
        title: material.title,
        kind: MATERIAL[material.type],
        url: material.url,
      })),
    };
  }

  toModel(entity: Lesson): LessonModel {
    return {
      id: entity.id,
      study_id: entity.studyId,
      locale: "",
      slug: entity.slug,
      order: entity.number,
      title: entity.title,
      format: entity.format === "video" ? "video" : "texto",
      reading_minutes: entity.readingMinutes,
      video: entity.video ? toVideoRefModel(entity.video) : null,
      summary: entity.summary ? { key_idea: entity.summary.keyIdea, text: entity.summary.text } : null,
      blocks: entity.blocks.map((block) => this.blocks.toModel(block)),
      materials: entity.materials.map((material) => ({
        id: material.id,
        title: material.title,
        type: MODEL_MATERIAL[material.kind],
        url: material.url,
      })),
    };
  }
}
