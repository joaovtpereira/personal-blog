import type { CSSProperties, ReactNode } from "react";
import { IMG } from "./tokens";

/* Peças das imagens de compartilhamento. Regras do gerador (Satori): todo bloco com mais de um filho
   é flex; sem grid, sem variáveis CSS; ícones em SVG (sem caracteres que a fonte não tem). */

export const mono = (size: number, extra?: CSSProperties): CSSProperties => ({
  fontFamily: IMG.mono,
  fontSize: size,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  ...extra,
});

export const serif = (size: number, extra?: CSSProperties): CSSProperties => ({
  fontFamily: IMG.serif,
  fontStyle: "italic",
  fontWeight: 400,
  fontSize: size,
  ...extra,
});

/** Título com a última palavra em serifa itálica (padrão de ênfase do DS). */
export function AccentTitle({ text, size, accent = true }: { text: string; size: number; accent?: boolean }) {
  const words = text.trim().split(/\s+/);
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        fontFamily: IMG.sans,
        fontWeight: 500,
        fontSize: size,
        letterSpacing: "-0.06em",
        lineHeight: 0.95,
      }}
    >
      {words.map((word, i) => {
        const last = accent && words.length > 1 && i === words.length - 1;
        return (
          <span
            key={i}
            style={{
              marginRight: i < words.length - 1 ? size * 0.24 : 0,
              ...(last ? serif(size, { letterSpacing: "-0.02em" }) : {}),
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}

export function Chip({ children, size, inverted = true }: { children: ReactNode; size: number; inverted?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: size * 0.4,
        borderRadius: 999,
        padding: `${size * 0.5}px ${size * 0.9}px`,
        ...(inverted ? { background: IMG.fg, color: IMG.bg } : { border: `2px solid ${IMG.fg}`, color: IMG.fg }),
        ...mono(size),
      }}
    >
      {children}
    </div>
  );
}

export function CheckIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={IMG.fg} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function ArrowIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  );
}

export function PlayIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  );
}

/** Rodapé do story: monograma, nome e chamada para o site. */
export function StoryFooter({ author, cta, arrowInverted = true }: { author: string; cta: string; arrowInverted?: boolean }) {
  const [first, ...rest] = author.split(" ");
  const last = rest.pop() ?? "";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 112,
          height: 112,
          borderRadius: 999,
          border: `2px solid ${IMG.fg}`,
          ...mono(30, { letterSpacing: "0.04em" }),
        }}
      >
        JVP
      </div>
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <div style={{ display: "flex", fontFamily: IMG.sans, fontWeight: 500, fontSize: 40, letterSpacing: "-0.03em" }}>
          <span style={{ marginRight: 10 }}>{[first, ...rest].join(" ")}</span>
          <span style={serif(40)}>{last}</span>
        </div>
        <div style={{ display: "flex", marginTop: 8, color: IMG.mute, ...mono(26, { letterSpacing: "0.08em" }) }}>{cta}</div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 112,
          height: 112,
          borderRadius: 999,
          ...(arrowInverted ? { background: IMG.fg } : { border: `2px solid ${IMG.fg}` }),
        }}
      >
        <ArrowIcon size={52} color={arrowInverted ? IMG.bg : IMG.fg} />
      </div>
    </div>
  );
}

/** Rodapé da prévia do link: nome e domínio. */
export function LinkFooter({ author, host }: { author: string; host: string }) {
  const parts = author.split(" ");
  const last = parts.pop() ?? "";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 32,
        paddingTop: 24,
        borderTop: `1px solid ${IMG.line}`,
      }}
    >
      <div style={{ display: "flex", fontFamily: IMG.sans, fontWeight: 500, fontSize: 24, letterSpacing: "-0.02em" }}>
        <span style={{ marginRight: 7 }}>{parts.join(" ")}</span>
        <span style={serif(24)}>{last}</span>
      </div>
      <div style={{ display: "flex", color: IMG.mute, ...mono(18) }}>{host}</div>
    </div>
  );
}

/** Capa do livro inclinada; sem imagem, a capa vira um bloco com o título. */
export function BookCover({ src, title, label, width }: { src: string | null; title: string; label: string; width: number }) {
  const height = Math.round(width * 1.47);
  const frame: CSSProperties = {
    display: "flex",
    width,
    height,
    borderRadius: `${width * 0.03}px ${width * 0.065}px ${width * 0.065}px ${width * 0.03}px`,
    transform: "rotate(-6deg)",
    boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
    overflow: "hidden",
  };
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- imagem desenhada pelo gerador, não pela página
    return <img src={src} alt="" width={width} height={height} style={{ ...frame, objectFit: "cover", filter: "grayscale(1)" }} />;
  }
  return (
    <div
      style={{
        ...frame,
        flexDirection: "column",
        justifyContent: "space-between",
        background: IMG.fg,
        color: IMG.bg,
        padding: `${width * 0.1}px ${width * 0.094}px`,
      }}
    >
      <div style={{ display: "flex", opacity: 0.55, ...mono(width * 0.058, { letterSpacing: "0.12em" }) }}>{label}</div>
      <div style={{ display: "flex", ...serif(width * 0.155, { lineHeight: 1 }) }}>{title}</div>
    </div>
  );
}

const SCANLINES = "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 8px)";

/** Captura do jogo com HUD (REC e HP), fixa escura nos dois temas. */
export function GameCapture({
  src,
  width,
  height,
  rec,
  scale = 1,
}: {
  src: string | null;
  width: number;
  height: number;
  rec: string;
  scale?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width,
        height,
        borderRadius: 48 * scale,
        overflow: "hidden",
        background: IMG.video,
        color: IMG.fg,
        border: `2px solid ${IMG.line}`,
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- imagem desenhada pelo gerador, não pela página
        <img src={src} alt="" width={width} height={height} style={{ position: "absolute", inset: 0, objectFit: "cover", filter: "grayscale(1)" }} />
      ) : (
        <svg
          width={300 * scale}
          height={200 * scale}
          viewBox="0 0 180 120"
          fill="none"
          stroke={IMG.fg}
          strokeWidth={2}
          style={{ position: "absolute", left: (width - 300 * scale) / 2, top: (height - 200 * scale) / 2, transform: "rotate(-6deg)" }}
        >
          <path d="M40 20h100a30 30 0 0 1 30 30v20a30 30 0 0 1-52 20l-6-8H68l-6 8A30 30 0 0 1 10 70V50a30 30 0 0 1 30-30z" />
          <path d="M48 46v24M36 58h24" />
          <circle cx="128" cy="50" r="5" />
          <circle cx="142" cy="64" r="5" />
        </svg>
      )}
      <div style={{ display: "flex", position: "absolute", inset: 0, backgroundImage: SCANLINES }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12 * scale, position: "absolute", left: 40 * scale, top: 36 * scale, ...mono(24 * scale, { letterSpacing: "0.12em" }) }}>
        <div style={{ display: "flex", width: 16 * scale, height: 16 * scale, borderRadius: 999, background: IMG.fg }} />
        <span>{rec}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 * scale, position: "absolute", right: 40 * scale, top: 36 * scale, ...mono(24 * scale) }}>
        <span>HP</span>
        <div style={{ display: "flex", width: 180 * scale, height: 14 * scale, border: `2px solid ${IMG.fg}`, borderRadius: 14 * scale, padding: 2 }}>
          <div style={{ display: "flex", width: "72%", height: "100%", borderRadius: 10 * scale, background: IMG.fg }} />
        </div>
      </div>
    </div>
  );
}

/** Barras de progresso da trilha: concluídas cheias, a atual pela metade, o resto em linha. */
export function LessonSegments({ number, total, height, gap }: { number: number; total: number; height: number; gap: number }) {
  return (
    <div style={{ display: "flex", gap }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexGrow: 1,
            flexBasis: 0,
            height,
            borderRadius: height,
            background: i < number - 1 ? IMG.fg : i === number - 1 ? "rgba(242,242,240,0.55)" : IMG.line,
          }}
        />
      ))}
    </div>
  );
}

export function ScoreValue({ score, size, faded }: { score: number; size: number; faded?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", fontFamily: IMG.sans, fontWeight: 500, fontSize: size, letterSpacing: "-0.06em", lineHeight: 0.8 }}>
      <span>{score}</span>
      <span style={{ fontSize: size * 0.33, opacity: 0.5, color: faded }}>/5</span>
    </div>
  );
}
