import type { EditorWorkspace } from "@editor/domain/entities";
import type { WorkspaceCacheMapper } from "@editor/domain/mappers";
import type { WorkspaceCacheModel } from "@editor/domain/models";
import type { LoadWorkspace, SaveWorkspace } from "@editor/domain/use-cases";
import type { KeyValueCache } from "@editor/shared/cache";

const KEY = "workspace";

/** Rascunho guardado no cache local do app. */
export class CachedWorkspaceStorage implements LoadWorkspace, SaveWorkspace {
  constructor(
    private readonly cache: KeyValueCache,
    private readonly mapper: WorkspaceCacheMapper,
  ) {}

  load(): EditorWorkspace | null {
    return this.mapper.toEntity(this.cache.get<WorkspaceCacheModel>(KEY));
  }

  save(workspace: EditorWorkspace): void {
    this.cache.set(KEY, this.mapper.toModel(workspace));
  }
}
