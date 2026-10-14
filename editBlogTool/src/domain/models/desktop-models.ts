/** Respostas do processo principal do Electron. */
export type PickedImageModel = { path: string; name: string };

/** Arquivo .md em content/ (caminho relativo à raiz do blog). */
export type ContentEntryModel = { path: string; modifiedAt: string };

export type WriteResultModel = { path: string; overwritten: boolean };
