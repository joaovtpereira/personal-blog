import Image from "next/image";
import type { Project } from "@/domain/entities";
import { projectFullName } from "@/domain/entities";
import { Badge } from "../Badge";
import { Icon } from "../Icon";
import styles from "./AppCard.module.css";

type AppCardProps = {
  project: Project;
  label: string;
  screenAlt: string;
};

/** Card de app com captura em P&B, ícone flutuando e plataformas. */
export function AppCard({ project, label, screenAlt }: AppCardProps) {
  const name = projectFullName(project);
  return (
    <a className={`lift ${styles.card}`} href={project.url} target="_blank" rel="noopener noreferrer">
      <div className={styles.media}>
        {project.coverImage && (
          <Image
            className={`zoom ${styles.cover}`}
            src={project.coverImage}
            alt={screenAlt}
            fill
            sizes="(min-width: 1200px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        )}
        {project.iconImage && (
          <Image className={`float ${styles.icon}`} src={project.iconImage} alt="" width={64} height={64} />
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.head}>
          <div>
            <h3 className={styles.name}>{name}</h3>
            <p className={styles.description}>{project.description}</p>
            <span className={`mono ${styles.platformLine}`}>{project.platforms.join(" · ").toUpperCase()}</span>
          </div>
          <Badge className={styles.mobileOnly}>{label}</Badge>
          <Icon name="arrowUpRight" size={24} className={`arrow ${styles.fromTablet}`} />
        </div>
        <div className={`${styles.platforms} ${styles.mobileOnly}`}>
          {project.platforms.map((platform) => (
            <span key={platform} className={`mono ${styles.platform}`}>
              {platform}
            </span>
          ))}
        </div>
        <div className={`${styles.footer} ${styles.mobileOnly}`}>
          <span className="mono">{project.displayUrl}</span>
          <Icon name="arrowUpRight" size={20} className="arrow" />
        </div>
      </div>
    </a>
  );
}
