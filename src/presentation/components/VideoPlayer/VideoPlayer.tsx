"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { formatDuration, isPlayableVideo, type VideoSource } from "@/domain/entities";
import { Icon } from "../Icon";
import { embedUrl } from "./video-embed";
import styles from "./VideoPlayer.module.css";

type VideoPlayerProps = {
  video: VideoSource | null;
  /** Título da aula, para o rótulo acessível do play. */
  title: string;
  size?: "lesson" | "inline";
};

/**
 * Capa do DS (fundo fixo escuro, linhas de varredura, botão com anel pulsando).
 * Ao tocar em play carrega o vídeo de verdade: YouTube/Vimeo por iframe sem cookies, MP4 pelo player nativo.
 */
export function VideoPlayer({ video, title, size = "lesson" }: VideoPlayerProps) {
  const t = useTranslations("Video");
  const [playing, setPlaying] = useState(false);
  const playable = isPlayableVideo(video);
  const duration = formatDuration(video?.durationSeconds ?? null);
  const frame = `${styles.player} ${styles[size]}`;

  if (playable && playing) {
    const src = embedUrl(video);
    return (
      <div className={frame}>
        {src ? (
          <iframe
            className={styles.media}
            src={src}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <video className={styles.media} src={video.ref} poster={video.poster ?? undefined} controls autoPlay playsInline />
        )}
      </div>
    );
  }

  return (
    <div className={`${frame} ${styles.cover}`} style={video?.poster ? { backgroundImage: `url(${video.poster})` } : undefined}>
      <div className={styles.scan} aria-hidden="true" />
      <span className={`mono ${styles.label}`}>{t("placeholder")}</span>

      {playable ? (
        <button type="button" className={styles.play} aria-label={t("play", { title })} onClick={() => setPlaying(true)}>
          <span className={styles.ring} aria-hidden="true" />
          <Icon name="play" size={26} />
        </button>
      ) : (
        <div className={styles.unavailable} role="status">
          <strong>{t("unavailable")}</strong>
          <span>{t("unavailableHint")}</span>
        </div>
      )}

      <div className={styles.bar} aria-hidden="true">
        <span className={styles.track} />
        {duration && <span className="mono">{duration}</span>}
      </div>
    </div>
  );
}
