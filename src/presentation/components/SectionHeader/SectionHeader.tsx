import type { ReactNode } from "react";
import styles from "./SectionHeader.module.css";

type SectionHeaderProps = {
  title: ReactNode;
  id?: string;
  description?: ReactNode;
  aside?: ReactNode;
};

export function SectionHeader({ title, id, description, aside }: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.text}>
        <h2 id={id} className={styles.title}>
          {title}
        </h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {aside && <div className={styles.aside}>{aside}</div>}
    </div>
  );
}
