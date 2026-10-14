/** Rascunho salvo no cache local (versão para migrar o formato no futuro). */
export type WorkspaceCacheModel = {
  version: 1;
  saved_at: string;
  workspace: unknown;
};
