import { useTranslations } from "next-intl";
import { SECTIONS } from "@/main/routes";
import { ContactCta } from "@/presentation/components/ContactCta";
import { richTags } from "@/presentation/i18n/rich";
import styles from "./ContactSection.module.css";

export function ContactSection() {
  const t = useTranslations("Home.contact");

  return (
    <section id={SECTIONS.contact} className={`wrap ${styles.section}`} aria-label={t("tag")}>
      <ContactCta
        tag={t("tag")}
        title={t.rich("title", richTags)}
        description={t("description")}
        shortDescription={t("short")}
        formLabel={t("form")}
      />
    </section>
  );
}
