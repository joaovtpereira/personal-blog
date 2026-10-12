import styles from "./ProgressBar.module.css";

type ProgressBarProps = {
  /** 0 a 1 */
  value: number;
  label?: string;
};

export function ProgressBar({ value, label }: ProgressBarProps) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={label}
    >
      <div className={styles.fill} style={{ width: `${pct}%` }} />
    </div>
  );
}
