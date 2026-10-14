import styles from "./ChoiceGroup.module.css";

type Choice<T extends string> = { value: T; label: string; description: string };

type ChoiceGroupProps<T extends string> = {
  label: string;
  choices: Choice<T>[];
  value: T | null;
  onChange: (value: T) => void;
};

/** Escolha única em cartões com rádio (ex.: "Continua uma resenha anterior?"). */
export function ChoiceGroup<T extends string>({ label, choices, value, onChange }: ChoiceGroupProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={`${styles.group} ${value === null ? styles.missing : ""}`}>
      {choices.map((choice) => {
        const on = choice.value === value;
        return (
          <button
            key={choice.value}
            type="button"
            role="radio"
            aria-checked={on}
            className={`${styles.choice} ${on ? styles.on : ""}`}
            onClick={() => onChange(choice.value)}
          >
            <span className={styles.radio} aria-hidden="true" />
            <span>
              {choice.label}
              <small>{choice.description}</small>
            </span>
          </button>
        );
      })}
    </div>
  );
}
