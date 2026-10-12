import { useTranslations } from "next-intl";
import { ROUTES, SECTIONS } from "@/main/routes";
import { ShortcutCard } from "@/presentation/components/ShortcutCard";
import styles from "./ShortcutsSection.module.css";

/** Grade 2×2 de atalhos — só no celular. */
export function ShortcutsSection() {
  const t = useTranslations("Home.shortcuts");
  const tc = useTranslations("Common");

  return (
    <nav className={`wrap ${styles.grid}`} aria-label={tc("navigation")}>
      <ShortcutCard index={1} title={tc("resume")} description={t("resume")} href={ROUTES.resume} />
      <ShortcutCard index={2} title={tc("blog")} description={t("blog")} href={ROUTES.blog} inverted />
      <ShortcutCard
        index={3}
        title={tc("projects")}
        description={t("projects")}
        href={{ pathname: "/", hash: SECTIONS.projects }}
      />
      <ShortcutCard index={4} title={tc("contact")} description={t("contact")} href={ROUTES.contact} />
    </nav>
  );
}
