import type { VideoProvider, VideoSource } from "@/domain/entities";
import type { VideoRefModel } from "@/domain/models";

const PROVIDER: Record<VideoRefModel["provider"], VideoProvider> = {
  youtube: "youtube",
  vimeo: "vimeo",
  arquivo: "file",
};

const MODEL_PROVIDER: Record<VideoProvider, VideoRefModel["provider"]> = {
  youtube: "youtube",
  vimeo: "vimeo",
  file: "arquivo",
};

/** Aceita id ou URL completa do YouTube/Vimeo e guarda só o id. */
function normalizeRef(provider: VideoProvider, ref: string): string {
  const value = ref.trim();
  if (provider === "youtube") {
    const match = value.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{6,})/);
    return match ? match[1] : value;
  }
  if (provider === "vimeo") {
    const match = value.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return match ? match[1] : value;
  }
  return value;
}

export const toVideoSource = (model: VideoRefModel): VideoSource => {
  const provider = PROVIDER[model.provider];
  return {
    provider,
    ref: normalizeRef(provider, model.ref),
    durationSeconds: model.duration_seconds ?? null,
    poster: model.poster ?? null,
  };
};

export const toVideoRefModel = (video: VideoSource): VideoRefModel => ({
  provider: MODEL_PROVIDER[video.provider],
  ref: video.ref,
  duration_seconds: video.durationSeconds,
  poster: video.poster,
});
