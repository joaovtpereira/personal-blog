"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/main/i18n/navigation";
import { usePageHeaderOverride } from "@/presentation/contexts/PageHeaderContext";
import { ROUTES } from "@/main/routes";
import { CRUMB_KEYS, HEADER_ORDER, NAV_ITEMS, isActive } from "../../navigation";
import { Icon } from "../Icon";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { MobileMenu } from "../MobileMenu";
import { Monogram } from "../Monogram";
import { ThemeToggle } from "../ThemeToggle";
import styles from "./SiteHeader.module.css";

type CrumbKey = (typeof CRUMB_KEYS)[number];

/**
 * Celular: monograma · idioma · tema · Menu (início) ou voltar · "JVP / PÁGINA" (páginas internas).
 * Tablet: monograma · navegação em pílula · idioma · tema.
 * Desktop: monograma + nome · links de texto · PT/ES/EN · tema (fixo no topo).
 */
export function SiteHeader() {
  const t = useTranslations("Common");
  const pathname = usePathname();
  const items = HEADER_ORDER.map((key) => NAV_ITEMS.find((item) => item.key === key)!);
  const override = usePageHeaderOverride();
  const current = override?.section
    ? items.find((item) => item.key === override.section)
    : items.find((item) => isActive(item, pathname));
  const crumbKey = current && (CRUMB_KEYS as readonly string[]).includes(current.key) ? (current.key as CrumbKey) : null;
  const crumb = override?.crumb ?? (crumbKey ? t(`crumbs.${crumbKey}`) : null);
  // Em subpáginas (ex.: /estudos/x) o voltar sobe um nível; nas páginas de 1º nível volta ao início.
  const backHref = override?.backHref ?? (current && current.href !== pathname && typeof current.href === "string" ? current.href : ROUTES.home);

  return (
    <header className={`${styles.header} ${crumb ? styles.inner : ""}`}>
      <div className={`wrap rise ${styles.bar}`}>
        {crumb && (
          <>
            <Link href={backHref} aria-label={override?.backLabel ?? t("back")} className={`${styles.back} ${styles.mobileOnly}`}>
              <Icon name="chevronLeft" />
            </Link>
            <span className={`mono ${styles.crumb} ${styles.mobileOnly}`}>{crumb}</span>
            {override?.action ? (
              <span className={`${styles.spacer} ${styles.mobileOnly}`}>{override.action}</span>
            ) : (
              <span className={`${styles.spacer} ${styles.mobileOnly}`} aria-hidden="true" />
            )}
          </>
        )}

        <div className={styles.home}>
          <Monogram label={t("homeLink")} name="João Vitor Pereira" />
        </div>

        <nav aria-label={t("mainMenu")} className={styles.nav}>
          {items.map((item) => {
            const active = item === current;
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
