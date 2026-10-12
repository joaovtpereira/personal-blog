import { ConsoleEmailSender } from "@/infra/email";
import type { EmailSender } from "@/shared/email";

/* Trocar por um provedor real (Resend, SES, SMTP...) aqui. */
export const makeEmailSender = (): EmailSender => new ConsoleEmailSender();
