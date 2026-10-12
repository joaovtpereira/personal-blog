"use client";

import { useId, useState } from "react";
import type { RichText } from "@/domain/entities";
import { RichTextView } from "./RichTextView";
import styles from "./Content.module.css";

type ChecklistProps = { title: string | null; items: { text: RichText; checked: boolean }[] };

/** Tarefas que o leitor marca (só nesta visita). */
export function Checklist({ title, items }: ChecklistProps) {
  const id = useId();
  const [checked, setChecked] = useState(() => items.map((item) => item.checked));
  return (
    <fieldset className={styles.checklist}>
      {title && <legend className={`mono ${styles.blockLabel}`}>{title}</legend>}
      {items.map((item, i) => (
        <label key={i} className={styles.checkItem} htmlFor={`${id}-${i}`}>
          <input
            id={`${id}-${i}`}
            type="checkbox"
            checked={checked[i]}
            onChange={() => setChecked((list) => list.map((value, j) => (j === i ? !value : value)))}
          />
          <span className={styles.checkBox} aria-hidden="true" />
          <span className={checked[i] ? styles.checkDone : undefined}>
            <RichTextView text={item.text} />
          </span>
        </label>
      ))}
    </fieldset>
  );
}
