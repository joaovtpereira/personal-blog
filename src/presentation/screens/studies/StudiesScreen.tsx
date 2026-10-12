import { useTranslations } from "next-intl";
import { totalLessons, type Study } from "@/domain/entities";
import { StatTile } from "@/presentation/components/StatTile";
import { StudiesCatalog } from "./sections/StudiesCatalog";
import styles from "./StudiesScreen.module.css";

export type StudiesScreenProps = {
  studies: Study[];
};

/**
 * Celular: título, texto, números e lista.
 * Tablet: título | texto lado a lado; números; grade de 2 colunas.
 * Desktop: título | números; linha; texto | filtros; grade de 3 colunas.
 */
export function StudiesScreen({ studies }: StudiesScreenProps) {
  const t = useTranslations("Studies");
  const lessons = studies.reduce((sum, study) => sum + totalLessons(study), 0);
  const videos = studies.reduce((sum, study) => sum + study.videoLessons, 0);

  return (
    <main id="conteudo" className={`wrap ${styles.screen}`}>
      <section className={styles.header} aria-labelledby="studies-page-title">
        <h1 id="studies-page-title" className={styles.title}>
          <span className={`rise d1 ${styles.line}`}>{t("titleLine1")}</span>
          <span className={`rise d2 serif ${styles.line} ${styles.accent}`}>{t("titleLine2")}</span>
        </h1>
        <p className={`rise d3 ${styles.lead}`}>{t("lead")}</p>
        <div className={`rise d4 ${styles.stats}`}>
          <StatTile size="hero" value={String(studies.length).padStart(2, "0")} label={t("stats.studies")} />
          <StatTile size="hero" value={String(lessons)} label={t("stats.lessons")} />
          <StatTile size="hero" value={String(videos)} label={t("stats.videos")} invertOnDesktop />
        </div>
      </section>
      <div className={styles.rule} aria-hidden="true" />

      <StudiesCatalog studies={studies} lead={t("lead")} />
    </main>
  );
}
