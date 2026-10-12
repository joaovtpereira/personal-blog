import type { ReactNode } from "react";
import { Link } from "@/main/i18n/navigation";
import type { NavHref } from "../../navigation";
import { Icon } from "../Icon";
import styles from "./ShortcutCard.module.css";

type ShortcutCardProps = {
  index: number;
  title: ReactNode;
  description: string;
  href: NavHref;
  inverted?: boolean;
};

/** Atalho numerado da grade 2×2 da home no celular. */
export function ShortcutCard({ index, title, description, href, inverted = false }: ShortcutCardProps) {
  return (
    <Link href={href} className={`lift ${styles.card} ${inverted ? styles.inverted : ""}`}>
      <div className={styles.top}>
        <span className={`mono ${styles.num}`}>{String(index).padStart(2, "0")}</span>
        <Icon name="arrowUpRight" className="arrow" />
      </div>
      <div>
        <div className={inverted ? `serif ${styles.titleSerif}` : styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </Link>
  );
}
