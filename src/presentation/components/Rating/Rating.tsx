import styles from "./Rating.module.css";

type RatingProps = {
  score: number;
  label: string;
  showScore?: boolean;
};

/** Nota em 5 barras. */
export function Rating({ score, label, showScore = false }: RatingProps) {
  return (
    <span className={styles.rating} role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= score ? `${styles.bar} ${styles.on}` : styles.bar} />
      ))}
      {showScore && (
        <span className={`mono ${styles.score}`} aria-hidden="true">
          {score}/5
        </span>
      )}
    </span>
  );
}
