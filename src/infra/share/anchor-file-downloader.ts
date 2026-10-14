import type { FileDownloader } from "@/shared/share";

/** Download por um link temporário com o atributo download. */
export class AnchorFileDownloader implements FileDownloader {
  download(file: Blob, fileName: string): void {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
