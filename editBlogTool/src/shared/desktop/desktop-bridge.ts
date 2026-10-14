import type { ContentEntryModel, PickedImageModel, WriteResultModel } from "@editor/domain/models";

/** API que o preload do Electron expõe em window.jvpDesktop (ver electron/preload.ts). */
export interface DesktopBridge {
  blogRoot(): Promise<string>;
  fileExists(relativePath: string): Promise<boolean>;
  writeContent(relativePath: string, content: string): Promise<WriteResultModel>;
  copyImage(sourcePath: string, relativeDestination: string): Promise<WriteResultModel>;
  pickImage(): Promise<PickedImageModel | null>;
  listContent(): Promise<ContentEntryModel[]>;
  readContent(relativePath: string): Promise<string>;
  /** seletor do sistema em content/; devolve o caminho relativo */
  pickMarkdown(): Promise<string | null>;
}

declare global {
  interface Window {
    jvpDesktop?: DesktopBridge;
  }
}
