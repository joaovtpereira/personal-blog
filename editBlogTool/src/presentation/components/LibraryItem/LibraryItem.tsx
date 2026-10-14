import type { ButtonHTMLAttributes } from "react";
import styles from "./LibraryItem.module.css";

type LibraryItemProps = ButtonHTMLAttributes<HTMLButtonElement> & { glyph: string; label: string };

/** Item da biblioteca de blocos: glifo + nome. */
export function LibraryItem({ glyph, label, className, ...rest }: LibraryItemProps) {
  return (
    <button type="button" className={`${styles.item} ${className ?? ""}`} {...rest}>
      <span className={`mono ${styles.glyph}`} aria-hidden="true">
        {glyph}
      </span>
      <span>{label}</span>
    </button>
  );
}
