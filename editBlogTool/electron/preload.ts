import { contextBridge, ipcRenderer } from "electron";

/* Preload em sandbox: não pode importar módulos locais, por isso os canais são repetidos aqui. */
const CHANNELS = {
  blogRoot: "editor:blog-root",
  fileExists: "editor:file-exists",
  writeContent: "editor:write-content",
  copyImage: "editor:copy-image",
  pickImage: "editor:pick-image",
  listContent: "editor:list-content",
  readContent: "editor:read-content",
  pickMarkdown: "editor:pick-markdown",
} as const;

/** API mínima exposta ao renderer (window.jvpDesktop). Implementa DesktopBridge de src/shared/desktop. */
contextBridge.exposeInMainWorld("jvpDesktop", {
  blogRoot: () => ipcRenderer.invoke(CHANNELS.blogRoot),
  fileExists: (relativePath: string) => ipcRenderer.invoke(CHANNELS.fileExists, relativePath),
  writeContent: (relativePath: string, content: string) => ipcRenderer.invoke(CHANNELS.writeContent, relativePath, content),
  copyImage: (sourcePath: string, relativeDestination: string) =>
    ipcRenderer.invoke(CHANNELS.copyImage, sourcePath, relativeDestination),
  pickImage: () => ipcRenderer.invoke(CHANNELS.pickImage),
  listContent: () => ipcRenderer.invoke(CHANNELS.listContent),
  readContent: (relativePath: string) => ipcRenderer.invoke(CHANNELS.readContent, relativePath),
  pickMarkdown: () => ipcRenderer.invoke(CHANNELS.pickMarkdown),
});
