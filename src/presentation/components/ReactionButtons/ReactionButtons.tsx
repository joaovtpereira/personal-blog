"use client";

import { useTranslations } from "next-intl";
import { THOUGHT_REACTIONS, type ThoughtReaction } from "@/domain/entities";
import { usePostReaction } from "@/presentation/contexts/PostReactionsContext";
import { Icon } from "../Icon";
import styles from "./ReactionButtons.module.css";

/** "Curtir" das resenhas: total do back-end + 1 quando o visitante curtiu. */
export function LikeButton({ postId, count, className }: { postId: string; count: number; className?: string }) {
  const t = useTranslations("PostPage");
  const { ready, choice, toggle } = usePostReaction(postId);
  const liked = choice === "like";

  return (
    <button
      type="button"
      aria-pressed={liked}
      disabled={!ready}
      onClick={() => toggle("like")}
      className={`${styles.like} ${liked ? styles.on : ""} ${className ?? ""}`}
    >
      <span key={String(liked)} className={liked ? styles.pop : undefined}>
        <Icon name="heart" size={18} className={liked ? styles.filled : undefined} />
      </span>
      {liked ? t("liked") : t("like")}
      <span className={`mono ${styles.count}`}>{count + (liked ? 1 : 0)}</span>
    </button>
  );
}

/** Três reações dos pensamentos; só uma por visitante (tocar de novo desfaz). */
export function ThoughtReactions({ postId, counts }: { postId: string; counts: Record<ThoughtReaction, number> }) {
  const t = useTranslations("PostPage");
  const { ready, choice, toggle } = usePostReaction(postId);

  return (
    <section className={styles.reactions} aria-labelledby={`reactions-${postId}`}>
      <div id={`reactions-${postId}`} className={`mono ${styles.title}`}>
        {t("reactionsTitle")}
      </div>
      <div role="group" aria-label={t("reactionsAria")} className={styles.group}>
        {THOUGHT_REACTIONS.map((id) => {
          const on = choice === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={on}
              disabled={!ready}
              onClick={() => toggle(id)}
              className={`${styles.reaction} ${on ? `${styles.on} ${styles.pop}` : ""}`}
            >
              {t(`reactions.${id}`)}
              <span className={`mono ${styles.count}`}>{counts[id] + (on ? 1 : 0)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
