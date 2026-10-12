import type { Project } from "@/domain/entities";
import { Badge } from "../Badge";
import { Icon } from "../Icon";
import styles from "./CompanyCard.module.css";

type CompanyCardProps = {
  project: Project;
  label: string;
};

/** Celular: card claro com selo EMPRESA. Tablet/desktop: superfície invertida que ocupa duas linhas. */
export function CompanyCard({ project, label }: CompanyCardProps) {
  return (
    <a className={`lift ${styles.card}`} href={project.url} target="_blank" rel="noopener noreferrer">
      <div className={styles.top}>
        <span className={styles.logo}>
          <Icon name="code" size={26} strokeWidth={1.8} />
        </span>
        <Badge className={styles.mobileOnly}>{label}</Badge>
        <Icon name="arrowUpRight" size={26} className={`arrow ${styles.fromTablet}`} />
      </div>
      <div className={styles.body}>
        <span className={`mono ${styles.label} ${styles.fromTablet}`}>{label}</span>
        <h3 className={styles.name}>
          {project.name}
          {project.nameAccent && <span className={styles.accent}>{project.nameAccent}</span>}
        </h3>
        <p className={styles.description}>{project.description}</p>
        <span className={`mono ${styles.url} ${styles.fromTablet}`}>{project.displayUrl}</span>
      </div>
      <div className={`${styles.footer} ${styles.mobileOnly}`}>
        <span className="mono">{project.displayUrl}</span>
        <Icon name="arrowUpRight" size={20} className="arrow" />
      </div>
    </a>
  );
}
