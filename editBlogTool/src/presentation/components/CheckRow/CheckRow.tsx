import styles from "./CheckRow.module.css";

type CheckRowProps = {
  ok: boolean;
  text: string;
  value?: string | null;
  /** "warn": recomendação (não bloqueia) · "required": obrigatório (bloqueia) */
  tone?: "required" | "warn";
};

/** Linha da checagem antes de exportar. */
export function CheckRow({ ok, text, value, tone = "required" }: CheckRowProps) {
  return (
    <li className={styles.row}>
      <span className={`${styles.icon} ${ok ? styles.ok : styles[tone]}`} aria-hidden="true">
        {ok ? "✓" : "!"}
      </span>
      <span>
        {text}
        <span className="sr-only">{ok ? " — ok" : tone === "warn" ? " — recomendado" : " — pendente"}</span>
      </span>
      <span className={`mono ${styles.value}`}>{ok ? (value ?? "") : tone === "required" ? "pendente" : ""}</span>
    </li>
  );
}
