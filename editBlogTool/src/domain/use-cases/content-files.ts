import type { ContentFileSummary, OpenedContent } from "../entities";

/** Posts e aulas já gravados em content/post, do mais recente para o mais antigo. */
export interface ListContentFiles {
  list(): Promise<ContentFileSummary[]>;
}

/** Lê um .md (e, para aulas, as outras aulas do mesmo estudo) e devolve o rascunho para editar. */
export interface OpenContentFile {
  open(path: string): Promise<OpenedContent>;
}

/** Seletor de arquivo do sistema, restrito a content/. null = cancelado. */
export interface PickContentFile {
  pick(): Promise<string | null>;
}
