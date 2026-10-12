import type { Post, PostKind } from "@/domain/entities";
import type { PostMapper } from "@/domain/mappers";
import type { PostModel } from "@/domain/models";
import { toLocale } from "./locale";

const KIND_BY_TYPE: Record<PostModel["type"], PostKind> = {
  pensamento: "thought",
  "resenha-livro": "book",
  "resenha-jogo": "game",
};

const TYPE_BY_KIND: Record<PostKind, PostModel["type"]> = {
  thought: "pensamento",
  book: "resenha-livro",
  game: "resenha-jogo",
};

export class PostModelMapper implements PostMapper {
  toEntity(model: PostModel): Post {
    const kind = KIND_BY_TYPE[model.type];
    return {
      id: model.id,
      slug: model.slug,
      locale: toLocale(model.locale),
      kind,
      title: model.title,
      excerpt: model.excerpt,
      tags: [...model.tags],
      readingMinutes: model.reading_time_minutes,
      publishedAt: new Date(model.published_at).toISOString(),
      rating: kind === "thought" ? null : (model.rating ?? null),
      subject: (kind === "book" ? model.author : kind === "game" ? model.platform : null) ?? null,
      coverImage: model.cover_image ?? null,
      featured: !!model.featured,
    };
  }

  toModel(entity: Post): PostModel {
    return {
      id: entity.id,
      slug: entity.slug,
      locale: entity.locale,
      type: TYPE_BY_KIND[entity.kind],
      title: entity.title,
      excerpt: entity.excerpt,
      tags: [...entity.tags],
      reading_time_minutes: entity.readingMinutes,
      published_at: entity.publishedAt,
      rating: entity.rating,
      author: entity.kind === "book" ? entity.subject : null,
      platform: entity.kind === "game" ? entity.subject : null,
      cover_image: entity.coverImage,
      featured: entity.featured,
    };
  }
}
