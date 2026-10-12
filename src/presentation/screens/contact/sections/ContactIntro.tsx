import { useTranslations } from "next-intl";
import { Icon } from "@/presentation/components/Icon";
import styles from "./ContactIntro.module.css";

export function ContactIntro() {
  const t = useTranslations("Contact");

  return (
    <div className={styles.intro}>
      <h1 className={styles.title}>
        <span className={`rise d1 ${styles.line}`}>{t("titleLine1")}</span>
        <span className={`rise d2 ${styles.line}`}>
          <span className={`serif ${styles.accent}`}>{t("titleLine2")}</span>{" "}
          <span className={styles.wave} aria-hidden="true">
            <Icon name="wave" size={56} strokeWidth={1.3} className={styles.hand} />
          </span>
        </span>
      </h1>
      <p className={`rise d3 ${styles.lead}`}>{t("lead")}</p>
    </div>
  );
}
