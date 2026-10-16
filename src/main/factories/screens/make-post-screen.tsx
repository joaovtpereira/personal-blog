import { notFound } from "next/navigation";
import { postShareCard, type Locale } from "@/domain/entities";
import { POST_COMMENT_CONTEXT } from "@/main/actions/post-comment-context";
import { postPostCommentAction } from "@/main/actions/post-post-comment.action";
import { reactToPostAction } from "@/main/actions/react-to-post.action";
import { cachedPostComments, cachedPostReactions } from "@/main/cache/feedback-cache";
import { ROUTES } from "@/main/routes";
import { PostScreen } from "@/presentation/screens/post";
import { makeShareTarget } from "../share/share-target";
import { makeGetPostPage } from "../use-cases/use-cases";

export const loadPostPage = (locale: Locale, slug: string) => makeGetPostPage().execute({ locale, slug });

export async function makePostScreen(locale: Locale, slug: string) {
  const page = await loadPostPage(locale, slug);
  if (!page) notFound();
  const postId = page.detail.post.id;
  const [comments, reactions] = await Promise.all([cachedPostComments(postId), cachedPostReactions(postId)]);

  return (
    <PostScreen
      page={page}
      comments={comments}
      share={makeShareTarget(postShareCard(page, ROUTES.post(slug)))}
      reactions={reactions}
      reactionAction={reactToPostAction}
      commentAction={postPostCommentAction}
      commentContext={{
        [POST_COMMENT_CONTEXT.postId]: page.detail.post.id,
        [POST_COMMENT_CONTEXT.postTitle]: page.detail.post.title,
      }}
    />
  );
}
