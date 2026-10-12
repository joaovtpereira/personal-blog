import type { ReactNode } from "react";
import { Link } from "@/main/i18n/navigation";
import type { NavHref } from "../../navigation";
import { Icon } from "../Icon";
import styles from "./TileCard.module.css";

type TileCardProps = {
  title: ReactNode;
  description?: string;
  href?: NavHref;
  /** Tile tracejado sem link (ex.: "Próximo projeto — EM BREVE"). */
  placeholderTag?: string;
  className?: string;
};

/** Tile secundário da grade de projetos: Currículo ou "Próximo projeto". */
export function TileCard({ title, description, href, placeholderTag, className }: TileCardProps) {
  if (!href) {
    return (
      <div className={`${styles.tile} ${styles.placeholder} ${className ?? ""}`}>
        <span className={`mono blink ${styles.tag}`}>{placeholderTag}</span>
        <div className={styles.soon}>{title}</div>
      </div>
    );
  }
  return (
    <Link href={href} className={`lift ${styles.tile} ${className ?? ""}`}>
      <Icon name="arrowUpRight" size={22} className={`arrow ${styles.arrow}`} />
      <div>
        <div className={styles.title}>{title}</div>
        {description && <div className={styles.description}>{description}</div>}
      </div>
    </Link>
  );
}
