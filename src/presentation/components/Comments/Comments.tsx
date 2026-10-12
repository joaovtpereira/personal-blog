"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useActionState, useEffect, useRef, useState } from "react";
import { COMMENT_LIMITS, type PublicComment } from "@/domain/entities";
import { formatShortDate, pad2 } from "../../utils/format";
import { COMMENT_FORM_FIELDS as F, type CommentFormAction, type CommentFormState } from "./comment-form-state";
import styles from "./Comments.module.css";

export type CommentsVariant = "lesson" | "review" | "thought";

type CommentsProps = {
  comments: PublicComment[];
  action: CommentFormAction;
  /** Campos ocultos que identificam onde o comentário foi feito (estudo, aula, post...). */
  context: Record<string, string>;
  id?: string;
  /** Muda título e rótulos ("Comentários" na aula/resenha, "Conversa" no pensamento). */
  variant?: CommentsVariant;
  /** Pede e-mail opcional (nunca publicado). */
  askEmail?: boolean;
};

const INITIAL: CommentFormState = { status: "idle" };

/** Seção de comentários com moderação: formulário + lista dos aprovados. */
export function Comments({ comments, action, context, id = "comentarios", variant = "lesson", askEmail = false }: CommentsProps) {
  const t = useTranslations("Comments");
  const format = useFormatter();
  const [round, setRound] = useState(0);
  const [prefill, setPrefill] = useState("");

  const reply = (name: string) => {
    setPrefill(`@${name} `);
    setRound((n) => n + 1);
    requestAnimationFrame(() => document.getElementById(`${id}-text`)?.focus());
  };

  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <div className={styles.header}>
        <h2 id={`${id}-title`} className={styles.title}>
          {t(`variants.${variant}.title`)}
        </h2>
        <span className={`mono ${styles.count}`}>{t(`variants.${variant}.count`, { count: pad2(comments.length) })}</span>
      </div>

      <CommentForm
        key={round}
        id={id}
        action={action}
        context={context}
        variant={variant}
        askEmail={askEmail}
        initialText={prefill}
        onAnother={() => {
          setPrefill("");
          setRound((n) => n + 1);
        }}
      />

      {comments.length === 0 ? (
        <p className={styles.empty}>{t(`variants.${variant}.empty`)}</p>
      ) : (
        <ul className={styles.list}>
          {comments.map((comment, i) => {
            const name = comment.authorName ?? t("anonymous");
            return (
              <li key={comment.id} className={styles.comment} style={{ animationDelay: `${i * 0.06}s` }}>
                <span className={`mono ${styles.avatar}`} aria-hidden="true">
                  {name.replace(/^\[/, "").charAt(0).toUpperCase()}
                </span>
                <div>
                  <div className={styles.meta}>
                    <span className={styles.name}>{name}</span>
                    <time className={`mono ${styles.when}`} dateTime={comment.createdAt}>
                      {formatShortDate(format, comment.createdAt)}
                    </time>
                  </div>
                  <p className={styles.text}>{comment.text}</p>
                  <button type="button" className={styles.reply} aria-label={t("replyTo", { name })} onClick={() => reply(name)}>
                    {t("reply")}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

type CommentFormProps = {
  id: string;
  action: CommentFormAction;
  context: Record<string, string>;
  variant: CommentsVariant;
  askEmail: boolean;
  initialText: string;
  onAnother: () => void;
};

function CommentForm({ id, action, context, variant, askEmail, initialText, onAnother }: CommentFormProps) {
  const t = useTranslations("Comments");
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState(initialText);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const errors = state.status === "invalid" ? state.errors : {};
  const textError = errors.text
    ? t(`errors.text${errors.text.charAt(0).toUpperCase()}${errors.text.slice(1)}` as "errors.textRequired", {
        max: COMMENT_LIMITS.textMax,
      })
    : undefined;
  const nameError = errors.name ? t("errors.nameTooLong", { max: COMMENT_LIMITS.nameMax }) : undefined;
  const emailError = errors.email ? t("errors.emailInvalid") : undefined;

  useEffect(() => {
    if (state.status === "invalid") textRef.current?.focus();
    if (state.status === "pending") statusRef.current?.focus();
  }, [state]);

  if (state.status === "pending") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className={`${styles.box} ${styles.sent}`}>
        <p>{t("pending")}</p>
        <button type="button" className={styles.another} onClick={onAnother}>
          {t("another")}
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className={styles.box}>
      {Object.entries(context).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      <label htmlFor={`${id}-name`} className={`mono ${styles.label}`}>
        {t("name")}
      </label>
      <input
        id={`${id}-name`}
        name={F.name}
        type="text"
        autoComplete="name"
        maxLength={COMMENT_LIMITS.nameMax}
        placeholder={t("namePlaceholder")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-invalid={nameError ? true : undefined}
        className={styles.input}
      />
      {nameError && <p className={styles.error}>{nameError}</p>}

      {askEmail && (
        <>
          <label htmlFor={`${id}-email`} className={`mono ${styles.label}`}>
            {t("email")}
          </label>
          <input
            id={`${id}-email`}
            name={F.email}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={emailError ? true : undefined}
            className={styles.input}
          />
          {emailError && <p className={styles.error}>{emailError}</p>}
        </>
      )}

      <label htmlFor={`${id}-text`} className={`mono ${styles.label}`}>
        {t(`variants.${variant}.text`)}
      </label>
      <textarea
        ref={textRef}
        id={`${id}-text`}
        name={F.text}
        rows={3}
        maxLength={COMMENT_LIMITS.textMax}
        placeholder={t(`variants.${variant}.placeholder`)}
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-invalid={textError ? true : undefined}
        aria-describedby={textError ? `${id}-text-error` : undefined}
        className={styles.textarea}
      />
      {textError && (
        <p id={`${id}-text-error`} className={styles.error}>
          {textError}
        </p>
      )}

      <div className={styles.honeypot} aria-hidden="true">
        <input name={F.honeypot} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {state.status === "failed" && (
        <p className={styles.error} role="alert">
          {t("errors.failed")}
        </p>
      )}

      <div className={styles.footer}>
        <span className={styles.moderation}>{t("moderation")}</span>
        <button type="submit" className={styles.publish} disabled={pending} aria-busy={pending}>
          {pending ? t("sending") : t("publish")}
        </button>
      </div>
    </form>
  );
}
