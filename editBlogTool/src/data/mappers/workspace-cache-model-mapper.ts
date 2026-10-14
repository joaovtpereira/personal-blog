import type { EditorWorkspace } from "@editor/domain/entities";
import type { WorkspaceCacheMapper } from "@editor/domain/mappers";
import type { WorkspaceCacheModel } from "@editor/domain/models";

const KINDS = ["thought", "book", "game", "lesson"];

function looksLikeWorkspace(value: unknown): value is EditorWorkspace {
  if (!value || typeof value !== "object") return false;
  const ws = value as Partial<EditorWorkspace>;
  return (
    KINDS.includes(ws.kind as string) &&
    Array.isArray(ws.thought?.blocks) &&
    Array.isArray(ws.book?.blocks) &&
    Array.isArray(ws.game?.blocks) &&
    Array.isArray(ws.study?.lessons) &&
    ws.study.lessons.length > 0 &&
    Array.isArray(ws.publication?.tags)
  );
}

export class WorkspaceCacheModelMapper implements WorkspaceCacheMapper {
  toModel(entity: EditorWorkspace): WorkspaceCacheModel {
    return { version: 1, saved_at: new Date().toISOString(), workspace: entity };
  }

  toEntity(model: WorkspaceCacheModel | null): EditorWorkspace | null {
    if (!model || model.version !== 1 || !looksLikeWorkspace(model.workspace)) return null;
    const ws = structuredClone(model.workspace);
    // Rascunhos salvos antes da edição de arquivos não têm origem nem coleção mantida.
    for (const kind of ["thought", "book", "game"] as const) ws[kind].source ??= null;
    ws.book.meta.collection.kept ??= null;
    ws.game.meta.collection.kept ??= null;
    ws.study.study.opened ??= null;
    ws.study.lessons.forEach((lesson) => (lesson.source ??= null));
    return ws;
  }
}
