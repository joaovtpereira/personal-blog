import { useEffect, useRef, type ReactNode } from "react";
import styles from "./Modal.module.css";

type ModalProps = {
  open: boolean;
  /** l: diálogos com duas colunas (ex.: abrir arquivo) */
  size?: "m" | "l";
  labelledBy: string;
  onClose: () => void;
  children: ReactNode;
};

/** Diálogo modal nativo (<dialog>): prende o foco, fecha no Esc e devolve o foco ao sair. */
export function Modal({ open, size = "m", labelledBy, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`${styles.modal} ${styles[size]}`}
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {open && <div className={styles.body}>{children}</div>}
    </dialog>
  );
}
