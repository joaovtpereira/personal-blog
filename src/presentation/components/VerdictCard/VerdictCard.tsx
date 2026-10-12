import styles from "./VerdictCard.module.css";

type VerdictCardProps = {
  label: string;
  line: string;
  score: number;
  /** Rótulo acessível da nota ("Nota 4 de 5"). */
  scoreLabel: string;
  className?: string;
};

/** Veredito em superfície invertida: frase final, nota grande e barra. Compacto no tablet. */
export function VerdictCard({ label, line, score, scoreLabel, className }: VerdictCardProps) {
  const pct = Math.max(0, Math.min(5, score)) * 20;
  return (
    <section className={`${styles.card} ${className ?? ""}`} aria-label={label}>
      <div className={styles.top}>
        <div className={styles.text}>
          <div className={`mono ${styles.label}`}>{label}</div>
          <div className={`serif ${styles.line}`}>{line}</div>
        </div>
        <div className={styles.score} role="img" aria-label={scoreLabel}>
          {score}
          <span>/5</span>
        </div>
      </div>
      <div className={styles.track} aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>
    </section>
  );
}
