import Image from "next/image";
import { useTranslations } from "next-intl";
import { yearsOfExperience, type Resume } from "@/domain/entities";
import { EXTERNAL, ROUTES } from "@/main/routes";
import { ButtonLink } from "@/presentation/components/ButtonLink";
import { Icon } from "@/presentation/components/Icon";
import { PulseDot } from "@/presentation/components/PulseDot";
import { StatTile } from "@/presentation/components/StatTile";
import { richTags } from "@/presentation/i18n/rich";
import styles from "./ResumeHero.module.css";

const PORTRAIT = "/images/portrait.webp";

/**
 * Celular: avatar redondo + local, título, resumo e 3 números.
 * Tablet: texto + foto grande; números abaixo.
 * Desktop: números flutuando sobre a foto e botão "Vamos conversar".
 */
export function ResumeHero({ resume }: { resume: Resume }) {
  const t = useTranslations("Resume");
  const years = `${yearsOfExperience(resume)}+`;
  const platforms = resume.platforms.join(" · ");

  return (
    <>
      <section className={`wrap ${styles.hero}`} aria-labelledby="resume-title">
        <div className={styles.text}>
          <div className={`rise d1 ${styles.avatarRow}`}>
            <div className={styles.avatar}>
              <Image src={PORTRAIT} alt={t("avatarAlt")} width={72} height={72} className={styles.avatarImage} priority />
              <PulseDot size={14} outlined className={styles.avatarDot} />
            </div>
            <span className={`mono ${styles.location}`}>{resume.location}</span>
          </div>
          <div className={`rise d1 ${styles.locationRow}`}>
            <PulseDot />
            <span className={`mono ${styles.location}`}>{resume.location}</span>
          </div>

          <h1 id="resume-title" className={styles.title}>
            <span className={`rise d2 ${styles.line}`}>{t("titleLine1")}</span>
            <span className={`rise d3 ${styles.line}`}>{t.rich("titleLine2", richTags)}</span>
          </h1>
          <p className={`rise d4 ${styles.summary}`}>{resume.summary}</p>

          <div className={`rise d5 ${styles.actions}`}>
            <ButtonLink href={EXTERNAL.linkedin} external variant="ghost" size="s" className={styles.tabletOnly}>
              {t("linkedin")}
              <Icon name="arrowUpRight" size={16} />
            </ButtonLink>
            <ButtonLink href={ROUTES.contact} className={styles.desktopOnly}>
              {t("talk")}
            </ButtonLink>
          </div>
        </div>

        <div className={`rise d3 ${styles.visual}`}>
          <div className={`lift ${styles.portrait}`}>
            <Image
              className={`zoom ${styles.photo}`}
              src={PORTRAIT}
              alt={t("avatarAlt")}
              fill
              sizes="(min-width: 1200px) 50vw, 50vw"
            />
          </div>
          <div className={styles.floating}>
            <StatTile value={years} label={t("stats.years")} variant="surface" size="compact" />
            <StatTile value={String(resume.platforms.length)} label={t("stats.platforms")} detail={platforms} variant="inverted" size="compact" />
          </div>
        </div>
      </section>

      <div className={`wrap rise d5 ${styles.stats}`}>
        <StatTile value={years} label={t("stats.years")} />
        <StatTile value={String(resume.platforms.length)} label={t("stats.platforms")} detail={platforms} />
        <StatTile value={String(resume.companiesCount)} label={t("stats.companies", { count: resume.companiesCount })} />
      </div>
    </>
  );
}
