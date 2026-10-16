import type { PostReactionChoice, PostReactions } from "@/domain/entities";

export type ReactionFormState =
  | { status: "idle" }
  | { status: "ok"; reactions: PostReactions; choice: PostReactionChoice | null }
  | { status: "limited" }
  | { status: "failed" };

export type ReactionFormAction = (state: ReactionFormState, formData: FormData) => Promise<ReactionFormState>;

export const REACTION_FORM_FIELDS = {
  postId: "postId",
  choice: "choice",
  previous: "previous",
} as const;
