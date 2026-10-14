/** Contrato IPC entre o processo principal e o preload. Espelhado em src/shared/desktop. */
export const CHANNELS = {
  blogRoot: "editor:blog-root",
  fileExists: "editor:file-exists",
  writeContent: "editor:write-content",
  copyImage: "editor:copy-image",
  pickImage: "editor:pick-image",
  listContent: "editor:list-content",
  readContent: "editor:read-content",
  pickMarkdown: "editor:pick-markdown",
} as const;

export type ContentEntryPayload = { path: string; modifiedAt: string };

export type WriteResultPayload = { path: string; overwritten: boolean };
export type PickedImagePayload = { path: string; name: string };

/** Protocolo para o renderer exibir imagens locais escolhidas no picker. */
export const IMAGE_PROTOCOL = "jvp-image";
