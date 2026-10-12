"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "../Icon";
import styles from "./SearchField.module.css";

type SearchFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  clearLabel: string;
  submitLabel: string;
  value: string;
  /** Chamado ao digitar (com espera) e ao enviar. */
  onSearch: (value: string) => void;
  /** Espera depois da última tecla, em ms. */
  debounceMs?: number;
  className?: string;
};

/** Campo de busca em pílula com ícone; busca enquanto digita e ao apertar Enter. */
export function SearchField({ id, label, placeholder, clearLabel, submitLabel, value, onSearch, debounceMs = 400, className }: SearchFieldProps) {
  const [text, setText] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const last = useRef(value);

  // Mantém o campo em sincronia quando a URL muda por fora (voltar do navegador, limpar filtros).
  useEffect(() => {
    if (value !== last.current) {
      last.current = value;
      setText(value);
    }
  }, [value]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const emit = (next: string) => {
    clearTimeout(timer.current);
    const trimmed = next.trim();
    if (trimmed === last.current) return;
    last.current = trimmed;
    onSearch(trimmed);
  };

  const change = (next: string) => {
    setText(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => emit(next), debounceMs);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    emit(text);
  };

  return (
    <form role="search" className={className} onSubmit={submit}>
      <label htmlFor={id} className={`mono ${styles.label}`}>
        {label}
      </label>
      <div className={styles.field}>
        <Icon name="search" size={18} className={styles.icon} />
        <input
          id={id}
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          placeholder={placeholder}
          value={text}
          onChange={(event) => change(event.target.value)}
          className={styles.input}
        />
        {text && (
          <button type="button" className={styles.clear} aria-label={clearLabel} onClick={() => change("")}>
            <Icon name="close" size={14} />
          </button>
        )}
        <button type="submit" className="sr-only">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
