import styles from "./CollectionStack.module.css";

/** Três cartões empilhados flutuando; o da frente mostra quantos itens a coleção tem. */
export function CollectionStack({ count }: { count: number }) {
  return (
    <div className={styles.stack} aria-hidden="true">
      <span className={`${styles.card} ${styles.back}`} />
      <span className={`${styles.card} ${styles.middle}`} />
      <span className={`${styles.card} ${styles.front}`}>{count}</span>
    </div>
  );
}
