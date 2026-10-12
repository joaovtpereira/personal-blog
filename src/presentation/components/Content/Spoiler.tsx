"use client";

import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import styles from "./Content.module.css";

/** Trecho desfocado até o leitor tocar. */
export function Spoiler({ children }: { children: ReactNode }) {
  const t = useTranslations("Content");
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.spoiler} ${open ? styles.spoilerOpen : ""}`}>
      <button type="button" className={`mono ${styles.spoilerButton}`} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {open ? t("spoilerHide") : t("spoiler")}
      </button>
      <div className={styles.spoilerText} aria-hidden={!open}>
        {children}
      </div>
    </div>
  );
}
