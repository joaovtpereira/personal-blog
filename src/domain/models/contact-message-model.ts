/** Formato enviado para fora (API/e-mail). Não usar na camada de apresentação. */
export type ContactMessageModel = {
  name: string;
  email: string;
  subject_type: "projeto" | "conversa" | "indicacao" | "outro";
  body: string;
  locale: string;
  sent_at: string;
};
