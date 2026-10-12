import type { ReactNode } from "react";
import styles from "./Badge.module.css";

type BadgeProps = {
  children: ReactNode;
  variant?: "outline" | "solid" | "surface";
  className?: string;
};

/** Rótulo curto em mono e caixa alta (EMPRESA, 5 VÍDEOS, SÓ TEXTO). */
export function Badge({ children, variant = "outline", className }: BadgeProps) {
  return <span className={`mono ${styles.badge} ${styles[variant]} ${className ?? ""}`}>{children}</span>;
}
