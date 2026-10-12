import type { ButtonHTMLAttributes } from "react";
import styles from "./Chip.module.css";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
};

/** Categoria/filtro sólido. Selecionado = superfície invertida. */
export function Chip({ selected = false, className, type = "button", ...rest }: ChipProps) {
  return (
    <button
      type={type}
      className={[styles.chip, selected ? styles.on : "", className ?? ""].join(" ")}
      {...rest}
    />
  );
}
