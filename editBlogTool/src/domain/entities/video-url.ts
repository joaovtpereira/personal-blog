export type VideoProviderGuess = "youtube" | "vimeo" | "file";

const URL_RE = /^https?:\/\/[^\s.]+\.[^\s]+$/;

export const isValidVideoUrl = (url: string) => URL_RE.test(url.trim());

export const videoProviderOf = (url: string): VideoProviderGuess =>
  /youtu\.?be/.test(url) ? "youtube" : /vimeo\.com/.test(url) ? "vimeo" : "file";

/** segundos → "12:40" ou "1:02:05"; "" quando não há duração. */
export function formatDurationText(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || !Number.isFinite(seconds)) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(Math.floor(seconds % 60)).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

/** URL do vídeo a partir do que está gravado (URL completa ou só o id do YouTube/Vimeo). */
export function videoUrlOf(provider: string, ref: string): string {
  if (/^https?:\/\//.test(ref)) return ref;
  if (provider === "youtube") return `https://www.youtube.com/watch?v=${ref}`;
  if (provider === "vimeo") return `https://vimeo.com/${ref}`;
  return ref;
}

/** "12:40" ou "1:02:05" → segundos; null se vazio/inválido. */
export function parseDuration(text: string): number | null {
  const parts = text.trim().split(":").map(Number);
  if (parts.length < 2 || parts.length > 3 || parts.some((n) => !Number.isFinite(n) || n < 0)) return null;
  return parts.reduce((total, n) => total * 60 + n, 0);
}
