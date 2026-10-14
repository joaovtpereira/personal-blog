import styles from "./RequiredBadge.module.css";

type RequiredBadgeProps = { ok: boolean; problem?: "missing" | "invalid" | null };

/** Selo do campo obrigatório: tracejado enquanto falta, sólido quando está OK. */
export function RequiredBadge({ ok, problem }: RequiredBadgeProps) {
  return (
    <span className={`mono ${styles.badge} ${ok ? styles.ok : ""}`}>
      {ok ? "✓ OK" : problem === "invalid" ? "Inválido" : "Obrigatório"}
    </span>
  );
}
