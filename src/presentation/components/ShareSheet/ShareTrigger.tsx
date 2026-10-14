"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import type { ShareTarget } from "@/domain/entities";
import { Icon } from "../Icon";
import { ShareSheet } from "./ShareSheet";
import styles from "./ShareTrigger.module.css";

type ShareTriggerProps = {
  target: ShareTarget;
  /** round: só o ícone (cabeçalho) · pill: ícone e texto. */
  variant?: "round" | "pill";
  className?: string;
};

/** Botão "Compartilhar" que abre o painel com a imagem para story e o link. */
export function ShareTrigger({ target, variant = "pill", className }: ShareTriggerProps) {
  const t = useTranslations("Share");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`${styles.button} ${styles[variant]} ${className ?? ""}`}
        aria-label={variant === "round" ? t("open") : undefined}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Icon name="share" size={16} />
        {variant === "pill" && <span>{t("open")}</span>}
      </button>
      <ShareSheet target={target} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
