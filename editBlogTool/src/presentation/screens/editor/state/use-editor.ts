import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { createWorkspace, EMPTY_CATALOG, type EditorCatalog } from "@editor/domain/entities";
import type { EditorScreenProps } from "../editor-screen-props";
import { createEditorReducer, currentBlocks, currentLesson, initEditorState } from "./editor-state";

const AUTOSAVE_DELAY = 400;

/** Estado da tela: rascunho (com auto-salvamento), catálogo do blog e relatório de obrigatórios. */
export function useEditor({ loadWorkspace, saveWorkspace, getCatalog, validateDraft, newId }: EditorScreenProps) {
  const reducer = useMemo(() => createEditorReducer(newId), [newId]);
  const [state, dispatch] = useReducer(reducer, null, () => initEditorState(loadWorkspace.load() ?? createWorkspace(newId)));
  const [catalog, setCatalog] = useState<EditorCatalog>(EMPTY_CATALOG);

  useEffect(() => {
    let active = true;
    getCatalog.load().then((loaded) => {
      if (!active) return;
      setCatalog(loaded);
      dispatch({ type: "mergeTagPool", tags: loaded.tags });
    });
    return () => {
      active = false;
    };
  }, [getCatalog]);

  useEffect(() => {
    const timer = setTimeout(() => saveWorkspace.save(state.workspace), AUTOSAVE_DELAY);
    return () => clearTimeout(timer);
  }, [saveWorkspace, state.workspace]);

  const report = useMemo(() => validateDraft.validate(state.workspace, catalog), [validateDraft, state.workspace, catalog]);
  const blocks = currentBlocks(state);
  const lesson = currentLesson(state);
  const selected = blocks.find((b) => b.id === state.selectedId) ?? null;

  const openData = useCallback(() => dispatch({ type: "setPanel", panel: "data" }), []);

  return { state, dispatch, catalog, report, blocks, lesson, selected, openData };
}

export type EditorController = ReturnType<typeof useEditor>;
