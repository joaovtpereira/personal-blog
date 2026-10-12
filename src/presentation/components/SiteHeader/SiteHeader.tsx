"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/main/i18n/navigation";
import { HEADER_ORDER, NAV_ITEMS, isActive } from "../../navigation";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { MobileMenu } from "../MobileMenu";
import { Monogram } from "../Monogram";
import { ThemeToggle } from "../ThemeToggle";
import styles from "./SiteHeader.module.css";

/**
 * Celular: monograma · idioma · tema · Menu.
 * Tablet: monograma · navegação em pílula · idioma · tema.
 * Desktop: monograma + nome · links de texto · PT/ES/EN · tema (fixo no topo).
 */
export function SiteHeader() {
  const t = useTranslations("Common");
  const pathname = usePathname();
  const items = HEADER_ORDER.map((key) => NAV_ITEMS.find((item) => item.key === key)!);

  return (
    <header className={styles.header}>
      <div className={`wrap rise ${styles.inner}`}>
        <Monogram label={t("homeLink")} name="João Vitor Pereira" />

        <nav aria-label={t("mainMenu")} className={styles.nav}>
          {items.map((item) => {
            const active = isActive(item, pathname);
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`${styles.link} ${styles[item.header]} ${active ? styles.active : ""}`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <LanguageSwitcher variant="cycle" className={styles.belowDesktop} />
          <LanguageSwitcher variant="segmented" className={styles.desktopOnly} />
          <ThemeToggle />
          <MobileMenu className={styles.mobileOnly} />
        </div>
      </div>
    </header>
  );
}
