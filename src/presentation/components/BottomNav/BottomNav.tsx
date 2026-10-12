"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/main/i18n/navigation";
import { usePageHeaderOverride } from "@/presentation/contexts/PageHeaderContext";
import { BOTTOM_NAV_KEYS, NAV_ITEMS, isActive } from "../../navigation";
import { Icon } from "../Icon";
import styles from "./BottomNav.module.css";

/** Barra flutuante do celular: o item atual mostra ícone + rótulo. */
export function BottomNav() {
  const t = useTranslations("Common");
  const pathname = usePathname();
  const section = usePageHeaderOverride()?.section;
  const items = BOTTOM_NAV_KEYS.map((key) => NAV_ITEMS.find((item) => item.key === key)!);

  return (
    <nav aria-label={t("bottomNav")} className={styles.nav}>
      {items.map((item) => {
        const active = section ? item.key === section : isActive(item, pathname);
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-label={active ? undefined : t(item.key)}
            aria-current={active ? "page" : undefined}
            className={`${styles.item} ${active ? styles.active : ""}`}
          >
            <Icon name={item.icon} />
            {active && <span>{t(item.key)}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
