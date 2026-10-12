import type { ContactFieldErrors, Locale } from "../entities";

export type SendContactMessageParams = {
  name: string;
  email: string;
  topic: string;
  message: string;
  locale: Locale;
};

export type SendContactMessageResult =
  | { status: "sent" }
  | { status: "invalid"; errors: ContactFieldErrors }
  | { status: "failed" };

export interface SendContactMessage {
  execute(params: SendContactMessageParams): Promise<SendContactMessageResult>;
}
