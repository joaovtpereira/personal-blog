import { useTranslations } from "next-intl";
import { EXTERNAL } from "@/main/routes";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const t = useTranslations("Common");
  const year = new Date().getFullYear();

  return (
    <footer className={`wrap ${styles.footer}`}>
      <div className={styles.row}>
        <div className={styles.links}>
          <a className="ul" href={EXTERNAL.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a className="ul" href={`mailto:${EXTERNAL.email}`}>
            {EXTERNAL.email}
          </a>
        </div>
        <div className={`mono ${styles.meta}`}>
          <span>{t("copyright", { year })}</span>
          <span className={styles.langs}>{t("languages")}</span>
          <a className={`ul ${styles.top}`} href="#top">
            {t("backToTop")} ↑
          </a>
        </div>
      </div>
      <div className={styles.wordmark} aria-hidden="true">
        jvp<span className="serif">.</span>
      </div>
    </footer>
  );
}
