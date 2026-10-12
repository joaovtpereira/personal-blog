"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@/main/i18n/navigation";
import { EXTERNAL } from "@/main/routes";
import { NAV_ITEMS } from "../../navigation";
import { Icon } from "../Icon";
import { LanguageSwitcher } from "../LanguageSwitcher";
import styles from "./MobileMenu.module.css";

/** Botão "Menu" + folha em tela cheia (só no celular). */
export function MobileMenu({ className }: { className?: string }) {
  const t = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${className ?? ""}`}
        aria-label={t("openMenu")}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        {t("menu")}
        <Icon name="menu" size={16} />
      </button>

      {open &&
        createPortal(
          <div id="mobile-menu" role="dialog" aria-modal="true" aria-label={t("mainMenu")} className={styles.sheet}>
            <div className={styles.head}>
              <span className={`mono ${styles.kicker}`}>{t("navigation").toUpperCase()}</span>
              <button ref={closeRef} type="button" className={styles.close} aria-label={t("closeMenu")} onClick={close}>
                <Icon name="close" size={16} />
              </button>
            </div>

            <nav aria-label={t("mainMenu")} className={styles.links}>
              {NAV_ITEMS.map((item, i) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={close}
                  className={`rise d${Math.min(i + 1, 6)} ${styles.link}`}
                >
                  <span className={`mono ${styles.num}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={item.key === "contact" ? "serif" : undefined}>{t(item.key)}</span>
                </Link>
              ))}
            </nav>

            <LanguageSwitcher variant="sheet" className={`rise d7 ${styles.langs}`} />
            <div className={`rise d7 ${styles.external}`}>
              <a className="ul" href={EXTERNAL.byteKickStudio} target="_blank" rel="noopener noreferrer">
                ByteKickStudio ↗
              </a>
              <a className="ul" href={EXTERNAL.fotSquad} target="_blank" rel="noopener noreferrer">
                FotSquad ↗
              </a>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
