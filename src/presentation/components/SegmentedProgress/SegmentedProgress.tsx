import styles from "./SegmentedProgress.module.css";

export type SegmentState = "done" | "current" | "todo" | "upcoming";

/** Um segmento por item: visto (cinza), atual (metade em fg), a fazer (vazio), em breve (tracejado). */
export function SegmentedProgress({ segments, label }: { segments: SegmentState[]; label?: string }) {
  return (
    <div
      className={styles.track}
      style={{ gridTemplateColumns: `repeat(${segments.length}, minmax(0, 1fr))` }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {segments.map((state, i) => (
        <span key={i} className={`${styles.segment} ${styles[state]}`}>
          <span className={styles.fill} style={{ animationDelay: `${0.3 + i * 0.08}s` }} />
        </span>
      ))}
    </div>
  );
}
