import { useTranslations } from "next-intl";
import type { ResumeEducation } from "@/domain/entities";
import styles from "./EducationCard.module.css";

export function EducationCard({ education, delay = 0 }: { education: ResumeEducation; delay?: number }) {
  const t = useTranslations("Resume.thesis");
  const period = `${education.startYear} — ${education.endYear ?? "…"}`;

  return (
    <article className={`lift ${styles.card}`} style={{ animationDelay: `${delay}s` }}>
      <div className={`mono ${styles.when}`}>{period}</div>
      <h3 className={styles.degree}>{education.degree}</h3>
      <div className={`serif ${styles.place}`}>{education.institution}</div>
      {education.thesis && (
        <div className={styles.thesis}>
          <div className={`mono ${styles.thesisLabel}`}>{t("label", { year: education.thesis.year })}</div>
          <div className={styles.thesisTitle}>{education.thesis.title}</div>
          <p className={styles.thesisSummary}>{education.thesis.summary}</p>
          <a className={`ul ${styles.link}`} href={education.thesis.url} target="_blank" rel="noopener noreferrer">
            {t("link", { institution: education.institutionShort })}
          </a>
        </div>
      )}
    </article>
  );
}
