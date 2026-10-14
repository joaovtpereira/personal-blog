import { useState } from "react";
import { FieldShell, TextArea } from "../Field";

type LinesFieldProps<T> = {
  id: string;
  label: string;
  hint?: string;
  value: T;
  parse: (text: string) => T;
  format: (value: T) => string;
  rows?: number;
  mono?: boolean;
  onChange: (value: T) => void;
};

/**
 * Lista editada como "uma linha por item". Guarda o texto digitado localmente para não
 * reformatar enquanto o autor escreve (linhas vazias, espaços). Use `key` para reiniciar.
 */
export function LinesField<T>({ id, label, hint, value, parse, format, rows = 6, mono, onChange }: LinesFieldProps<T>) {
  const [text, setText] = useState(() => format(value));
  return (
    <FieldShell htmlFor={id} label={label} hint={hint}>
      <TextArea
        id={id}
        rows={rows}
        mono={mono}
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          onChange(parse(event.target.value));
        }}
      />
    </FieldShell>
  );
}
