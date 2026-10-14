import { useState } from "react";
import { Button } from "@/presentation/components/Button";
import { Icon } from "@/presentation/components/Icon";
import { SuccessCard } from "@/presentation/components/SuccessCard";
import type { DraftReport } from "@editor/domain/entities";
import type { ExportResult } from "@editor/domain/use-cases";
import { CheckRow, EditorIcon, Modal } from "@editor/presentation/components";
import styles from "./ExportDialog.module.css";

export type OutlineItem = { index: string; preview: string; label: string };

type ExportDialogProps = {
  open: boolean;
  kindLabel: string;
  title: string;
  report: DraftReport;
  outline: OutlineItem[];
  targets: string[];
  /** rascunho aberto de um arquivo: salvar substitui o arquivo */
  editing: boolean;
  onExport: () => Promise<ExportResult>;
  onFixRequired: () => void;
  onClose: () => void;
};

type Status = { state: "idle" } | { state: "saving" } | { state: "done"; result: ExportResult } | { state: "error"; message: string };

/** Checagem final + gravação do markdown no repositório do blog. */
export function ExportDialog({ open, kindLabel, title, report, outline, targets, editing, onExport, onFixRequired, onClose }: ExportDialogProps) {
  const verb = editing ? "Salvar alterações" : "Exportar Markdown";
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const blocked = !report.ready;
  const missing = report.total - report.done;

  const close = () => {
    setStatus({ state: "idle" });
    onClose();
  };

  const run = async () => {
    setStatus({ state: "saving" });
    try {
      setStatus({ state: "done", result: await onExport() });
    } catch (error) {
      setStatus({ state: "error", message: error instanceof Error ? error.message : "Não foi possível exportar." });
    }
  };

  return (
    <Modal open={open} labelledBy="export-title" onClose={close}>
      {status.state === "done" ? (
        <SuccessCard
          title={<span id="export-title">{editing ? "Alterações salvas" : "Arquivos gravados no blog"}</span>}
          text={status.result.files
            .map((f) => `${f.path}${f.overwritten ? " (substituído)" : ""}`)
            .join(" · ")}
          action={
            <Button variant="outlineCurrent" onClick={close}>
              Voltar ao editor
            </Button>
          }
        />
      ) : (
        <>
          <div className={styles.head}>
            <div>
              <span className={`mono ${styles.label}`}>
                {editing ? "Salvar alterações" : "Exportar"} · {kindLabel}
              </span>
              <h2 id="export-title" className={styles.title}>
                {title}
              </h2>
            </div>
            <button type="button" className={styles.close} aria-label="Fechar" onClick={close}>
              <Icon name="close" />
            </button>
          </div>

          <section>
            <div className={styles.sectionHead}>
              <span className={`mono ${styles.label}`}>Obrigatórios</span>
              <span className="mono">
                {report.done}/{report.total}
              </span>
            </div>
            <ul className={styles.list}>
              {report.required.map((check) => (
                <CheckRow key={check.key} ok={check.ok} text={check.label} value={check.value} />
              ))}
            </ul>
          </section>

          <section>
            <span className={`mono ${styles.label}`}>Recomendações</span>
            <ul className={styles.list}>
              {report.recommendations.map((check) => (
                <CheckRow key={check.key} ok={check.ok} text={check.label} tone="warn" />
              ))}
            </ul>
          </section>

          <section>
            <span className={`mono ${styles.label}`}>Estrutura · {outline.length} blocos</span>
            <ol className={styles.outline}>
              {outline.map((item) => (
                <li key={item.index}>
                  <span className="mono">{item.index}</span>
                  <span className={styles.preview}>{item.preview}</span>
                  <span className="mono">{item.label}</span>
                </li>
              ))}
            </ol>
          </section>

          {editing && (
            <p className={styles.notice}>Substitui o arquivo existente. O nome do arquivo não muda, mesmo que o título mude.</p>
          )}
          {blocked && (
            <p className={styles.notice} role="status">
              Faltam {missing} campo(s) obrigatório(s). A exportação é liberada quando todos estiverem preenchidos.
            </p>
          )}
          {status.state === "error" && (
            <p className={styles.notice} role="alert">
              {status.message}
            </p>
          )}

          <div className={styles.footer}>
            <ul className={`mono ${styles.files}`} aria-label="Arquivos que serão gravados">
              {targets.map((target) => (
                <li key={target}>{target}</li>
              ))}
            </ul>
            <div className={styles.actions}>
              {blocked && (
                <Button variant="ghost" className={styles.button} onClick={onFixRequired}>
                  Preencher obrigatórios
                </Button>
              )}
              <Button className={styles.button} disabled={blocked || status.state === "saving"} onClick={run}>
                <EditorIcon name="download" />
                {status.state === "saving" ? "Gravando…" : verb}
              </Button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
