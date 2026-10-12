import styles from "./FactSheet.module.css";

export type Fact = { label: string; value: string };

type FactSheetProps = {
  facts: Fact[];
  /** Colunas da grade no celular/tablet (no desktop vira lista). */
  columns?: 2 | 3;
  title?: string;
  /** "list": sempre em lista (ex.: coluna lateral). */
  layout?: "grid" | "list";
  className?: string;
};

/** Ficha técnica: rótulo em mono + valor. Grade com divisórias ou lista. */
export function FactSheet({ facts, columns = 3, title, layout = "grid", className }: FactSheetProps) {
  return (
    <dl
      className={`${styles.sheet} ${styles[layout]} ${className ?? ""}`}
      style={{ ["--columns" as string]: columns }}
      aria-label={title}
    >
      {title && <div className={`mono ${styles.title}`}>{title}</div>}
      {facts.map((fact) => (
        <div key={fact.label} className={styles.fact}>
          <dt className="mono">{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
