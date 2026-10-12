import type { PublicComment } from "@/domain/entities";
import type { PublicCommentMapper } from "@/domain/mappers";
import type { LessonCommentModel } from "@/domain/models";

export class PublicCommentModelMapper implements PublicCommentMapper {
  toEntity(model: LessonCommentModel): PublicComment {
    const name = model.author_name?.trim();
    return { id: model.id, authorName: name ? name : null, text: model.body, createdAt: model.created_at };
  }
}
