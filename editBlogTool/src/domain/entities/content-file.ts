import type { EditorWorkspace, PostKind, Publication, StudyDraft } from "./draft";

/** Arquivo .md encontrado em content/post. */
export type ContentFileSummary = {
  path: string;
  kind: "thought" | "book" | "game" | "lesson";
  title: string;
  modifiedAt: string;
};

/** O que será carregado no editor, para conferir antes de abrir. */
export type ContentReading = {
  title: string;
  blocks: number;
  images: number;
  /** blocos que o editor não reconhece (mantidos como markdown) */
  unknown: number;
  collection: string | null;
  study: { title: string; lessons: number } | null;
};

/** Conteúdo lido de um arquivo, pronto para entrar no rascunho. */
export type OpenedContent =
  | { kind: PostKind; path: string; draft: EditorWorkspace[PostKind]; publication: Partial<Publication>; reading: ContentReading }
  | { kind: "lesson"; path: string; study: StudyDraft; focusLessonId: string; publication: Partial<Publication>; reading: ContentReading };
