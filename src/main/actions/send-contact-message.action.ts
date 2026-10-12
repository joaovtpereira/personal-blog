"use server";

import { getLocale } from "next-intl/server";
import { toLocale } from "@/data/mappers/locale";
import { makeSendContactMessage } from "@/main/factories/use-cases/use-cases";
import { CONTACT_FORM_FIELDS as F, type ContactFormState } from "@/presentation/screens/contact/contact-form-state";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "");

export async function sendContactMessageAction(_: ContactFormState, formData: FormData): Promise<ContactFormState> {
  // Robô preencheu o campo oculto: finge sucesso e não envia nada.
  if (text(formData, F.honeypot).trim()) return { status: "success" };

  const result = await makeSendContactMessage().execute({
    name: text(formData, F.name),
    email: text(formData, F.email),
    topic: text(formData, F.topic),
    message: text(formData, F.message),
    locale: toLocale(await getLocale()),
  });

  switch (result.status) {
    case "sent":
      return { status: "success" };
    case "invalid":
      return { status: "invalid", errors: result.errors };
    default:
      return { status: "failed" };
  }
}
