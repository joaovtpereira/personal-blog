import styles from "./Tag.module.css";

/** Tag de texto (#religião, #filmes): pill fina em mono. */
export function Tag({ name }: { name: string }) {
  return <span className={`mono ${styles.tag}`}>#{name}</span>;
}
