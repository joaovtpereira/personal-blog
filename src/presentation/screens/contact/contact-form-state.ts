import type { ContactFieldErrors } from "@/domain/entities";

/** Estado que a ação do formulário devolve para a tela. */
export type ContactFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "invalid"; errors: ContactFieldErrors }
  | { status: "failed" };

export type ContactFormAction = (state: ContactFormState, formData: FormData) => Promise<ContactFormState>;

export const CONTACT_FORM_FIELDS = {
  name: "name",
  email: "email",
  topic: "topic",
  message: "message",
  /** Armadilha para robôs: humanos não veem nem preenchem. */
  honeypot: "website",
} as const;
