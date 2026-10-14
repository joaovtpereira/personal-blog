import type { BlobFetcher } from "@/shared/share";

export class FetchBlobFetcher implements BlobFetcher {
  async fetch(url: string): Promise<Blob> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status} em ${url}`);
    return response.blob();
  }
}
