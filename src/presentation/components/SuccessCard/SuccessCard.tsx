import type { ReactNode } from "react";
import styles from "./SuccessCard.module.css";

type SuccessCardProps = {
  title: ReactNode;
  text: string;
  action?: ReactNode;
};

/** Confirmação em superfície invertida, com check desenhado. */
export function SuccessCard({ title, text, action }: SuccessCardProps) {
  return (
    <div className={styles.card} role="status">
      <div className={styles.check} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path className={styles.draw} d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>
      <div className={styles.title}>{title}</div>
      <p className={styles.text}>{text}</p>
      {action}
    </div>
  );
}
