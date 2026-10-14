import type { ShareNetwork } from "@/domain/entities";
import type {
  CopyLink,
  DownloadImage,
  GetShareLinks,
  ShareImage,
  ShareImageParams,
  ShareImageResult,
  ShareLink,
  ShareLinkResult,
} from "@/domain/use-cases";
import type { BlobFetcher, Clipboard, FileDownloader, NativeShare } from "@/shared/share";

/** Story: menu nativo com o PNG (onde o visitante escolhe Instagram, Facebook, WhatsApp); sem suporte, baixa. */
export class NativeShareImage implements ShareImage {
  constructor(
    private readonly fetcher: BlobFetcher,
    private readonly nativeShare: NativeShare,
    private readonly downloader: FileDownloader,
  ) {}

  async execute({ imageUrl, fileName, title }: ShareImageParams): Promise<ShareImageResult> {
    let blob: Blob;
    try {
      blob = await this.fetcher.fetch(imageUrl);
    } catch {
      return "failed";
    }
    const file = new File([blob], fileName, { type: blob.type || "image/png" });
    if (this.nativeShare.canShare({ files: [file] })) {
      const result = await this.nativeShare.share({ files: [file], title });
      if (result === "shared" || result === "cancelled") return result;
    }
    this.downloader.download(file, fileName);
    return "downloaded";
  }
}

export class BrowserDownloadImage implements DownloadImage {
  constructor(
    private readonly fetcher: BlobFetcher,
    private readonly downloader: FileDownloader,
  ) {}

  async execute({ imageUrl, fileName }: { imageUrl: string; fileName: string }): Promise<boolean> {
    try {
      this.downloader.download(await this.fetcher.fetch(imageUrl), fileName);
      return true;
    } catch {
      return false;
    }
  }
}

export class NativeShareLink implements ShareLink {
  constructor(
    private readonly nativeShare: NativeShare,
    private readonly clipboard: Clipboard,
  ) {}

  async execute({ url, title }: { url: string; title: string }): Promise<ShareLinkResult> {
    const result = await this.nativeShare.share({ url, title });
    if (result === "shared" || result === "cancelled") return result;
    return (await this.clipboard.copy(url)) ? "copied" : "failed";
  }
}

export class ClipboardCopyLink implements CopyLink {
  constructor(private readonly clipboard: Clipboard) {}

  execute({ url }: { url: string }): Promise<boolean> {
    return this.clipboard.copy(url);
  }
}

/** Links públicos de compartilhamento de cada rede. */
export class SocialShareLinks implements GetShareLinks {
  execute({ url, title }: { url: string; title: string }): Record<ShareNetwork, string> {
    const encode = encodeURIComponent;
    return {
      whatsapp: `https://wa.me/?text=${encode(`${title} ${url}`)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encode(url)}`,
      email: `mailto:?subject=${encode(title)}&body=${encode(url)}`,
    };
  }
}
