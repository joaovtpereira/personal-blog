"use client";

import { useTranslations } from "next-intl";
import { createContext, useContext, useRef, useState, type ReactNode, type RefObject } from "react";
import { ReadingBar } from "@/presentation/components/ReadingBar";
import { TextSizeControl, type TextSize } from "@/presentation/components/TextSizeControl";
import styles from "./ReadingSession.module.css";

type Session = { size: TextSize; articleRef: RefObject<HTMLElement | null> };

const ReadingContext = createContext<Session | null>(null);

/** Mantém o tamanho escolhido ao trocar de aula durante a visita. */
let lastSize: TextSize = "medium";

/** Modo leitura: faixa fixa com contador, tamanho do texto e progresso de rolagem do artigo. */
export function ReadingSession({ counter, children }: { counter: string; children: ReactNode }) {
  const t = useTranslations("Lesson");
  const [size, setSize] = useState<TextSize>(lastSize);
  const articleRef = useRef<HTMLElement>(null);

  const change = (next: TextSize) => {
    lastSize = next;
    setSize(next);
  };

  return (
    <ReadingContext.Provider value={{ size, articleRef }}>
      <ReadingBar target={articleRef} label={t("readingProgress")}>
        <span className={`mono ${styles.counter}`}>{counter}</span>
        <TextSizeControl value={size} onChange={change} />
      </ReadingBar>
      {children}
    </ReadingContext.Provider>
  );
}

/** O artigo lido: recebe o tamanho de texto e é medido pela barra de progresso. */
export function ReadingArticle({ children, className }: { children: ReactNode; className?: string }) {
  const session = useContext(ReadingContext);
  return (
    <article ref={session?.articleRef} className={`${styles.article} ${className ?? ""}`} data-size={session?.size ?? "medium"}>
      {children}
    </article>
  );
}
