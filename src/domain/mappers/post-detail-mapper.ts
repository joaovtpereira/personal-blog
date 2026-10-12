import type { PostDetail } from "../entities";
import type { PostContentModel, PostModel } from "../models";

/** Junta o frontmatter do post com o corpo/detalhes da resenha. */
export interface PostDetailMapper {
  toEntity(post: PostModel, content: PostContentModel): PostDetail;
}
