import { Link } from "@/main/i18n/navigation";
import { Icon } from "../Icon";
import styles from "./Pagination.module.css";

type Href = { pathname: string; query: Record<string, string> };

type PaginationProps = {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => Href;
  label: string;
  pageLabel: (page: number) => string;
  previousLabel: string;
  nextLabel: string;
  className?: string;
};

/** Páginas numeradas (com reticências quando são muitas). */
export function Pagination({ page, pageCount, hrefFor, label, pageLabel, previousLabel, nextLabel, className }: PaginationProps) {
  if (pageCount <= 1) return null;
  const pages = visiblePages(page, pageCount);

  return (
    <nav aria-label={label} className={`${styles.nav} ${className ?? ""}`}>
      {page > 1 && (
        <Link href={hrefFor(page - 1)} className={styles.step} aria-label={previousLabel}>
          <Icon name="chevronLeft" size={16} />
        </Link>
      )}
      {pages.map((item, i) =>
        item === null ? (
          <span key={`gap-${i}`} className={`mono ${styles.gap}`} aria-hidden="true">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-label={pageLabel(item)}
            aria-current={item === page ? "page" : undefined}
            className={`${styles.page} ${item === page ? styles.on : ""}`}
          >
            {item}
          </Link>
        ),
      )}
      {page < pageCount && (
        <Link href={hrefFor(page + 1)} className={styles.step} aria-label={nextLabel}>
          <Icon name="arrowRight" size={16} />
        </Link>
      )}
    </nav>
  );
}

/** 1 … 4 5 6 … 12 */
function visiblePages(page: number, count: number): (number | null)[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const set = new Set([1, count, page - 1, page, page + 1].filter((n) => n >= 1 && n <= count));
  const sorted = [...set].sort((a, b) => a - b);
  return sorted.flatMap((n, i) => (i > 0 && n - sorted[i - 1] > 1 ? [null, n] : [n]));
}

/** "Carregar mais": leva para a próxima página mantendo as anteriores na tela. */
export function LoadMoreLink({ href, label, className }: { href: Href; label: string; className?: string }) {
  return (
    <Link href={href} scroll={false} className={`${styles.loadMore} ${className ?? ""}`}>
      {label}
    </Link>
  );
}
