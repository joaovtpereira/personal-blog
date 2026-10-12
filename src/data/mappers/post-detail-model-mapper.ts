import type { PostDetail, PostReactions, Review } from "@/domain/entities";
import type { ContentBlockMapper, PostDetailMapper, PostMapper } from "@/domain/mappers";
import type { PostContentModel, PostModel } from "@/domain/models";

export class PostDetailModelMapper implements PostDetailMapper {
  constructor(
    private readonly posts: PostMapper,
    private readonly blocks: ContentBlockMapper,
  ) {}

  toEntity(model: PostModel, content: PostContentModel): PostDetail {
    const post = this.posts.toEntity(model);
    const verdict = (line: string) => ({ score: post.rating ?? 0, line });

    let review: Review | null = null;
    if (post.kind === "book" && content.book) {
      review = {
        kind: "book",
        author: post.subject ?? "",
        year: content.book.year,
        pages: content.book.pages,
        genres: [...content.book.genres],
        coverImage: post.coverImage,
        verdict: verdict(content.book.verdict_line),
        pros: [...content.book.pros],
        cons: [...content.book.cons],
      };
    } else if (post.kind === "game" && content.game) {
      review = {
        kind: "game",
        studio: content.game.studio,
        platform: post.subject ?? "",
        hours: content.game.hours,
        release: content.game.release,
        genre: content.game.genre,
        completed: content.game.completed,
        captureImage: post.coverImage,
        worth: content.game.worth,
        difficulty: content.game.difficulty,
        audience: content.game.audience,
        verdict: verdict(content.game.verdict_line),
        pros: [...content.game.pros],
        cons: [...content.game.cons],
      };
    }

    const reactions: PostReactions =
      post.kind === "thought"
        ? {
            type: "thought",
            counts: {
              agree: content.reactions?.fez_sentido ?? 0,
              think: content.reactions?.me_fez_pensar ?? 0,
              disagree: content.reactions?.discordo ?? 0,
            },
          }
        : { type: "like", count: content.likes ?? 0 };

    return {
      post,
      lead: content.lead ?? null,
      blocks: content.blocks.map((block) => this.blocks.toEntity(block)),
      review,
      reactions,
    };
  }
}
