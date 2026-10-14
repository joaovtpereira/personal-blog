import { useRef, type KeyboardEvent } from "react";
import styles from "./ScoreSelector.module.css";

type ScoreSelectorProps = {
  label: string;
  value: number | null;
  scores: readonly number[];
  onChange: (score: number) => void;
};

/** Nota de 0 a 5 (radiogroup com setas do teclado). Tracejado até escolher. */
export function ScoreSelector({ label, value, scores, onChange }: ScoreSelectorProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const index = value === null ? -1 : scores.indexOf(value);

  const onKeyDown = (event: KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = Math.min(scores.length - 1, Math.max(0, (index < 0 ? 0 : index) + step));
    onChange(scores[next]);
    refs.current[next]?.focus();
  };

  return (
    <div role="radiogroup" aria-label={label} className={`${styles.group} ${value === null ? styles.missing : ""}`} onKeyDown={onKeyDown}>
      {scores.map((score, i) => {
        const on = score === value;
        return (
          <button
            key={score}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on || (index < 0 && i === 0) ? 0 : -1}
            className={`mono ${on ? styles.on : ""}`}
            onClick={() => onChange(score)}
          >
            {score}
          </button>
        );
      })}
    </div>
  );
}
