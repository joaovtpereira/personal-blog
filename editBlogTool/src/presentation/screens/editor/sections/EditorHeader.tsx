import { Button } from "@/presentation/components/Button";
import { SegmentedTabs } from "@/presentation/components/SegmentedTabs";
import { ThemeToggle } from "@/presentation/components/ThemeToggle";
import type { DraftKind } from "@editor/domain/entities";
import { EditorIcon, RequirementMeter } from "@editor/presentation/components";
import { KIND_TABS } from "@editor/presentation/utils/block-meta";
import styles from "./EditorHeader.module.css";

type EditorHeaderProps = {
  title: string;
  /** arquivo em edição; null = rascunho novo */
  sourcePath: string | null;
  dirty: boolean;
  kind: DraftKind;
  done: number;
  total: number;
  preview: boolean;
  onKindChange: (kind: DraftKind) => void;
  onOpenData: () => void;
  onTogglePreview: () => void;
  onExport: () => void;
  onOpenFile: () => void;
};

export const KIND_TABS_PREFIX = "kind";

export function EditorHeader({ title, sourcePath, dirty, kind, done, total, preview, onKindChange, onOpenData, onTogglePreview, onExport, onOpenFile }: EditorHeaderProps) {
  const fileName = sourcePath?.split("/").filter(Boolean).pop();
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={`mono ${styles.mark}`} aria-hidden="true">
          JVP
        </span>
        <div className={styles.titles}>
          <div className={styles.eyebrowRow}>
            <span className={`mono ${styles.eyebrow}`}>Editor de conteúdo</span>
            <span className={`mono ${styles.source} ${sourcePath ? styles.editing : ""}`} title={sourcePath ?? "Ainda não salvo no blog"}>
              {sourcePath ? `Editando · ${fileName}` : "Novo rascunho"}
              {dirty && <span aria-label=", alterações não salvas"> ●</span>}
            </span>
          </div>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </div>

      <SegmentedTabs
        tabs={KIND_TABS}
        value={kind}
        onChange={onKindChange}
        label="Tipo de conteúdo"
        idPrefix={KIND_TABS_PREFIX}
        className={styles.kinds}
      />

      <div className={styles.actions}>
        <RequirementMeter done={done} total={total} onClick={onOpenData} />
        <Button variant="ghost" className={styles.action} aria-label="Abrir Markdown" onClick={onOpenFile}>
          <EditorIcon name="folder" />
          <span className={styles.compactLabel}>Abrir Markdown</span>
        </Button>
        <Button variant="ghost" className={styles.action} aria-pressed={preview} aria-label={preview ? "Voltar a editar" : "Pré-visualizar"} onClick={onTogglePreview}>
          <EditorIcon name="eye" />
          <span className={styles.compactLabel}>{preview ? "Voltar a editar" : "Pré-visualizar"}</span>
        </Button>
        <Button className={styles.action} onClick={onExport}>
          <EditorIcon name="download" />
          {sourcePath ? "Salvar alterações" : "Exportar Markdown"}
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
