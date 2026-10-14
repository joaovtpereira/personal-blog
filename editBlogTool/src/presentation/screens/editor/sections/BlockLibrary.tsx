import type { DraftKind, FreeBlockType } from "@editor/domain/entities";
import { FieldHint, LibraryItem, PanelSection } from "@editor/presentation/components";
import { BLOCK_META, isAvailable, LIBRARY_GROUPS } from "@editor/presentation/utils/block-meta";
import styles from "./BlockLibrary.module.css";

type BlockLibraryProps = {
  kind: DraftKind;
  /** "Inserir após 03" ou "Inserir no fim" */
  insertHint: string;
  onAdd: (type: FreeBlockType) => void;
};

export function BlockLibrary({ kind, insertHint, onAdd }: BlockLibraryProps) {
  return (
    <PanelSection title="Blocos" aside={insertHint} label="Biblioteca de blocos" className={styles.library}>
      {LIBRARY_GROUPS.map((group) => (
        <div key={group.group} className={styles.group} role="group" aria-label={group.group}>
          <span className={`mono ${styles.groupLabel}`}>{group.group}</span>
          {group.items.map((type) => {
            const available = isAvailable(type, kind);
            return (
              <LibraryItem
                key={type}
                glyph={BLOCK_META[type].glyph}
                label={BLOCK_META[type].label}
                title={available ? BLOCK_META[type].help : "Disponível só em aulas"}
                disabled={!available}
                onClick={() => onAdd(type)}
              />
            );
          })}
        </div>
      ))}
      <FieldHint>Título, autor, capa, ficha, captura, vídeo da aula e veredito vêm da aba Dados e não entram pela biblioteca.</FieldHint>
    </PanelSection>
  );
}
