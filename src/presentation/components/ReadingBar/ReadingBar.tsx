"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode, type RefObject } from "react";
import styles from "./ReadingBar.module.css";

type ReadingBarProps = {
  /** Elemento lido; a barra mostra quanto dele já passou pela tela. */
  target: RefObject<HTMLElement | null>;
  label: string;
  children?: ReactNode;
};

/** Faixa fixa no topo com ações de leitura e a linha de progresso de rolagem. */
export function ReadingBar({ target, label, children }: ReadingBarProps) {
  const fill = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = target.current;
      if (!el || !fill.current) return;
      const rect = el.getBoundingClientRect();
      const visible = window.innerHeight - (bar.current?.getBoundingClientRect().bottom ?? 0);
      const total = rect.height - visible;
      const ratio = total <= 0 ? (rect.top < visible ? 1 : 0) : Math.min(1, Math.max(0, -rect.top / total + 0.02));
      fill.current.style.transform = `scaleX(${ratio})`;
      bar.current?.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [target]);

  return (
    <div className={styles.wrapper}>
      {children && <div className={`wrap ${styles.content}`}>{children}</div>}
      <div ref={bar} className={styles.track} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100}>
        <div ref={fill} className={styles.fill} />
      </div>
    </div>
  );
}

const ReadingTargetContext = createContext<RefObject<HTMLElement | null> | null>(null);

/** Barra de progresso fixa + escopo: o `ReadingTarget` dentro dele é o texto medido. */
export function ReadingScope({ label, toolbar, children }: { label: string; toolbar?: ReactNode; children: ReactNode }) {
  const target = useRef<HTMLElement>(null);
  return (
    <ReadingTargetContext.Provider value={target}>
      <ReadingBar target={target} label={label}>
        {toolbar}
      </ReadingBar>
      {children}
    </ReadingTargetContext.Provider>
  );
}

/** O artigo cujo avanço a barra mostra. */
export function ReadingTarget({ children, className }: { children: ReactNode; className?: string }) {
  const target = useContext(ReadingTargetContext);
  return (
    <article ref={target} className={className}>
      {children}
    </article>
  );
}
