import type { ReactNode } from "react";
import { Link } from "@/main/i18n/navigation";
import { Icon } from "../Icon";
import styles from "./CtaCard.module.css";

type CtaCardProps = {
  href: string;
  title: ReactNode;
  /** Linha em mono abaixo do título, mostrada no layout empilhado. */
  footnote?: string;
  /** row: título + seta lado a lado · stacked: título e nota empilhados (colunas laterais). */
  layout?: "row" | "stacked";
  className?: string;
};

/** Card invertido de chamada para ação ("Fale comigo"). */
export function CtaCard({ href, title, footnote, layout = "row", className }: CtaCardProps) {
  return (
    <Link href={href} className={`lift ${styles.card} ${styles[layout]} ${className ?? ""}`}>
      <span className={styles.title}>{title}</span>
      {layout === "row" ? (
        <Icon name="arrowUpRight" size={22} className={`arrow ${styles.arrow}`} />
      ) : (
        footnote && <span className={`mono ${styles.footnote}`}>{footnote}</span>
      )}
    </Link>
  );
}
