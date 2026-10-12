"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CopyField.module.css";

type CopyFieldProps = {
  value: string;
  copyLabel: string;
  copiedLabel: string;
  ariaLabel: string;
};

/** Valor em mono com botão "Copiar" que confirma por 1,8s. */
export function CopyField({ value, copyLabel, copiedLabel, ariaLabel }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = () => {
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
    // Sem permissão de área de transferência o valor continua visível para copiar à mão.
    navigator.clipboard?.writeText(value).catch(() => {});
  };

  return (
    <div className={styles.field}>
      <span className={`mono ${styles.value}`}>{value}</span>
      <button type="button" className={`${styles.button} ${copied ? styles.on : ""}`} aria-label={ariaLabel} onClick={copy}>
        <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
      </button>
    </div>
  );
}
