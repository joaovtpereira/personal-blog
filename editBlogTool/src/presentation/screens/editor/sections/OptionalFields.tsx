import type { EditorWorkspace, LessonDraft, PostKind } from "@editor/domain/entities";
import { CheckboxField, FieldHint, FieldShell, LinesField, PanelSection, TextArea, TextInput } from "@editor/presentation/components";
import { LINE_FORMATS } from "@editor/presentation/utils/text-lines";
import type { EditorAction } from "../state/editor-state";
import styles from "./Panels.module.css";

type OptionalFieldsProps = {
  workspace: EditorWorkspace;
  lesson: LessonDraft;
  dispatch: (action: EditorAction) => void;
};

/** Aba Dados › Opcionais: o que o blog mostra quando preenchido e esconde quando vazio. */
export function OptionalFields({ workspace, lesson, dispatch }: OptionalFieldsProps) {
  const { kind } = workspace;
  return (
    <PanelSection title="Opcionais">
      <FieldHint>Não bloqueiam a publicação: o que ficar vazio não aparece no blog.</FieldHint>
      {kind === "lesson" ? <LessonOptionals lesson={lesson} dispatch={dispatch} /> : <PostOptionals kind={kind} workspace={workspace} dispatch={dispatch} />}
    </PanelSection>
  );
}

function PostOptionals({ kind, workspace, dispatch }: { kind: PostKind; workspace: EditorWorkspace; dispatch: OptionalFieldsProps["dispatch"] }) {
  const patch = (p: Record<string, unknown>) => dispatch({ type: "patchMeta", patch: p });
  const meta = workspace[kind].meta;
  // Reinicia os campos de lista ao abrir outro arquivo ou trocar de tipo.
  const listKey = `${kind}-${workspace[kind].source?.path ?? "novo"}`;

  return (
    <div className={styles.grid}>
      {kind !== "thought" && (
        <>
          <div className={styles.full}>
            <LinesField
              key={`pros-${listKey}`}
              id="opt-pros"
              label="+ Gostei"
              hint="Um ponto por linha."
              rows={3}
              value={workspace[kind].meta.pros}
              {...LINE_FORMATS.items}
              onChange={(pros) => patch({ pros })}
            />
          </div>
          <div className={styles.full}>
            <LinesField
              key={`cons-${listKey}`}
              id="opt-cons"
              label="− Nem tanto"
              hint="Um ponto por linha."
              rows={3}
              value={workspace[kind].meta.cons}
              {...LINE_FORMATS.items}
              onChange={(cons) => patch({ cons })}
            />
          </div>
        </>
      )}
      {kind === "game" && (
        <div className={styles.full}>
          <CheckboxField label="Zerei o jogo (selo ✓ ZERADO)" checked={workspace.game.meta.completed} onChange={(e) => patch({ completed: e.target.checked })} />
        </div>
      )}
      <div className={styles.full}>
        <CheckboxField label="Destaque no topo do blog" checked={meta.featured} onChange={(e) => patch({ featured: e.target.checked })} />
        <FieldHint>Sem nenhum post marcado, o destaque é o mais recente.</FieldHint>
      </div>
    </div>
  );
}

function LessonOptionals({ lesson, dispatch }: { lesson: LessonDraft; dispatch: OptionalFieldsProps["dispatch"] }) {
  const patchSummary = (p: Partial<LessonDraft["summary"]>) => dispatch({ type: "patchLesson", patch: { summary: { ...lesson.summary, ...p } } });

  return (
    <div className={styles.grid}>
      {lesson.format === "text" && (
        <>
          <div className={styles.full}>
            <FieldShell htmlFor="opt-key-idea" label="Resumo: ideia central" hint="Aparece no cartão da aula em texto dentro de estudos com vídeo.">
              <TextInput id="opt-key-idea" value={lesson.summary.keyIdea} placeholder="[A ideia central da aula em uma frase.]" onChange={(e) => patchSummary({ keyIdea: e.target.value })} />
            </FieldShell>
          </div>
          <div className={styles.full}>
            <FieldShell htmlFor="opt-summary" label="Resumo: texto">
              <TextArea id="opt-summary" rows={2} value={lesson.summary.text} placeholder="[Resumo da aula.]" onChange={(e) => patchSummary({ text: e.target.value })} />
            </FieldShell>
          </div>
        </>
      )}
      <div className={styles.full}>
        <LinesField
          key={`materials-${lesson.id}`}
          id="opt-materials"
          label="Material de apoio"
          hint="Um por linha: Nome | https://… (PDF, link ou arquivo é identificado pelo endereço)."
          rows={3}
          mono
          value={lesson.materials}
          {...LINE_FORMATS.materials}
          onChange={(materials) => dispatch({ type: "patchLesson", patch: { materials } })}
        />
      </div>
    </div>
  );
}
