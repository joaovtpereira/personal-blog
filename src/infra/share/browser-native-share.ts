import type { NativeShare, NativeShareData, NativeShareResult } from "@/shared/share";

/** Web Share API (navigator.share). */
export class BrowserNativeShare implements NativeShare {
  canShare(data: NativeShareData): boolean {
    if (typeof navigator === "undefined" || typeof navigator.share !== "function") return false;
    if (!data.files?.length) return true;
    return typeof navigator.canShare === "function" && navigator.canShare({ files: data.files });
  }

  async share(data: NativeShareData): Promise<NativeShareResult> {
    if (!this.canShare(data)) return "unavailable";
    try {
      await navigator.share(data);
      return "shared";
    } catch (error) {
      return (error as DOMException)?.name === "AbortError" ? "cancelled" : "failed";
    }
  }
}
