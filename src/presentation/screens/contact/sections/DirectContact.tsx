import { useTranslations } from "next-intl";
import { EXTERNAL } from "@/main/routes";
import { CopyField } from "@/presentation/components/CopyField";
import { LinkRow } from "@/presentation/components/LinkRow";
import styles from "./DirectContact.module.css";

export function DirectContact() {
  const t = useTranslations("Contact.direct");

  return (
    <section className={`rise d4 ${styles.direct}`} aria-labelledby="direct-title">
      <h2 id="direct-title" className={`mono ${styles.label}`}>
        {t("label")}
      </h2>
      <div className={styles.copy}>
        <CopyField
          value={EXTERNAL.email}
          copyLabel={t("copy")}
          copiedLabel={t("copied")}
          ariaLabel={t("copyAria", { email: EXTERNAL.email })}
        />
      </div>
      <div className={styles.links}>
        <LinkRow href={EXTERNAL.linkedin}>LinkedIn</LinkRow>
        <LinkRow href={EXTERNAL.byteKickStudio}>
          ByteKickStudio <span className={`serif ${styles.muted}`}>{t("company")}</span>
        </LinkRow>
      </div>
    </section>
  );
}
