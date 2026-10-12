"use client";

import { Chip } from "../Chip";
import styles from "./ChipSelect.module.css";

type Option<T extends string> = { value: T; label: string };

type ChipSelectProps<T extends string> = {
  legend: string;
  /** Nome do campo enviado no formulário. */
  name: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  error?: string;
};

/** Escolha única com chips (ex.: assunto do contato). Envia o valor num input oculto. */
export function ChipSelect<T extends string>({ legend, name, options, value, onChange, error }: ChipSelectProps<T>) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={`mono ${styles.legend}`}>{legend}</legend>
      <div className={styles.options}>
        {options.map((option) => (
          <Chip
            key={option.value}
            selected={value === option.value}
            aria-pressed={value === option.value}
            className={styles.chip}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Chip>
        ))}
      </div>
      <input type="hidden" name={name} value={value} />
      {error && <p className={styles.error}>{error}</p>}
    </fieldset>
  );
}
