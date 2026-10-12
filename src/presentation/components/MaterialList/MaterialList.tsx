import { useTranslations } from "next-intl";
import type { LessonMaterial } from "@/domain/entities";
import styles from "./MaterialList.module.css";

/** Material de apoio: título + tipo (PDF ↓, LINK ↗). */
export function MaterialList({ materials }: { materials: LessonMaterial[] }) {
  const t = useTranslations("Lesson.materialKind");
  return (
    <ul className={styles.list}>
      {materials.map((material) => (
        <li key={material.id}>
          <a
            className={styles.row}
            href={material.url}
            target="_blank"
            rel="noopener noreferrer"
            {...(material.kind !== "link" ? { download: "" } : {})}
          >
            <span>{material.title}</span>
            <span className={`mono ${styles.kind}`}>{t(material.kind)}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
