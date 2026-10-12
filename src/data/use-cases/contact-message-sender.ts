import { validateContactMessage, type ContactMessage, type ContactTopic } from "@/domain/entities";
import type { ContactMessageMapper } from "@/domain/mappers";
import type {
  SendContactMessage,
  SendContactMessageParams,
  SendContactMessageResult,
} from "@/domain/use-cases";
import type { EmailSender } from "@/shared/email";

export class ContactMessageSender implements SendContactMessage {
  constructor(
    private readonly emailSender: EmailSender,
    private readonly mapper: ContactMessageMapper,
    private readonly recipient: string,
  ) {}

  async execute(params: SendContactMessageParams): Promise<SendContactMessageResult> {
    const errors = validateContactMessage(params);
    if (Object.keys(errors).length > 0) return { status: "invalid", errors };

    const entity: ContactMessage = {
      name: params.name.trim(),
      email: params.email.trim(),
      topic: params.topic as ContactTopic,
      message: params.message.trim(),
      locale: params.locale,
      createdAt: new Date().toISOString(),
    };
    const model = this.mapper.toModel(entity);

    try {
      await this.emailSender.send({
        to: this.recipient,
        replyTo: model.email,
        subject: `[Site · ${model.subject_type}] ${model.name}`,
        text: [
          `Nome: ${model.name}`,
          `E-mail: ${model.email}`,
          `Assunto: ${model.subject_type}`,
          `Idioma: ${model.locale}`,
          `Enviado em: ${model.sent_at}`,
          "",
          model.body,
        ].join("\n"),
      });
      return { status: "sent" };
    } catch {
      return { status: "failed" };
    }
  }
}
