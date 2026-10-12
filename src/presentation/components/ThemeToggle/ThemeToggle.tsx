"use client";

import { useTranslations } from "next-intl";
import { Icon } from "../Icon";
import { THEME_STORAGE_KEY } from "./theme-script";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("Common");

  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* armazenamento indisponível: o tema vale só para esta visita */
    }
  };

  return (
    <button type="button" className={`${styles.toggle} ${className ?? ""}`} aria-label={t("toggleTheme")} onClick={toggle}>
      <Icon name="theme" />
    </button>
  );
}
