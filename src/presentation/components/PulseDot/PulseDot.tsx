import styles from "./PulseDot.module.css";

type PulseDotProps = {
  size?: number;
  /** Anel na cor do fundo, para pousar sobre fotos. */
  outlined?: boolean;
  className?: string;
};

/** Ponto "ao vivo" com onda que se expande. Decorativo. */
export function PulseDot({ size = 10, outlined = false, className }: PulseDotProps) {
  return (
    <span className={`${styles.dot} ${className ?? ""}`} style={{ width: size, height: size }} aria-hidden="true">
      <span className={styles.ping} />
      <span className={`${styles.core} ${outlined ? styles.outlined : ""}`} />
    </span>
  );
}
