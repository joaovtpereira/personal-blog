import type { ComponentProps } from "react";
import styles from "./Button.module.css";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "ghost" | "outlineCurrent";
  size?: "m" | "l";
  block?: boolean;
};

/** Botão pílula do DS. "outlineCurrent" usa a cor do texto (para superfícies invertidas). */
export function Button({ variant = "primary", size = "m", block = false, className, type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={[styles.button, styles[variant], styles[size], block ? styles.block : "", className ?? ""].join(" ")}
      {...rest}
    />
  );
}
