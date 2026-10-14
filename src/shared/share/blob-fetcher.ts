/** Busca um arquivo (ex.: a imagem do story) para compartilhar ou baixar. */
export interface BlobFetcher {
  fetch(url: string): Promise<Blob>;
}
