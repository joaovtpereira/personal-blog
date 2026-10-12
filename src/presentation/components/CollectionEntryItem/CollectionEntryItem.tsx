import type { ReactNode } from "react";
import { Link } from "@/main/i18n/navigation";
import { Icon } from "../Icon";
import { Rating } from "../Rating";
import styles from "./CollectionEntryItem.module.css";

export type EntryVisualState = "done" | "current" | "todo" | "upcoming";

type CollectionEntryItemProps = {
  number: number;
  title: string;
  /** null nos itens "em breve" (sem link). */
  href: string | null;
  state: EntryVisualState;
  /** "ESTUDO 2" */
  unit: string;
  /** Status em mono: "CONCLUÍDO", "VOCÊ ESTÁ AQUI", "EM BREVE"... */
  tag: string;
  /** Detalhes: "8 AULAS · 45 MIN" */
  details: string | null;
  rating?: { score: number; label: string } | null;
  delay?: number;
};

/**
 * Item de coleção (estudos ou resenhas).
 * Celular: linha na trilha · Tablet: card em grade · Desktop: linha larga na trilha com seta.
 */
export function CollectionEntryItem({ number, title, href, state, unit, tag, details, rating, delay = 0 }: CollectionEntryItemProps) {
  const body: ReactNode = (
    <>
      <span className={styles.number}>{String(number).padStart(2, "0")}</span>
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        <span className={`mono ${styles.metaCompact}`}>
          {unit} · {state === "todo" && details ? details : tag}
        </span>
        <span className={`mono ${styles.meta}`}>
          {unit}
          {details ? ` · ${details}` : ""}
        </span>
        {rating && (
          <span className={styles.ratingCompact}>
            <Rating score={rating.score} label={rating.label} />
          </span>
        )}
      </span>
      <span className={styles.side}>
        <span className={`mono ${styles.tag}`}>{tag}</span>
        {rating && (
          <span className={styles.ratingSide}>
            <Rating score={rating.score} label={rating.label} />
          </span>
        )}
      </span>
      {href && <Icon name="arrowUpRight" className={styles.arrow} />}
    </>
  );

  return (
    <li className={styles.entry} style={{ animationDelay: `${delay}s` }}>
      <span className={`${styles.dot} ${styles[`dot_${state}`]}`} aria-hidden="true" />
      {href ? (
        <Link href={href} className={`${styles.item} ${styles[state]}`} aria-current={state === "current" ? "step" : undefined}>
          {body}
        </Link>
      ) : (
        <div className={`${styles.item} ${styles.upcoming}`} aria-disabled="true">
          {body}
        </div>
      )}
    </li>
  );
}

/** Trilha vertical que liga os itens (celular e desktop). */
export function CollectionEntryList({ children, label }: { children: ReactNode; label: string }) {
  return (
    <ol className={styles.list} aria-label={label}>
      {children}
    </ol>
  );
}
