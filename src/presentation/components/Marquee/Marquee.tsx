import { Fragment } from "react";
import styles from "./Marquee.module.css";

/** Faixa de palavras infinita; uma sim, outra não em serif. Decorativa. */
export function Marquee({ items }: { items: string[] }) {
  const row = (copy: number) =>
    items.map((item, i) => (
      <Fragment key={`${copy}-${i}`}>
        <span className={i % 2 === 1 ? "serif" : undefined}>{item}</span>
        <span className={styles.star}>✦</span>
      </Fragment>
    ));

  return (
    <section className={styles.marquee} aria-hidden="true">
      <div className={styles.track}>
        {row(0)}
        {row(1)}
      </div>
    </section>
  );
}
