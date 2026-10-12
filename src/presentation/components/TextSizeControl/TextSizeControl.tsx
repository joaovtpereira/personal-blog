"use client";

import { useTranslations } from "next-intl";
import styles from "./TextSizeControl.module.css";

export const TEXT_SIZES = ["small", "medium", "large"] as const;
export type TextSize = (typeof TEXT_SIZES)[number];

type TextSizeControlProps = {
  value: TextSize;
  onChange: (size: TextSize) => void;
};

/** Três "A" de tamanhos crescentes para o texto da leitura. */
export function TextSizeControl({ value, onChange }: TextSizeControlProps) {
  const t = useTranslations("Lesson.textSize");
  return (
    <div role="group" aria-label={t("label")} className={styles.group}>
      {TEXT_SIZES.map((size, i) => (
        <button
          key={size}
          type="button"
          aria-pressed={value === size}
          aria-label={t(size)}
          className={`${styles.option} ${value === size ? styles.on : ""}`}
          style={{ fontSize: 11 + i * 3 }}
          onClick={() => onChange(size)}
        >
          A
        </button>
      ))}
    </div>
  );
}
