import { ProgressBar } from "@/presentation/components/ProgressBar";
import styles from "./RequirementMeter.module.css";

type RequirementMeterProps = { done: number; total: number; onClick: () => void };

/** Atalho do cabeçalho: quantos obrigatórios estão preenchidos. Abre a aba Dados. */
export function RequirementMeter({ done, total, onClick }: RequirementMeterProps) {
  const complete = total > 0 && done === total;
  return (
    <button
      type="button"
      className={`${styles.meter} ${complete ? styles.done : ""}`}
      onClick={onClick}
      aria-label={`Campos obrigatórios: ${done} de ${total} preenchidos. Abrir aba Dados.`}
    >
      <span className="mono">
        OBRIGATÓRIOS {done}/{total}
      </span>
      <span className={styles.bar} aria-hidden="true">
        <ProgressBar value={total ? done / total : 0} />
      </span>
    </button>
  );
}
