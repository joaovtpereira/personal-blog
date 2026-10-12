import styles from "./TagMarquee.module.css";

type TagMarqueeProps = {
  /** Cada linha corre num sentido (a 2ª ao contrário). */
  rows: string[][];
  /** Texto para leitores de tela (a faixa animada é decorativa). */
  label: string;
  className?: string;
};

/** Faixas infinitas de tags em mono — vitrine de tecnologias. */
export function TagMarquee({ rows, label, className }: TagMarqueeProps) {
  const all = rows.flat();
  return (
    <section className={`${styles.marquee} ${className ?? ""}`} aria-label={label}>
      <ul className="sr-only">
        {all.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      {rows.map((row, i) => (
        <div key={i} className={`${styles.track} ${i % 2 ? styles.reverse : ""}`} aria-hidden="true">
          {[0, 1].map((copy) =>
            row.map((tag) => (
              <span key={`${copy}-${tag}`} className={`mono ${styles.tag}`}>
                {tag}
              </span>
            )),
          )}
        </div>
      ))}
    </section>
  );
}
