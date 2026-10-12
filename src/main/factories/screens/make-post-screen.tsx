import { notFound } from "next/navigation";
import type { Locale } from "@/domain/entities";
import { POST_COMMENT_CONTEXT } from "@/main/actions/post-comment-context";
import { postPostCommentAction } from "@/main/actions/post-post-comment.action";
import { PostScreen } from "@/presentation/screens/post";
import { makeGetPostComments, makeGetPostPage } from "../use-cases/use-cases";

export const loadPostPage = (locale: Locale, slug: string) => makeGetPostPage().execute({ locale, slug });

export async function makePostScreen(locale: Locale, slug: string) {
  const page = await loadPostPage(locale, slug);
  if (!page) notFound();
  const comments = await makeGetPostComments().execute({ postId: page.detail.post.id });

  return (
    <PostScreen
      page={page}
      comments={comments}
      commentAction={postPostCommentAction}
      commentContext={{
        [POST_COMMENT_CONTEXT.postId]: page.detail.post.id,
        [POST_COMMENT_CONTEXT.postTitle]: page.detail.post.title,
      }}
    />
  );
}
