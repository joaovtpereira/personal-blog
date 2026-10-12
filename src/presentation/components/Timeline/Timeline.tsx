import type { ReactNode } from "react";
import styles from "./Timeline.module.css";

/** Trilho vertical que se desenha de cima para baixo. */
export function Timeline({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ol className={`${styles.timeline} ${className ?? ""}`}>{children}</ol>
  );
}

type TimelineItemProps = {
  when: string;
  title: string;
  subtitle?: string;
  description?: string;
  /** Item em andamento: ponto preenchido. */
  current?: boolean;
  currentLabel?: string;
  delay?: number;
};

/** Celular: data acima do título. Tablet/desktop: data numa coluna à esquerda. */
export function TimelineItem({ when, title, subtitle, description, current, currentLabel, delay = 0 }: TimelineItemProps) {
  return (
    <li className={styles.item} style={{ animationDelay: `${delay}s` }}>
      <span className={`${styles.dot} ${current ? styles.current : ""}`} aria-hidden="true" />
      <div className={`mono ${styles.when}`}>
        {when}
        {current && currentLabel && <span className="sr-only"> ({currentLabel})</span>}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <div className={`serif ${styles.subtitle}`}>{subtitle}</div>}
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </li>
  );
}
