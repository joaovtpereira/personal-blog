import styles from "./PointsCard.module.css";

/** Card com rótulo em mono e lista curta (+ GOSTEI / − NEM TANTO). */
export function PointsCard({ label, items, className }: { label: string; items: string[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <section className={`${styles.card} ${className ?? ""}`} aria-label={label}>
      <div className={`mono ${styles.label}`}>{label}</div>
      <ul className={styles.list}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
