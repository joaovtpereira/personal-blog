export type OutgoingEmail = {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

/** Envio de e-mail (provedor real, fila, log...). */
export interface EmailSender {
  send(email: OutgoingEmail): Promise<void>;
}
