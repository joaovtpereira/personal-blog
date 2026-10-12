import type { Post } from "@/domain/entities";
import type { PostMapper } from "@/domain/mappers";
import type { PostModel } from "@/domain/models";
import type { GetLatestPosts, GetLatestPostsParams } from "@/domain/use-cases";
import type { CollectionDataSource } from "@/shared/data-source";

export class LatestPosts implements GetLatestPosts {
  constructor(
    private readonly dataSource: CollectionDataSource<PostModel>,
    private readonly mapper: PostMapper,
  ) {}

  async execute({ locale, limit, kind }: GetLatestPostsParams): Promise<Post[]> {
    const models = await this.dataSource.findAll();
    return models
      .map((model) => this.mapper.toEntity(model))
      .filter((post) => post.locale === locale && (!kind || post.kind === kind))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .slice(0, limit);
  }
}
