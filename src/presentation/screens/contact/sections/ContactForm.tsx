"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef, useState } from "react";
import { CONTACT_LIMITS, CONTACT_TOPICS, type ContactField, type ContactTopic } from "@/domain/entities";
import { Button } from "@/presentation/components/Button";
import { ChipSelect } from "@/presentation/components/ChipSelect";
import { Icon } from "@/presentation/components/Icon";
import { SuccessCard } from "@/presentation/components/SuccessCard";
import { TextAreaField, TextField } from "@/presentation/components/TextField";
import { richTags } from "@/presentation/i18n/rich";
import { CONTACT_FORM_FIELDS as F, type ContactFormAction, type ContactFormState } from "../contact-form-state";
import styles from "./ContactForm.module.css";

const INITIAL: ContactFormState = { status: "idle" };
const FIELD_ORDER: ContactField[] = ["topic", "name", "email", "message"];

type ContactFormProps = {
  action: ContactFormAction;
};

/** Formulário + confirmação. "Enviar outra" remonta o formulário limpo. */
export function ContactForm({ action }: ContactFormProps) {
  const [round, setRound] = useState(0);
  return <ContactFormRound key={round} action={action} onReset={() => setRound((n) => n + 1)} />;
}

function ContactFormRound({ action, onReset }: ContactFormProps & { onReset: () => void }) {
  const t = useTranslations("Contact");
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const [topic, setTopic] = useState<ContactTopic>("project");
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const formRef = useRef<HTMLFormElement>(null);
  const againRef = useRef<HTMLButtonElement>(null);

  const errors = state.status === "invalid" ? state.errors : {};

  const errorText = (field: ContactField): string | undefined => {
    const code = errors[field];
    if (!code) return undefined;
    const key = `${field}${code.charAt(0).toUpperCase()}${code.slice(1)}` as const;
    return t(`errors.${key}` as Parameters<typeof t>[0], {
      min: CONTACT_LIMITS.messageMin,
      max: field === "name" ? CONTACT_LIMITS.nameMax : CONTACT_LIMITS.messageMax,
    });
  };

  // Leva o foco ao primeiro campo com erro e ao botão "Enviar outra" depois do envio.
  useEffect(() => {
    if (state.status === "invalid") {
      const first = FIELD_ORDER.find((field) => state.errors[field]);
      const el = first && formRef.current?.querySelector<HTMLElement>(`[name="${first}"]:not([type=hidden])`);
      el?.focus();
    }
    if (state.status === "success") againRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <SuccessCard
        title={t.rich("success.title", richTags)}
        text={t("success.text")}
        action={
          <Button ref={againRef} variant="outlineCurrent" onClick={onReset}>
            {t("success.again")}
          </Button>
        }
      />
    );
  }

  const set = (key: keyof typeof values) => (event: { target: { value: string } }) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  return (
    <form ref={formRef} action={formAction} noValidate aria-label={t("form.label")} className={styles.form}>
      <ChipSelect
        legend={t("form.topic")}
        name={F.topic}
        value={topic}
        onChange={setTopic}
        error={errorText("topic")}
        options={CONTACT_TOPICS.map((value) => ({ value, label: t(`form.topics.${value}`) }))}
      />

      <div className={styles.pair}>
        <TextField
          id="contact-name"
          name={F.name}
          label={t("form.name")}
          placeholder={t("form.namePlaceholder")}
          autoComplete="name"
          maxLength={CONTACT_LIMITS.nameMax}
          value={values.name}
          onChange={set("name")}
          error={errorText("name")}
        />
        <TextField
          id="contact-email"
          name={F.email}
          type="email"
          inputMode="email"
          label={t("form.email")}
          placeholder={t("form.emailPlaceholder")}
          autoComplete="email"
          value={values.email}
          onChange={set("email")}
          error={errorText("email")}
        />
      </div>

      <TextAreaField
        id="contact-message"
        name={F.message}
        label={t("form.message")}
        placeholder={t("form.messagePlaceholder")}
        rows={4}
        maxLength={CONTACT_LIMITS.messageMax}
        value={values.message}
        onChange={set("message")}
        error={errorText("message")}
        className={styles.message}
      />

      {/* Armadilha para robôs: fora da tela e fora da ordem de tabulação. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="contact-website">{t("form.honeypot")}</label>
        <input id="contact-website" name={F.honeypot} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div aria-live="polite" className={styles.status}>
        {state.status === "invalid" && <p className={styles.notice}>{t("errors.summary")}</p>}
        {state.status === "failed" && <p className={styles.notice}>{t("errors.failed")}</p>}
      </div>

      <Button type="submit" size="l" block disabled={pending} aria-busy={pending}>
        {pending ? t("form.sending") : t("form.submit")}
        <Icon name="send" strokeWidth={1.8} />
      </Button>
    </form>
  );
}
