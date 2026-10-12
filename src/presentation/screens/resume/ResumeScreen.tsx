import { useTranslations } from "next-intl";
import type { Resume } from "@/domain/entities";
import { EXTERNAL, ROUTES } from "@/main/routes";
import { CtaCard } from "@/presentation/components/CtaCard";
import { InfoLinkCard } from "@/presentation/components/InfoLinkCard";
import { TagMarquee } from "@/presentation/components/TagMarquee";
import { richTags } from "@/presentation/i18n/rich";
import { LanguagesCard } from "./sections/LanguagesCard";
import { ResumeHero } from "./sections/ResumeHero";
import { ResumeTabs } from "./sections/ResumeTabs";
import styles from "./ResumeScreen.module.css";

/** Quantas tags vão na 1ª faixa no celular/tablet; o resto corre ao contrário na 2ª. */
const FIRST_ROW = 5;

export type ResumeScreenProps = {
  resume: Resume | null;
};

export function ResumeScreen({ resume }: ResumeScreenProps) {
  const t = useTranslations("Resume");

  if (!resume) {
    return (
      <main id="conteudo" className={`wrap ${styles.empty}`}>
        <p>{t("empty")}</p>
      </main>
    );
  }

  const cta = t.rich("cta", richTags);

  return (
    <main id="conteudo">
      <ResumeHero resume={resume} />

      <TagMarquee
        label={t("stackLabel")}
        rows={[resume.stack.slice(0, FIRST_ROW), resume.stack.slice(FIRST_ROW)]}
        className={`${styles.marquee} ${styles.belowDesktop}`}
      />
      <TagMarquee label={t("stackLabel")} rows={[resume.stack]} className={`${styles.marquee} ${styles.desktopOnly}`} />

      <section className={`wrap ${styles.body}`}>
        <div className={styles.main}>
          <ResumeTabs experiences={resume.experiences} education={resume.education} skills={resume.skills} />
        </div>

        <aside className={styles.aside}>
          <LanguagesCard languages={resume.languages} />
          {resume.currentCompany && (
            <InfoLinkCard
              className={styles.desktopOnly}
              href={resume.currentCompany.url}
              label={t("currentCompany", { role: resume.currentCompany.role.toUpperCase() })}
              title={resume.currentCompany.name}
              meta={resume.currentCompany.displayUrl}
            />
          )}
          <CtaCard href={ROUTES.contact} title={cta} className={`${styles.cta} ${styles.belowDesktop}`} />
          <CtaCard
            href={ROUTES.contact}
            title={cta}
            layout="stacked"
            footnote={EXTERNAL.email}
            className={styles.desktopOnly}
          />
        </aside>
      </section>
    </main>
  );
}
