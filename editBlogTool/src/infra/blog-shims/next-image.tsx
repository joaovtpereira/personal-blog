import type { CSSProperties, ImgHTMLAttributes } from "react";

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string | { src: string };
  alt: string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
};

const FILL: CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };

/** Adaptador de `next/image` para o Electron: <img> simples, com o mesmo comportamento de `fill`. */
export default function Image({ src, alt, fill = false, priority = false, quality: _quality, style, ...rest }: ImageProps) {
  void _quality;
  return (
    <img
      src={typeof src === "string" ? src : src.src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      style={fill ? { ...FILL, ...style } : style}
      {...rest}
    />
  );
}
