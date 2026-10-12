import type { CommentFieldErrors } from "@/domain/entities";

export type CommentFormState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "invalid"; errors: CommentFieldErrors }
  | { status: "failed" };

export type CommentFormAction = (state: CommentFormState, formData: FormData) => Promise<CommentFormState>;

export const COMMENT_FORM_FIELDS = {
  name: "name",
  text: "text",
  honeypot: "website",
} as const;
