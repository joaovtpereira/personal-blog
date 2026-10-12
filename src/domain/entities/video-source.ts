export type VideoProvider = "youtube" | "vimeo" | "file";

/** De onde vem um vídeo. YouTube/Vimeo usam o id; arquivo usa a URL do MP4. */
export type VideoSource = {
  provider: VideoProvider;
  /** id no YouTube/Vimeo ou URL do arquivo */
  ref: string;
  durationSeconds: number | null;
  poster: string | null;
};

export const isPlayableVideo = (video: VideoSource | null | undefined): video is VideoSource =>
  !!video && video.ref.trim().length > 0;

/** "12:40" ou "1:02:05" */
export function formatDuration(totalSeconds: number | null): string | null {
  if (totalSeconds === null || totalSeconds < 0) return null;
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return `${h > 0 ? `${h}:` : ""}${mm}:${String(s).padStart(2, "0")}`;
}
