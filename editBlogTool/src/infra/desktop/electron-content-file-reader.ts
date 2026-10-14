import type { ContentFileReader } from "@editor/shared/content-files";
import { getDesktopBridge } from "./desktop-bridge";

export class ElectronContentFileReader implements ContentFileReader {
  blogRoot() {
    return getDesktopBridge().blogRoot();
  }

  list() {
    return getDesktopBridge().listContent();
  }

  read(relativePath: string) {
    return getDesktopBridge().readContent(relativePath);
  }

  pick() {
    return getDesktopBridge().pickMarkdown();
  }
}
