"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "../Icon";
import styles from "./ShareButton.module.css";

type ShareButtonProps = {
  title: string;
  /** Texto do botão (pílula) ou só o rótulo acessível (redondo). */
  label: string;
  ariaLabel: string;
  copiedLabel: string;
  variant?: "round" | "pill";
  /** share: menu nativo (ou copia) · copy: sempre copia o link. */
  mode?: "share" | "copy";
  icon?: "share" | "link";
  className?: string;
};

/** Compartilha a página atual pelo menu nativo; sem ele, copia o link. */
export function ShareButton({
  title,
  label,
  ariaLabel,
  copiedLabel,
  variant = "pill",
  mode = "share",
  icon = "share",
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const share = async () => {
    const url = window.location.href;
    if (mode === "share" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if ((error as DOMException)?.name === "AbortError") return;
      }
    }
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      className={`${styles.button} ${styles[variant]} ${copied ? styles.on : ""} ${className ?? ""}`}
      aria-label={variant === "round" ? ariaLabel : undefined}
      onClick={share}
    >
      <Icon name={icon} size={16} />
      {variant === "pill" && <span>{copied ? copiedLabel : label}</span>}
      <span className="sr-only" aria-live="polite">
        {copied ? copiedLabel : ""}
      </span>
    </button>
  );
}
