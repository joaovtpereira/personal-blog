"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import styles from "./Content.module.css";

type CodeBlockProps = { code: string; language: string | null; filename: string | null };

/** Código sem cores de sintaxe (DS monocromático), com botão de copiar. */
export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const t = useTranslations("Content");
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = () => {
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
    navigator.clipboard?.writeText(code).catch(() => {});
  };

  return (
    <div className={styles.code}>
      <div className={`mono ${styles.codeBar}`}>
        <span>{filename ?? language ?? ""}</span>
        <button type="button" className={styles.codeCopy} onClick={copy} aria-label={t("copyCode")}>
          <span aria-live="polite">{copied ? t("copied") : t("copy")}</span>
        </button>
      </div>
      <pre className={styles.pre}>
        <code className="mono">{code}</code>
      </pre>
    </div>
  );
}
