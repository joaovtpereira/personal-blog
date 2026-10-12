import type { Locale } from "./locale";

export const CONTACT_TOPICS = ["project", "chat", "recommendation", "other"] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export type ContactMessage = {
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
  locale: Locale;
  /** ISO 8601 */
  createdAt: string;
};

export type ContactField = "name" | "email" | "topic" | "message";

export type ContactFieldError = "required" | "invalid" | "tooShort" | "tooLong";

export type ContactFieldErrors = Partial<Record<ContactField, ContactFieldError>>;

export const CONTACT_LIMITS = {
  nameMax: 120,
  messageMin: 10,
  messageMax: 4000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isContactTopic = (value: string): value is ContactTopic =>
  (CONTACT_TOPICS as readonly string[]).includes(value);

/** Regras de negócio da mensagem de contato. Objeto vazio = válido. */
export function validateContactMessage(input: Pick<ContactMessage, "name" | "email" | "message"> & { topic: string }) {
  const errors: ContactFieldErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (!name) errors.name = "required";
  else if (name.length > CONTACT_LIMITS.nameMax) errors.name = "tooLong";

  if (!email) errors.email = "required";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "invalid";

  if (!isContactTopic(input.topic)) errors.topic = "invalid";

  if (!message) errors.message = "required";
  else if (message.length < CONTACT_LIMITS.messageMin) errors.message = "tooShort";
  else if (message.length > CONTACT_LIMITS.messageMax) errors.message = "tooLong";

  return errors;
}
