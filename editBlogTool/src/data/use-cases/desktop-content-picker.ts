import type { PickContentFile } from "@editor/domain/use-cases";
import type { ContentFileReader } from "@editor/shared/content-files";

export class DesktopContentPicker implements PickContentFile {
  constructor(private readonly reader: ContentFileReader) {}

  pick() {
    return this.reader.pick();
  }
}
