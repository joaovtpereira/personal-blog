import type { ContentBlock, Lesson, PublicComment } from "../entities";
import type { ContentBlockModel, LessonCommentModel, LessonModel } from "../models";
import type { Mapper } from "./mapper";

export type ContentBlockMapper = Mapper<ContentBlockModel, ContentBlock>;

export type LessonMapper = Mapper<LessonModel, Lesson>;

/** Só lê: comentários públicos nunca voltam para o formato externo por aqui. */
export interface PublicCommentMapper {
  toEntity(model: LessonCommentModel): PublicComment;
}
