import { Link } from "@/main/i18n/navigation";
import { ROUTES } from "@/main/routes";
import styles from "./Monogram.module.css";

type MonogramProps = {
  label: string;
  /** Mostra o nome completo ao lado (desktop). */
  name?: string;
};

export function Monogram({ label, name }: MonogramProps) {
  return (
    <Link href={ROUTES.home} aria-label={label} className={styles.link}>
      <span className={`mono ${styles.mark}`} aria-hidden="true">
        JVP
      </span>
      {name && (
        <span className={styles.name} aria-hidden="true">
          {name}
        </span>
      )}
    </Link>
  );
}
