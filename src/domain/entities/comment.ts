/** Comentário público (já aprovado pela moderação). */
export type PublicComment = {
  id: string;
  /** null = anônimo */
  authorName: string | null;
  text: string;
  createdAt: string;
};

export type CommentField = "name" | "text";
export type CommentFieldError = "required" | "tooShort" | "tooLong";
export type CommentFieldErrors = Partial<Record<CommentField, CommentFieldError>>;

export const COMMENT_LIMITS = { nameMax: 80, textMin: 3, textMax: 2000 } as const;

export function validateComment(input: { name: string; text: string }): CommentFieldErrors {
  const errors: CommentFieldErrors = {};
  if (input.name.trim().length > COMMENT_LIMITS.nameMax) errors.name = "tooLong";
  const text = input.text.trim();
  if (!text) errors.text = "required";
  else if (text.length < COMMENT_LIMITS.textMin) errors.text = "tooShort";
  else if (text.length > COMMENT_LIMITS.textMax) errors.text = "tooLong";
  return errors;
}
