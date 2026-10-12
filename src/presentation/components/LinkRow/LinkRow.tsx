import type { ReactNode } from "react";
import { Icon } from "../Icon";
import styles from "./LinkRow.module.css";

type LinkRowProps = {
  href: string;
  children: ReactNode;
};

/** Linha grande de link externo com seta; desliza no hover. */
export function LinkRow({ href, children }: LinkRowProps) {
  return (
    <a className={styles.row} href={href} target="_blank" rel="noopener noreferrer">
      <span>{children}</span>
      <Icon name="arrowUpRight" className={styles.arrow} />
    </a>
  );
}
