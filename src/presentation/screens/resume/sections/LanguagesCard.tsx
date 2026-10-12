import { useTranslations } from "next-intl";
import type { ResumeLanguage } from "@/domain/entities";
import styles from "./LanguagesCard.module.css";

/** Celular: linhas com borda · Tablet: 3 cards · Desktop: card lateral com divisórias. */
export function LanguagesCard({ languages }: { languages: ResumeLanguage[] }) {
  const t = useTranslations("Resume.languages");
  const has = (code: string) => t.has(`names.${code}` as never);

  return (
    <section className={styles.section} aria-labelledby="languages-title">
      <h2 id="languages-title" className={styles.title}>
        {t("title")}
      </h2>
      <ul className={styles.list}>
        {languages.map((language) => (
          <li key={language.code} className={styles.item}>
            <span className={styles.name}>{has(language.code) ? t(`names.${language.code}` as never) : language.code.toUpperCase()}</span>
            <span className={`mono ${styles.level}`}>{t(`levels.${language.level}`)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
