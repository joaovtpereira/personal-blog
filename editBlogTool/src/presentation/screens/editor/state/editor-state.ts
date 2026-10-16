import {
  createBlock,
  createLesson,
  createWorkspace,
  duplicateBlock,
  insertBlock,
  moveBlock,
  removeBlock,
  setLessonFormat,
  updateBlock,
  type ContentLocale,
  type DraftKind,
  type EditorBlock,
  type EditorWorkspace,
  type FreeBlockData,
  type FreeBlockType,
  type IdFactory,
  type StudyMetaDraft,
  type LessonDraft,
  type LessonFormat,
  type OpenedContent,
  type StudyChoice,
} from "@editor/domain/entities";
import type { SavedSource } from "@editor/domain/use-cases";

export type InspectorPanel = "data" | "block" | "post";

export type EditorState = {
  workspace: EditorWorkspace;
  lessonId: string;
  selectedId: string | null;
  panel: InspectorPanel;
  preview: boolean;
  exportOpen: boolean;
  openDialog: boolean;
  /** alterações ainda não salvas no arquivo, por tipo */
  dirty: Record<DraftKind, boolean>;
};

export type EditorAction =
  | { type: "setKind"; kind: DraftKind }
  | { type: "patchMeta"; patch: Record<string, unknown> }
  | { type: "patchLesson"; patch: Partial<Pick<LessonDraft, "title" | "videoUrl" | "duration" | "summary" | "materials">> }
  | { type: "setLessonFormat"; format: LessonFormat }
  | { type: "selectLesson"; id: string }
  | { type: "addLesson" }
  | { type: "removeLesson"; id: string }
  | { type: "patchStudy"; patch: Partial<StudyChoice> }
  | { type: "patchStudyMeta"; patch: Partial<StudyMetaDraft> }
  | { type: "addBlock"; blockType: FreeBlockType }
  | { type: "updateBlock"; id: string; patch: Partial<FreeBlockData> }
  | { type: "moveBlock"; id: string; direction: -1 | 1 }
  | { type: "duplicateBlock"; id: string }
  | { type: "removeBlock"; id: string }
  | { type: "selectBlock"; id: string }
  | { type: "setPanel"; panel: InspectorPanel }
  | { type: "togglePreview" }
  | { type: "setExportOpen"; open: boolean }
  | { type: "toggleTag"; tag: string }
  | { type: "addTag"; tag: string }
  | { type: "mergeTagPool"; tags: string[] }
  | { type: "setLocale"; locale: ContentLocale }
  | { type: "setOpenDialog"; open: boolean }
  | { type: "loadContent"; content: OpenedContent }
  | { type: "markSaved"; saved: SavedSource[] }
  | { type: "newDraft" };

/** Ações que mudam o conteúdo do rascunho aberto (marcam alterações não salvas). */
const EDITS = new Set<EditorAction["type"]>([
  "patchMeta",
  "patchLesson",
  "setLessonFormat",
  "addLesson",
  "removeLesson",
  "patchStudy",
  "patchStudyMeta",
  "addBlock",
  "updateBlock",
  "moveBlock",
  "duplicateBlock",
  "removeBlock",
  "toggleTag",
  "addTag",
  "setLocale",
]);

const CLEAN: Record<DraftKind, boolean> = { thought: false, book: false, game: false, lesson: false };

export const initEditorState = (workspace: EditorWorkspace): EditorState => ({
  workspace,
  lessonId: workspace.study.lessons[0].id,
  selectedId: null,
  panel: "data",
  preview: false,
  exportOpen: false,
  openDialog: false,
  dirty: CLEAN,
});

export const currentLesson = (state: EditorState) =>
  state.workspace.study.lessons.find((l) => l.id === state.lessonId) ?? state.workspace.study.lessons[0];

export const currentBlocks = (state: EditorState): EditorBlock[] =>
  state.workspace.kind === "lesson" ? currentLesson(state).blocks : state.workspace[state.workspace.kind].blocks;

const normalizeTag = (tag: string) => tag.trim().replace(/^#/, "").toLowerCase();

/** Redutor do editor. `newId` gera ids de blocos e aulas. */
export function createEditorReducer(newId: IdFactory) {
  const mapLesson = (state: EditorState, fn: (lesson: LessonDraft) => LessonDraft): EditorState => ({
    ...state,
    workspace: {
      ...state.workspace,
      study: {
        ...state.workspace.study,
        lessons: state.workspace.study.lessons.map((l) => (l.id === currentLesson(state).id ? fn(l) : l)),
      },
    },
  });

  const mapBlocks = (state: EditorState, fn: (blocks: EditorBlock[]) => EditorBlock[]): EditorState => {
    const { kind } = state.workspace;
    if (kind === "lesson") return mapLesson(state, (lesson) => ({ ...lesson, blocks: fn(lesson.blocks) }));
    return { ...state, workspace: { ...state.workspace, [kind]: { ...state.workspace[kind], blocks: fn(state.workspace[kind].blocks) } } };
  };

  const withPublication = (state: EditorState, patch: Partial<EditorWorkspace["publication"]>): EditorState => ({
    ...state,
    workspace: { ...state.workspace, publication: { ...state.workspace.publication, ...patch } },
  });

  const withDirty = (state: EditorState, dirty: boolean): EditorState => ({ ...state, dirty: { ...state.dirty, [state.workspace.kind]: dirty } });

  return function reducer(state: EditorState, action: EditorAction): EditorState {
    const next = apply(state, action);
    return next !== state && EDITS.has(action.type) ? withDirty(next, true) : next;
  };

  function apply(state: EditorState, action: EditorAction): EditorState {
    switch (action.type) {
      case "setKind":
        return { ...state, workspace: { ...state.workspace, kind: action.kind }, selectedId: null, panel: "data" };
      case "patchMeta": {
        const { kind } = state.workspace;
        if (kind === "lesson") return state;
        const draft = state.workspace[kind];
        return { ...state, workspace: { ...state.workspace, [kind]: { ...draft, meta: { ...draft.meta, ...action.patch } } } };
      }
      case "patchLesson":
        return mapLesson(state, (lesson) => ({ ...lesson, ...action.patch }));
      case "setLessonFormat":
        return mapLesson(state, (lesson) => setLessonFormat(lesson, action.format, newId));
      case "selectLesson":
        return { ...state, lessonId: action.id, selectedId: null };
      case "addLesson": {
        const lesson = createLesson(newId, "text");
        const study = { ...state.workspace.study, lessons: [...state.workspace.study.lessons, lesson] };
        return { ...state, workspace: { ...state.workspace, study }, lessonId: lesson.id, selectedId: null, panel: "data" };
      }
      case "removeLesson": {
        const lessons = state.workspace.study.lessons.filter((l) => l.id !== action.id);
        if (!lessons.length) return state;
        const lessonId = state.lessonId === action.id ? lessons[0].id : state.lessonId;
        return { ...state, workspace: { ...state.workspace, study: { ...state.workspace.study, lessons } }, lessonId, selectedId: null };
      }
      case "patchStudy":
        return {
          ...state,
          workspace: { ...state.workspace, study: { ...state.workspace.study, study: { ...state.workspace.study.study, ...action.patch } } },
        };
      case "patchStudyMeta":
        return {
          ...state,
          workspace: { ...state.workspace, study: { ...state.workspace.study, meta: { ...state.workspace.study.meta, ...action.patch } } },
        };
      case "addBlock": {
        const block = createBlock(newId, action.blockType);
        return { ...mapBlocks(state, (blocks) => insertBlock(blocks, block, state.selectedId)), selectedId: block.id, panel: "block", preview: false };
      }
      case "updateBlock":
        return mapBlocks(state, (blocks) => updateBlock(blocks, action.id, action.patch));
      case "moveBlock":
        return mapBlocks(state, (blocks) => moveBlock(blocks, action.id, action.direction));
      case "duplicateBlock":
        return mapBlocks(state, (blocks) => duplicateBlock(blocks, action.id, newId));
      case "removeBlock":
        return { ...mapBlocks(state, (blocks) => removeBlock(blocks, action.id)), selectedId: state.selectedId === action.id ? null : state.selectedId };
      case "selectBlock":
        return { ...state, selectedId: action.id, panel: "block" };
      case "setPanel":
        return { ...state, panel: action.panel, preview: false };
      case "togglePreview":
        return { ...state, preview: !state.preview };
      case "setExportOpen":
        return { ...state, exportOpen: action.open };
      case "toggleTag": {
        const { tags } = state.workspace.publication;
        return withPublication(state, { tags: tags.includes(action.tag) ? tags.filter((t) => t !== action.tag) : [...tags, action.tag] });
      }
      case "addTag": {
        const tag = normalizeTag(action.tag);
        const { tags, tagPool } = state.workspace.publication;
        if (!tag) return state;
        return withPublication(state, {
          tagPool: tagPool.includes(tag) ? tagPool : [...tagPool, tag],
          tags: tags.includes(tag) ? tags : [...tags, tag],
        });
      }
      case "mergeTagPool": {
        const { tagPool } = state.workspace.publication;
        const merged = [...new Set([...action.tags, ...tagPool])];
        return merged.length === tagPool.length ? state : withPublication(state, { tagPool: merged });
      }
      case "setLocale":
        return withPublication(state, { locale: action.locale });
      case "setOpenDialog":
        return { ...state, openDialog: action.open };
      case "loadContent": {
        const { content } = action;
        const { publication } = state.workspace;
        const tags = content.publication.tags ?? publication.tags;
        const base = {
          ...state.workspace,
          kind: content.kind,
          publication: { ...publication, ...content.publication, tags, tagPool: [...new Set([...publication.tagPool, ...tags])] },
        };
        const workspace = content.kind === "lesson" ? { ...base, study: content.study } : { ...base, [content.kind]: content.draft };
        const lessonId = content.kind === "lesson" ? content.focusLessonId : state.lessonId;
        return { ...state, workspace, lessonId, selectedId: null, panel: "data", preview: false, openDialog: false, dirty: { ...state.dirty, [content.kind]: false } };
      }
      case "markSaved": {
        const { kind } = state.workspace;
        const saved = withDirty(state, false);
        if (kind !== "lesson") {
          const source = action.saved[0]?.source ?? null;
          return { ...saved, workspace: { ...saved.workspace, [kind]: { ...saved.workspace[kind], source } } };
        }
        const byLesson = new Map(action.saved.map((s) => [s.lessonId, s.source]));
        const lessons = saved.workspace.study.lessons.map((l) => ({ ...l, source: byLesson.get(l.id) ?? l.source }));
        return { ...saved, workspace: { ...saved.workspace, study: { ...saved.workspace.study, lessons } } };
      }
      case "newDraft": {
        const fresh = createWorkspace(newId);
        const { kind } = state.workspace;
        const cleared = { ...withDirty(state, false), selectedId: null, panel: "data" as const, openDialog: false };
        if (kind === "lesson") return { ...cleared, workspace: { ...state.workspace, study: fresh.study }, lessonId: fresh.study.lessons[0].id };
        return { ...cleared, workspace: { ...state.workspace, [kind]: fresh[kind] } };
      }
    }
  }
}
