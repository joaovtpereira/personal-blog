import type { Locale, Post, PostKind } from "../entities";

export type GetLatestPostsParams = {
  locale: Locale;
  limit: number;
  kind?: PostKind;
};

export interface GetLatestPosts {
  execute(params: GetLatestPostsParams): Promise<Post[]>;
}
