import type { ImagePicker } from "@editor/shared/image-picker";
import { getDesktopBridge } from "./desktop-bridge";

/** Protocolo registrado em electron/image-protocol.ts. */
const IMAGE_PROTOCOL = "jvp-image";

export class ElectronImagePicker implements ImagePicker {
  pick() {
    return getDesktopBridge().pickImage();
  }

  previewUrlOf(path: string) {
    return `${IMAGE_PROTOCOL}://local/${encodeURIComponent(path)}`;
  }
}
