import { useCallback, useMemo, useState } from "react";
import { panelId, tabId } from "@/presentation/components/SegmentedTabs";
import {
  bookCollectionPlan,
  gameCollectionPlan,
  isBound,
  readingMinutes,
  STUDY_CHECK_KEY,
  studyTarget,
  type EditorBlock,
  type ImageRef,
} from "@editor/domain/entities";
import { BLOCK_META, KIND_TABS, SLOT_META } from "@editor/presentation/utils/block-meta";
import { pad2 } from "@editor/presentation/utils/text-lines";
import type { EditorScreenProps } from "./editor-screen-props";
import { BlockInspector } from "./sections/BlockInspector";
import { BlockLibrary } from "./sections/BlockLibrary";
import { DataPanel } from "./sections/DataPanel";
import { DocumentCanvas } from "./sections/DocumentCanvas";
import { EditorHeader, KIND_TABS_PREFIX } from "./sections/EditorHeader";
import { ExportDialog, type OutlineItem } from "./sections/ExportDialog";
import { InspectorPanel } from "./sections/InspectorPanel";
import { OpenContentDialog } from "./sections/OpenContentDialog";
import { PublicationPanel } from "./sections/PublicationPanel";
import { StudyBar } from "./sections/StudyBar";
import { useEditor } from "./state/use-editor";
import styles from "./EditorScreen.module.css";

function previewText(block: EditorBlock): string {
  if (isBound(block)) return SLOT_META[block.slot].label;
  switch (block.type) {
    case "list":
    case "checklist":
    case "keyPoints":
      return block.items[0] ?? "—";
    case "steps":
      return block.items[0]?.title ?? "—";
    case "glossary":
      return block.items[0]?.term ?? "—";
    case "figure":
      return block.caption || block.image?.fileName || "—";
    case "table":
      return block.caption || "—";
    case "code":
      return block.filename || "—";
    case "video":
      return block.url || "—";
    case "divider":
      return "—";
    case "raw":
      return block.markdown.split("\n")[0] || "—";
    default:
      return block.text;
  }
}

/** Editor de conteúdo do blog (só desktop): biblioteca · documento · propriedades. */
export function EditorScreen(props: EditorScreenProps) {
  const { pickImage, exportDraft, preview, listContentFiles, openContentFile, pickContentFile } = props;
  const { state, dispatch, catalog, report, blocks, lesson, selected, openData } = useEditor(props);
  const [imageError, setImageError] = useState<string | null>(null);
  const { workspace } = state;
  const { kind } = workspace;
  const isLesson = kind === "lesson";
  const lessonIndex = workspace.study.lessons.findIndex((l) => l.id === lesson.id);
  const selectedIndex = selected ? blocks.indexOf(selected) : -1;

  const onPickImage = useCallback(
    async (apply: (image: ImageRef) => void) => {
      setImageError(null);
      try {
        const image = await pickImage.pick();
        if (image) apply(image);
      } catch (error) {
        setImageError(error instanceof Error ? error.message : "Não foi possível abrir a imagem.");
      }
    },
    [pickImage],
  );

  const title = isLesson ? lesson.title : workspace[kind].meta.title;
  const collection = kind === "book" ? bookCollectionPlan(workspace.book.meta, catalog) : kind === "game" ? gameCollectionPlan(workspace.game.meta, catalog) : null;
  const study = studyTarget(workspace.study.study, catalog);
  const dataChecks = isLesson ? report.required.filter((c) => c.key === STUDY_CHECK_KEY || c.key.includes(`.${lesson.id}.`)) : report.required;

  const outline: OutlineItem[] = useMemo(() => {
    const docs = isLesson ? workspace.study.lessons.map((l, li) => ({ prefix: `${li + 1}.`, blocks: l.blocks })) : [{ prefix: "", blocks }];
    return docs.flatMap(({ prefix, blocks: list }) =>
      list.map((block, i) => ({
        index: prefix ? `${prefix}${i + 1}` : pad2(i + 1),
        preview: previewText(block),
        label: isBound(block) ? SLOT_META[block.slot].label : BLOCK_META[block.type].label,
      })),
    );
  }, [isLesson, workspace.study.lessons, blocks]);

  const targets = useMemo(() => (state.exportOpen ? exportDraft.targets(workspace, catalog) : []), [state.exportOpen, exportDraft, workspace, catalog]);
  // Arquivo em edição: o do post, ou a pasta do estudo quando alguma aula veio de um arquivo.
  const lessonSource = workspace.study.lessons.find((l) => l.source)?.source ?? null;
  const sourcePath = isLesson ? (lesson.source?.path ?? (lessonSource ? lessonSource.path.replace(/[^/]+$/, "") : null)) : workspace[kind].source?.path ?? null;
  const editing = isLesson ? workspace.study.lessons.some((l) => l.source) : !!workspace[kind].source;
  const minutes = readingMinutes(isLesson ? workspace.study.lessons.flatMap((l) => l.blocks) : blocks);

  return (
    <div className={`${styles.screen} ${state.preview ? styles.previewing : ""}`}>
      <EditorHeader
        title={title.trim() || "Sem título"}
        sourcePath={sourcePath}
        dirty={state.dirty[kind]}
        onOpenFile={() => dispatch({ type: "setOpenDialog", open: true })}
        kind={kind}
        done={report.done}
        total={report.total}
        preview={state.preview}
        onKindChange={(next) => dispatch({ type: "setKind", kind: next })}
        onOpenData={openData}
        onTogglePreview={() => dispatch({ type: "togglePreview" })}
        onExport={() => dispatch({ type: "setExportOpen", open: true })}
      />

      <div className={styles.layout}>
        {!state.preview && (
          <div className={styles.left}>
            <BlockLibrary
              kind={kind}
              insertHint={selectedIndex >= 0 ? `Inserir após ${pad2(selectedIndex + 1)}` : "Inserir no fim"}
              onAdd={(blockType) => dispatch({ type: "addBlock", blockType })}
            />
          </div>
        )}

        <main className={styles.main}>
          {isLesson && !state.preview && (
            <StudyBar
              studyTitle={study?.title ?? null}
              lessons={workspace.study.lessons}
              currentId={lesson.id}
              report={report}
              onSelect={(id) => dispatch({ type: "selectLesson", id })}
              onAdd={() => dispatch({ type: "addLesson" })}
            />
          )}
          <DocumentCanvas
            id={panelId(KIND_TABS_PREFIX, kind)}
            labelledBy={tabId(KIND_TABS_PREFIX, kind)}
            blocks={blocks}
            selectedId={state.selectedId}
            plain={state.preview}
            collection={collection}
            context={{ workspace, lesson, lessonIndex, preview }}
            dispatch={dispatch}
          />
        </main>

        {!state.preview && (
          <div className={styles.right}>
            <InspectorPanel
              panel={state.panel}
              dataCount={`${dataChecks.filter((c) => c.ok).length}/${dataChecks.length}`}
              onChange={(panel) => dispatch({ type: "setPanel", panel })}
            >
              {state.panel === "data" && (
                <DataPanel
                  workspace={workspace}
                  lesson={lesson}
                  lessonIndex={lessonIndex}
                  catalog={catalog}
                  report={report}
                  imageError={imageError}
                  onPickImage={onPickImage}
                  dispatch={dispatch}
                />
              )}
              {state.panel === "block" && (
                <BlockInspector
                  block={selected}
                  index={selectedIndex}
                  imageError={imageError}
                  onPickImage={onPickImage}
                  onOpenData={openData}
                  onChange={(patch) => selected && dispatch({ type: "updateBlock", id: selected.id, patch })}
                />
              )}
              {state.panel === "post" && <PublicationPanel publication={workspace.publication} readingMinutes={minutes} dispatch={dispatch} />}
            </InspectorPanel>
          </div>
        )}
      </div>

      <ExportDialog
        open={state.exportOpen}
        kindLabel={KIND_TABS.find((k) => k.id === kind)?.label ?? ""}
        title={title.trim() || "Sem título"}
        report={report}
        outline={outline}
        targets={targets}
        editing={editing}
        onExport={async () => {
          const result = await exportDraft.export(workspace, catalog);
          dispatch({ type: "markSaved", saved: result.saved });
          return result;
        }}
        onFixRequired={() => {
          dispatch({ type: "setExportOpen", open: false });
          openData();
        }}
        onClose={() => dispatch({ type: "setExportOpen", open: false })}
      />

      <OpenContentDialog
        open={state.openDialog}
        dirty={state.dirty}
        listFiles={listContentFiles}
        openFile={openContentFile}
        pickFile={pickContentFile}
        onOpen={(content) => dispatch({ type: "loadContent", content })}
        onNewDraft={() => dispatch({ type: "newDraft" })}
        onClose={() => dispatch({ type: "setOpenDialog", open: false })}
      />
    </div>
  );
}
