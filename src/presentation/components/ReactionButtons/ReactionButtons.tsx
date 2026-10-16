"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef, useState, type MouseEvent } from "react";
import {
  applyReactionChange,
  nextReactionChoice,
  THOUGHT_REACTIONS,
  type PostReactionChoice,
  type PostReactions,
} from "@/domain/entities";
import { usePostReaction } from "@/presentation/contexts/PostReactionsContext";
import { Icon } from "../Icon";
import { REACTION_FORM_FIELDS as F, type ReactionFormAction, type ReactionFormState } from "./reaction-form-state";
import styles from "./ReactionButtons.module.css";

type ReactionProps = {
  postId: string;
  /** totais do servidor (já incluem a reação de quem está lendo) */
  reactions: PostReactions;
  action: ReactionFormAction;
};

/**
 * Formulário de reação: sem JavaScript, o botão envia o formulário e a página volta com o total novo.
 * Com JavaScript, a tela atualiza na hora (otimista) e confirma com o total que o servidor devolve.
 */
function useReactionForm({ postId, reactions, action }: ReactionProps) {
  const { ready, choice, setChoice } = usePostReaction(postId);
  const [state, formAction, pending] = useActionState(action, { status: "idle" });
  // Totais otimistas valem até a resposta do servidor (que troca o `state`).
  const [optimistic, setOptimistic] = useState<{ reactions: PostReactions; until: ReactionFormState } | null>(null);
  const before = useRef<PostReactionChoice | null>(null);

  const server = state.status === "ok" ? state.reactions : reactions;

  useEffect(() => {
    if (state.status === "idle") return;
    // Confirmado: guarda a escolha que o servidor aplicou. Recusado: volta para a anterior.
    setChoice(state.status === "ok" ? state.choice : before.current);
  }, [state, setChoice]);

  /** Antes de enviar: atualiza a tela e a escolha guardada. Sem a escolha carregada ainda, espera. */
  const onTouch = (touched: PostReactionChoice) => (event: MouseEvent<HTMLButtonElement>) => {
    if (!ready) return event.preventDefault();
    const next = nextReactionChoice(choice, touched);
    before.current = choice;
    setOptimistic({ reactions: applyReactionChange(server, choice, next), until: state });
    setChoice(next);
  };

  const shown = optimistic && optimistic.until === state ? optimistic.reactions : server;
  return { choice, pending, state, formAction, onTouch, shown };
}

function Hidden({ postId, previous }: { postId: string; previous: PostReactionChoice | null }) {
  return (
    <>
      <input type="hidden" name={F.postId} value={postId} />
      <input type="hidden" name={F.previous} value={previous ?? ""} />
    </>
  );
}

function Notice({ status }: { status: string }) {
  const t = useTranslations("PostPage");
  return (
    <span className={`sr-only`} aria-live="polite">
      {status === "limited" ? t("reactionLimited") : status === "failed" ? t("reactionFailed") : ""}
    </span>
  );
}

/** "Curtir" das resenhas. */
export function LikeButton({ className, ...props }: ReactionProps & { className?: string }) {
  const t = useTranslations("PostPage");
  const { choice, pending, state, formAction, onTouch, shown } = useReactionForm(props);
  const liked = choice === "like";
  const count = shown.type === "like" ? shown.count : 0;

  return (
    <form action={formAction} className={`${styles.likeForm} ${className ?? ""}`}>
      <Hidden postId={props.postId} previous={choice} />
      <button
        type="submit"
        name={F.choice}
        value="like"
        aria-pressed={liked}
        aria-busy={pending}
        onClick={onTouch("like")}
        className={`${styles.like} ${liked ? styles.on : ""}`}
      >
        <span key={String(liked)} className={liked ? styles.pop : undefined}>
          <Icon name="heart" size={18} className={liked ? styles.filled : undefined} />
        </span>
        {liked ? t("liked") : t("like")}
        <span className={`mono ${styles.count}`}>{count}</span>
      </button>
      <Notice status={state.status} />
    </form>
  );
}

/** Três reações dos pensamentos; só uma por visitante (tocar de novo desfaz). */
export function ThoughtReactions(props: ReactionProps) {
  const t = useTranslations("PostPage");
  const { choice, pending, state, formAction, onTouch, shown } = useReactionForm(props);
  const counts = shown.type === "thought" ? shown.counts : { agree: 0, think: 0, disagree: 0 };

  return (
    <section className={styles.reactions} aria-labelledby={`reactions-${props.postId}`}>
      <div id={`reactions-${props.postId}`} className={`mono ${styles.title}`}>
        {t("reactionsTitle")}
      </div>
      <form action={formAction} role="group" aria-label={t("reactionsAria")} aria-busy={pending} className={styles.group}>
        <Hidden postId={props.postId} previous={choice} />
        {THOUGHT_REACTIONS.map((id) => {
          const on = choice === id;
          return (
            <button
              key={id}
              type="submit"
              name={F.choice}
              value={id}
              aria-pressed={on}
              onClick={onTouch(id)}
              className={`${styles.reaction} ${on ? `${styles.on} ${styles.pop}` : ""}`}
            >
              {t(`reactions.${id}`)}
              <span className={`mono ${styles.count}`}>{counts[id]}</span>
            </button>
          );
        })}
        <Notice status={state.status} />
      </form>
    </section>
  );
}
