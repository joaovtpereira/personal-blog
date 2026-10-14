export type NativeShareData = { title?: string; text?: string; url?: string; files?: File[] };

export type NativeShareResult = "shared" | "cancelled" | "unavailable" | "failed";

/** Menu de compartilhar do sistema (celular, tablet e alguns navegadores de desktop). */
export interface NativeShare {
  /** Se o aparelho aceita compartilhar esses dados (arquivos, por exemplo). */
  canShare(data: NativeShareData): boolean;
  share(data: NativeShareData): Promise<NativeShareResult>;
}
