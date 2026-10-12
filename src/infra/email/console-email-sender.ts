import type { EmailSender, OutgoingEmail } from "@/shared/email";

/** Envio simulado: só registra no log do servidor. Trocar por um provedor real na factory. */
export class ConsoleEmailSender implements EmailSender {
  constructor(private readonly latencyMs = 600) {}

  async send(email: OutgoingEmail): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, this.latencyMs));
    console.info("[ConsoleEmailSender] e-mail simulado", {
      to: email.to,
      replyTo: email.replyTo,
      subject: email.subject,
      length: email.text.length,
    });
  }
}
