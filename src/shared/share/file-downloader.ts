/** Salva um arquivo no aparelho do visitante. */
export interface FileDownloader {
  download(file: Blob, fileName: string): void;
}
