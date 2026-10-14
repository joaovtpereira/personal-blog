import type { ContentFileWriter } from "@editor/shared/content-files";
import { getDesktopBridge } from "./desktop-bridge";

export class ElectronContentFileWriter implements ContentFileWriter {
  exists(relativePath: string) {
    return getDesktopBridge().fileExists(relativePath);
  }

  writeMarkdown(relativePath: string, content: string) {
    return getDesktopBridge().writeContent(relativePath, content);
  }

  copyImage(sourcePath: string, relativeDestination: string) {
    return getDesktopBridge().copyImage(sourcePath, relativeDestination);
  }
}
