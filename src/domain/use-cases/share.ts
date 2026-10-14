import type { Locale, ShareCard, ShareNetwork } from "../entities";

/** O que um post mostra ao ser compartilhado. null quando o post não existe no idioma. */
export interface GetPostShareCard {
  execute(params: { locale: Locale; slug: string }): Promise<ShareCard | null>;
}

/** O que uma aula mostra ao ser compartilhada. null quando a aula não existe no idioma. */
export interface GetLessonShareCard {
  execute(params: { locale: Locale; studySlug: string; lessonSlug: string }): Promise<ShareCard | null>;
}

export type ShareImageParams = { imageUrl: string; fileName: string; title: string };

/** shared: foi para o menu nativo · downloaded: o aparelho não compartilha arquivos, então baixou. */
export type ShareImageResult = "shared" | "downloaded" | "cancelled" | "failed";

/** Envia a imagem do story pelo menu nativo (Instagram, Facebook, WhatsApp...) ou baixa. */
export interface ShareImage {
  execute(params: ShareImageParams): Promise<ShareImageResult>;
}

/** Só baixa a imagem. */
export interface DownloadImage {
  execute(params: Omit<ShareImageParams, "title">): Promise<boolean>;
}

export type ShareLinkResult = "shared" | "copied" | "cancelled" | "failed";

/** Menu nativo com o link; sem ele, copia. */
export interface ShareLink {
  execute(params: { url: string; title: string }): Promise<ShareLinkResult>;
}

export interface CopyLink {
  execute(params: { url: string }): Promise<boolean>;
}

/** Endereços de compartilhamento de cada rede para um link. */
export interface GetShareLinks {
  execute(params: { url: string; title: string }): Record<ShareNetwork, string>;
}
