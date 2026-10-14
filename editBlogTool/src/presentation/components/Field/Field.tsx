import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import styles from "./Field.module.css";

type FieldShellProps = {
  /** id do controle; sem id o rótulo vira legenda do grupo */
  htmlFor?: string;
  label: string;
  badge?: ReactNode;
  hint?: ReactNode;
  /** obrigatório pendente: borda tracejada */
  missing?: boolean;
  children: ReactNode;
};

/** Rótulo em mono + selo + controle + dica. Campo compacto das colunas do editor. */
export function FieldShell({ htmlFor, label, badge, hint, missing = false, children }: FieldShellProps) {
  const Label = htmlFor ? "label" : "span";
  return (
    <div className={`${styles.field} ${missing ? styles.missing : ""}`}>
      <div className={styles.head}>
        <Label className={`mono ${styles.label}`} {...(htmlFor ? { htmlFor } : {})}>
          {label}
        </Label>
        {badge}
      </div>
      {children}
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

export function TextInput({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input type="text" {...rest} className={`${styles.control} ${className ?? ""}`} />;
}

export function TextArea({ className, mono = false, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { mono?: boolean }) {
  return <textarea rows={3} {...rest} className={`${styles.control} ${mono ? styles.mono : ""} ${className ?? ""}`} />;
}

type Option = { value: string; label: string };

export function SelectInput({ options, placeholder, className, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { options: Option[]; placeholder?: string }) {
  return (
    <select {...rest} className={`${styles.control} ${className ?? ""}`}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function CheckboxField({ label, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={styles.check}>
      <input type="checkbox" {...rest} />
      {label}
    </label>
  );
}

export function FieldHint({ children }: { children: ReactNode }) {
  return <p className={styles.hint}>{children}</p>;
}
