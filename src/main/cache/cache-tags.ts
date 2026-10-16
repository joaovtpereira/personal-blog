/** Tags do cache do Next (cacheTag/updateTag/revalidateTag) em um lugar só. */
export const CACHE_TAGS = {
  /** tudo que vem dos .md de content/ */
  content: "content",
  postComments: (postId: string) => `post-comments:${postId}`,
  lessonComments: (lessonId: string) => `lesson-comments:${lessonId}`,
  postReactions: (postId: string) => `post-reactions:${postId}`,
} as const;
