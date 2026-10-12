import styles from "./InfoLinkCard.module.css";

type InfoLinkCardProps = {
  href: string;
  label: string;
  title: string;
  meta?: string;
  className?: string;
};

/** Card com rótulo em mono, título e meta — link externo (ex.: empresa atual). */
export function InfoLinkCard({ href, label, title, meta, className }: InfoLinkCardProps) {
  return (
    <a className={`lift ${styles.card} ${className ?? ""}`} href={href} target="_blank" rel="noopener noreferrer">
      <span className={`mono ${styles.label}`}>{label}</span>
      <span className={styles.title}>{title}</span>
      {meta && <span className={`mono ${styles.meta}`}>{meta}</span>}
    </a>
  );
}
