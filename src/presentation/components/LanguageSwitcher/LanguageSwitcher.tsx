"use client";

import { useTranslations } from "next-intl";
import { useLocaleSwitch } from "./useLocaleSwitch";
import styles from "./LanguageSwitcher.module.css";

type LanguageSwitcherProps = {
  /** cycle: botão redondo que alterna · segmented: grupo PT/ES/EN · sheet: grupo sobre o menu invertido */
  variant: "cycle" | "segmented" | "sheet";
  className?: string;
};

export function LanguageSwitcher({ variant, className }: LanguageSwitcherProps) {
  const t = useTranslations("Common");
  const { locale, locales, change, cycle, isPending } = useLocaleSwitch();

  if (variant === "cycle") {
    return (
      <button
        type="button"
        className={`mono ${styles.cycle} ${className ?? ""}`}
        aria-label={t("changeLanguage", { current: locale.toUpperCase() })}
        aria-busy={isPending}
        onClick={cycle}
      >
        {locale.toUpperCase()}
      </button>
    );
  }

  return (
    <div role="radiogroup" aria-label={t("language")} className={`${styles[variant]} ${className ?? ""}`}>
      {locales.map((id) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={locale === id}
          className={`mono ${styles.option} ${locale === id ? styles.on : ""}`}
          onClick={() => change(id)}
        >
          {id.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
