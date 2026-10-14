import type { DraftReport, LessonDraft } from "@editor/domain/entities";
import { lessonCheckKey } from "@editor/domain/entities";
import { EditorIcon } from "@editor/presentation/components";
import { pad2 } from "@editor/presentation/utils/text-lines";
import styles from "./StudyBar.module.css";

type StudyBarProps = {
  studyTitle: string | null;
  lessons: LessonDraft[];
  currentId: string;
  report: DraftReport;
  onSelect: (id: string) => void;
  onAdd: () => void;
};

/** Aulas do estudo em abas, com contagem de obrigatórios pendentes por aula. */
export function StudyBar({ studyTitle, lessons, currentId, report, onSelect, onAdd }: StudyBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.head}>
        <div>
          <span className={`mono ${styles.label}`}>Estudo</span>
          <span className={styles.study}>{studyTitle ?? "Escolha o estudo na aba Dados"}</span>
        </div>
        <span className={`mono ${styles.label}`}>{lessons.length} aula(s)</span>
      </div>
      <div role="tablist" aria-label="Aulas do estudo" className={styles.tabs}>
        {lessons.map((lesson, i) => {
          const pending = report.required.filter((c) => c.key.startsWith(lessonCheckKey(lesson.id, "")) && !c.ok).length;
          const selected = lesson.id === currentId;
          return (
            <button
              key={lesson.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-label={`Aula ${i + 1}${pending ? `, ${pending} obrigatório(s) pendente(s)` : ""}`}
              className={`${styles.tab} ${selected ? styles.on : ""}`}
              onClick={() => onSelect(lesson.id)}
            >
              <span className={`mono ${styles.num}`}>{pad2(i + 1)}</span>
              <span className={styles.name}>{lesson.title || "Aula sem título"}</span>
              <span className={`mono ${styles.format}`}>{lesson.format === "video" ? "VÍDEO" : "TEXTO"}</span>
              {pending > 0 && <span className={`mono ${styles.pending}`}>{pending} pend.</span>}
            </button>
          );
        })}
        <button type="button" className={`${styles.tab} ${styles.add}`} onClick={onAdd}>
          <EditorIcon name="plus" size={14} />
          Nova aula
        </button>
      </div>
    </div>
  );
}
