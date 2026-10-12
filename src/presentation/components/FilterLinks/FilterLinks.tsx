import { Link } from "@/main/i18n/navigation";
import styles from "./FilterLinks.module.css";

type Href = { pathname: string; query: Record<string, string> };

export type CategoryOption = { id: string; label: string; count: number; href: Href; selected: boolean };

/**
 * Categorias como links (o filtro vive na URL).
 * Celular/tablet: chips com contador · Desktop: lista vertical na coluna lateral.
 */
export function CategoryLinks({ options, label, heading }: { options: CategoryOption[]; label: string; heading: string }) {
  return (
    <nav aria-label={label} className={styles.categories}>
      <div className={`mono ${styles.heading}`}>{heading}</div>
      <ul className={styles.categoryList}>
        {options.map((option) => (
          <li key={option.id}>
            <Link
              href={option.href}
              scroll={false}
              aria-current={option.selected ? "true" : undefined}
              className={`${styles.category} ${option.selected ? styles.on : ""}`}
            >
              {option.label}
              <span className={`mono ${styles.count}`}>{option.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export type TagOption = { name: string; href: Href; selected: boolean; label: string };

/** Tags tracejadas em mono; a selecionada fica invertida e remove o filtro ao tocar de novo. */
export function TagLinks({ options, label, heading }: { options: TagOption[]; label: string; heading: string }) {
  return (
    <nav aria-label={label} className={styles.tags}>
      <span className={`mono ${styles.heading}`}>{heading}</span>
      <ul className={styles.tagList}>
        {options.map((option) => (
          <li key={option.name}>
            <Link
              href={option.href}
              scroll={false}
              aria-current={option.selected ? "true" : undefined}
              aria-label={option.label}
              className={`mono ${styles.tag} ${option.selected ? styles.on : ""}`}
            >
              #{option.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
