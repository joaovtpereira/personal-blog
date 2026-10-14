import type { ReactNode } from "react";
import styles from "./PanelSection.module.css";

type PanelSectionProps = {
  title?: ReactNode;
  /** texto à direita do título (contador, posição) */
  aside?: ReactNode;
  label?: string;
  className?: string;
  children: ReactNode;
};

/** Cartão das colunas laterais do editor. */
export function PanelSection({ title, aside, label, className, children }: PanelSectionProps) {
  return (
    <section className={`${styles.panel} ${className ?? ""}`} aria-label={label}>
      {(title || aside) && (
        <div className={styles.head}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {aside && <span className={`mono ${styles.aside}`}>{aside}</span>}
        </div>
      )}
      {children}
    </section>
  );
}
