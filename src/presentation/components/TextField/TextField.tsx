import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import styles from "./TextField.module.css";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
};

const a11y = (id: string, error?: string) =>
  ({
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  }) as const;

/** Campo sublinhado do DS: rótulo em mono, texto grande e linha que se preenche no foco. */
export function TextField({ id, label, error, className, ...rest }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldFrame id={id} label={label} error={error}>
      <input id={id} {...rest} {...a11y(id, error)} className={`${styles.control} ${className ?? ""}`} />
    </FieldFrame>
  );
}

/** Mesmo campo do DS, em várias linhas. */
export function TextAreaField({
  id,
  label,
  error,
  className,
  ...rest
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldFrame id={id} label={label} error={error}>
      <textarea id={id} {...rest} {...a11y(id, error)} className={`${styles.control} ${styles.area} ${className ?? ""}`} />
    </FieldFrame>
  );
}

function FieldFrame({ id, label, error, children }: FieldProps & { children: ReactNode }) {
  return (
    <div>
      <div className={`${styles.field} ${error ? styles.invalid : ""}`}>
        <label htmlFor={id} className={`mono ${styles.label}`}>
          {label}
        </label>
        {children}
      </div>
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
