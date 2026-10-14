import type { ImageRef } from "@editor/domain/entities";
import type { PickImage } from "@editor/domain/use-cases";
import type { ImagePicker } from "@editor/shared/image-picker";

export class DesktopImageSelector implements PickImage {
  constructor(private readonly picker: ImagePicker) {}

  async pick(): Promise<ImageRef | null> {
    const picked = await this.picker.pick();
    if (!picked) return null;
    return { sourcePath: picked.path, fileName: picked.name, previewUrl: this.picker.previewUrlOf(picked.path) };
  }
}
