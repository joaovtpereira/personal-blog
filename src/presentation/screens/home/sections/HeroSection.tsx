import Image from "next/image";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/presentation/components/ButtonLink";
import { Icon } from "@/presentation/components/Icon";
import { RotatingWords } from "@/presentation/components/RotatingWords";
import { Seal } from "@/presentation/components/Seal";
import { richTags } from "@/presentation/i18n/rich";
import { ROUTES } from "@/main/routes";
import styles from "./HeroSection.module.css";

export function HeroSection() {
  const t = useTranslations("Home");
  const tc = useTranslations("Common");

  return (
    <section className={`wrap ${styles.hero}`} aria-labelledby="hero-title">
      <div className={styles.text}>
        <div className={`rise d1 mono ${styles.badge}`}>
          <span className={`pulse ${styles.dot}`} aria-hidden="true" />
          {t("badge")}
        </div>
        <h1 id="hero-title" className={styles.title}>
          <span className={`rise d2 ${styles.first}`}>João Vitor</span>
          <span className={`rise d3 serif ${styles.last}`}>
            Pereira
            <span className={`blink ${styles.cursor}`} aria-hidden="true">
              _
            </span>
          </span>
        </h1>
        <p className={`rise d4 ${styles.intro}`}>
          {t.rich("intro", richTags)} <RotatingWords words={t.raw("words") as string[]} />
        </p>
        <div className={`rise d5 ${styles.ctas}`}>
          <ButtonLink href={ROUTES.blog}>
            {t("ctaBlog")}
            <Icon name="arrowRight" strokeWidth={1.8} />
          </ButtonLink>
          <ButtonLink href={ROUTES.resume} variant="ghost">
            {tc("resume")}
          </ButtonLink>
        </div>
      </div>

      <div className={`rise d5 ${styles.visual}`}>
        <div className={`lift ${styles.portrait}`}>
          <Image
            className={`zoom ${styles.photo}`}
            src="/images/portrait.webp"
            alt={t("portraitAlt")}
            fill
            priority
            sizes="(min-width: 1200px) 50vw, (min-width: 768px) 45vw, 100vw"
          />
          <span className={`mono ${styles.location}`}>{t("location")}</span>
        </div>
        <Seal text={t("seal")} pathId="hero-seal" className={styles.seal} />
      </div>
    </section>
  );
}
