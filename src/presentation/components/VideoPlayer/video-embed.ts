import type { VideoSource } from "@/domain/entities";

/** URL de embed sem cookies de rastreio, com autoplay (o usuário já tocou em play). */
export function embedUrl(video: VideoSource): string | null {
  switch (video.provider) {
    case "youtube":
      return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.ref)}?autoplay=1&rel=0&modestbranding=1`;
    case "vimeo":
      return `https://player.vimeo.com/video/${encodeURIComponent(video.ref)}?autoplay=1&dnt=1`;
    default:
      return null;
  }
}
