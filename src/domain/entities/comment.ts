/** Comentário público (já aprovado pela moderação). */
export type PublicComment = {
  id: string;
  /** null = anônimo */
  authorName: string | null;
  text: string;
  createdAt: string;
};

export type CommentField = "name" | "email" | "text";
export type CommentFieldError = "required" | "invalid" | "tooShort" | "tooLong";
export type CommentFieldErrors = Partial<Record<CommentField, CommentFieldError>>;

export const COMMENT_LIMITS = { nameMax: 80, textMin: 3, textMax: 2000 } as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** E-mail é opcional (nunca publicado); se vier, precisa ser válido. */
export function validateComment(input: { name: string; text: string; email?: string }): CommentFieldErrors {
  const errors: CommentFieldErrors = {};
  if (input.name.trim().length > COMMENT_LIMITS.nameMax) errors.name = "tooLong";
  const email = input.email?.trim();
  if (email && !EMAIL_PATTERN.test(email)) errors.email = "invalid";
  const text = input.text.trim();
  if (!text) errors.text = "required";
  else if (text.length < COMMENT_LIMITS.textMin) errors.text = "tooShort";
  else if (text.length > COMMENT_LIMITS.textMax) errors.text = "tooLong";
  return errors;
}
