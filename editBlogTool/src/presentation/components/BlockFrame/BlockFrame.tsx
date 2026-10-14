import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "@/presentation/components/Icon";
import { EditorIcon } from "../EditorIcon";
import styles from "./BlockFrame.module.css";

type BlockFrameProps = {
  index: string;
  label: string;
  selected: boolean;
  /** bloco fixo: etiqueta de vínculo, sem duplicar/remover */
  boundLabel?: string | null;
  /** pré-visualização: só o conteúdo, sem moldura */
  plain?: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelect: () => void;
  onMove: (direction: -1 | 1) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  children: ReactNode;
};

/** Moldura de um bloco no documento: nome (seleciona), vínculo e ferramentas de ordem. */
export function BlockFrame({ index, label, selected, boundLabel, plain = false, isFirst, isLast, onSelect, onMove, onDuplicate, onRemove, children }: BlockFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const bound = !!boundLabel;

  // Bloco recém-criado ou selecionado fica visível no documento.
  useEffect(() => {
    if (selected && !plain) ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected, plain]);

  if (plain) return <div className={styles.plain}>{children}</div>;

  return (
    <div ref={ref} className={`${styles.block} ${bound ? styles.bound : ""} ${selected ? styles.selected : ""}`}>
      <div className={styles.bar}>
        <div className={styles.name}>
          <button type="button" className={`mono ${styles.select}`} aria-pressed={selected} aria-label={`Editar bloco ${index}: ${label}`} onClick={onSelect}>
            <EditorIcon name="grip" size={14} />
            {index} · {label}
          </button>
          {bound && (
            <span className={`mono ${styles.tag}`}>
              <Icon name="link" size={11} strokeWidth={2} />
              Dados · {boundLabel}
            </span>
          )}
        </div>
        <div className={styles.tools}>
          <button type="button" aria-label="Mover bloco para cima" disabled={isFirst} onClick={() => onMove(-1)}>
            <EditorIcon name="arrowUp" />
          </button>
          <button type="button" aria-label="Mover bloco para baixo" disabled={isLast} onClick={() => onMove(1)}>
            <EditorIcon name="arrowDown" />
          </button>
          {!bound && (
            <>
              <button type="button" aria-label="Duplicar bloco" onClick={onDuplicate}>
                <EditorIcon name="duplicate" />
              </button>
              <button type="button" className={styles.danger} aria-label="Remover bloco" onClick={onRemove}>
                <EditorIcon name="trash" />
              </button>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
