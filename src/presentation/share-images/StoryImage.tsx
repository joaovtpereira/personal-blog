import type { ReactNode } from "react";
import type { BookShareCard, GameShareCard, LessonShareCard, ShareCard, ThoughtShareCard } from "@/domain/entities";
import {
  AccentTitle,
  BookCover,
  CheckIcon,
  Chip,
  GameCapture,
  LessonSegments,
  PlayIcon,
  ScoreValue,
  StoryFooter,
  mono,
  serif,
} from "./parts";
import { IMG, type ShareImageLabels } from "./tokens";

export type ShareImageProps<C extends ShareCard = ShareCard> = {
  card: C;
  labels: ShareImageLabels;
  /** Capa ou captura já resolvida (data URI / URL). */
  image: string | null;
};

/** O gerador trata fragmentos como um bloco: cada tipo ganha sua coluna. */
const KIND_COLUMN = { display: "flex", flexDirection: "column", flexGrow: 1 } as const;

/** Story 1080×1920. Topo e rodapé ficam livres para os controles do Instagram/WhatsApp. */
export function StoryImage(props: ShareImageProps) {
  const { card } = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        width: "100%",
        height: "100%",
        padding: "220px 96px 300px",
        background: IMG.bg,
        color: IMG.fg,
        fontFamily: IMG.sans,
        overflow: "hidden",
      }}
    >
      {card.kind === "thought" && <ThoughtStory {...props} card={card} />}
      {card.kind === "book" && <BookStory {...props} card={card} />}
      {card.kind === "game" && <GameStory {...props} card={card} />}
      {card.kind === "lesson" && <LessonStory {...props} card={card} />}
    </div>
  );
}

function Header({ labels, extra }: { labels: ShareImageLabels; extra?: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Chip size={28}>{labels.kind}</Chip>
      {extra ?? <div style={{ display: "flex", color: IMG.mute, ...mono(28) }}>{labels.meta}</div>}
    </div>
  );
}

function ThoughtStory({ card, labels }: ShareImageProps<ThoughtShareCard>) {
  return (
    <div style={KIND_COLUMN}>
      <div style={{ display: "flex", position: "absolute", right: -40, top: 20, opacity: 0.07, ...serif(1100, { lineHeight: 1 }) }}>“</div>
      <Header labels={labels} />
      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
        <AccentTitle text={card.title} size={136} />
        {card.lead && <div style={{ display: "flex", marginTop: 48, color: IMG.mute, ...serif(58, { lineHeight: 1.25 }) }}>{card.lead}</div>}
      </div>
      {card.keyIdea && (
        <div style={{ display: "flex", flexDirection: "column", marginTop: 72, paddingTop: 48, borderTop: `2px solid ${IMG.fg}` }}>
          <div style={{ display: "flex", color: IMG.mute, ...mono(26, { letterSpacing: "0.12em" }) }}>{labels.keyIdea}</div>
          <div style={{ display: "flex", marginTop: 20, ...serif(72, { lineHeight: 1.12 }) }}>{`“${card.keyIdea}”`}</div>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", paddingTop: 48 }}>
        <StoryFooter author={labels.author} cta={labels.cta} />
      </div>
    </div>
  );
}

function BookStory({ card, labels, image }: ShareImageProps<BookShareCard>) {
  return (
    <div style={KIND_COLUMN}>
      <Header labels={labels} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 56,
          height: 560,
          borderRadius: 48,
          background: IMG.card,
          border: `2px solid ${IMG.line}`,
        }}
      >
        <BookCover src={image} title={card.title} label={labels.cover} width={340} />
      </div>
      <div style={{ display: "flex", marginTop: 64 }}>
        <AccentTitle text={card.title} size={120} accent={false} />
      </div>
      <div style={{ display: "flex", marginTop: 20, color: IMG.mute, ...serif(56) }}>{labels.by}</div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 56, borderRadius: 40, background: IMG.fg, color: IMG.bg, padding: "44px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", flexShrink: 1 }}>
            <div style={{ display: "flex", opacity: 0.6, ...mono(24, { letterSpacing: "0.12em" }) }}>{labels.verdict}</div>
            <div style={{ display: "flex", marginTop: 14, ...serif(56, { lineHeight: 1.1 }) }}>{card.verdict.line}</div>
          </div>
          <ScoreValue score={card.verdict.score} size={168} />
        </div>
        <div style={{ display: "flex", marginTop: 32, height: 8, borderRadius: 8, background: "rgba(10,10,10,0.25)" }}>
          <div style={{ display: "flex", width: `${(card.verdict.score / 5) * 100}%`, height: 8, borderRadius: 8, background: IMG.bg }} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", paddingTop: 48 }}>
        <StoryFooter author={labels.author} cta={labels.cta} arrowInverted={false} />
      </div>
    </div>
  );
}

function GameStory({ card, labels, image }: ShareImageProps<GameShareCard>) {
  const stat = (label: string, value: ReactNode, inverted = false) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        flexBasis: 0,
        borderRadius: 36,
        padding: 32,
        ...(inverted ? { background: IMG.fg, color: IMG.bg } : { border: `2px solid ${IMG.line}` }),
      }}
    >
      <div style={{ display: "flex", color: inverted ? undefined : IMG.mute, opacity: inverted ? 0.6 : 1, ...mono(22, { letterSpacing: "0.12em" }) }}>{label}</div>
      <div style={{ display: "flex", marginTop: 16 }}>{value}</div>
    </div>
  );
  return (
    <div style={KIND_COLUMN}>
      <Header
        labels={labels}
        extra={
          card.completed ? (
            <Chip size={28} inverted={false}>
              <CheckIcon size={30} />
              <span>{labels.completed}</span>
            </Chip>
          ) : undefined
        }
      />
      <div style={{ display: "flex", marginTop: 56 }}>
        <GameCapture src={image} width={888} height={500} rec={labels.capture} />
      </div>
      <div style={{ display: "flex", marginTop: 64 }}>
        <AccentTitle text={card.title} size={120} accent={false} />
      </div>
      <div style={{ display: "flex", marginTop: 20, color: IMG.mute, ...serif(56) }}>{`${card.studio} · ${card.platform}`}</div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginTop: 56 }}>
        {stat(labels.hours, <span style={{ fontWeight: 500, fontSize: 72, letterSpacing: "-0.05em", lineHeight: 1 }}>{`${card.hours}h`}</span>)}
        {stat(labels.worth, <span style={serif(44, { lineHeight: 1.05 })}>{card.worth}</span>)}
        {stat(labels.score, <ScoreValue score={card.verdict.score} size={72} />, true)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", paddingTop: 48 }}>
        <StoryFooter author={labels.author} cta={labels.cta} arrowInverted={false} />
      </div>
    </div>
  );
}

function LessonStory({ card, labels }: ShareImageProps<LessonShareCard>) {
  return (
    <div style={KIND_COLUMN}>
      <Header labels={labels} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 56, color: IMG.mute, ...mono(26, { letterSpacing: "0.12em" }) }}>
        <span>{labels.lessonPosition}</span>
        <span>{labels.lessonFormat}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 20 }}>
        <LessonSegments number={card.number} total={card.total} height={10} gap={10} />
      </div>
      <div style={{ display: "flex", marginTop: 56 }}>
        <AccentTitle text={card.title} size={124} />
      </div>
      {card.format === "video" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            marginTop: 56,
            height: 480,
            borderRadius: 48,
            background: IMG.video,
            border: `2px solid ${IMG.line}`,
          }}
        >
          <div style={{ display: "flex", position: "absolute", width: 240, height: 240, borderRadius: 999, border: "2px solid rgba(242,242,240,0.25)", left: 324, top: 118 }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 160, height: 160, borderRadius: 999, background: IMG.fg }}>
            <PlayIcon size={56} color={IMG.video} />
          </div>
        </div>
      )}
      {card.keyIdea && (
        <div style={{ display: "flex", flexDirection: "column", marginTop: 56, borderRadius: 40, border: `2px solid ${IMG.fg}`, padding: "44px 48px" }}>
          <div style={{ display: "flex", color: IMG.mute, ...mono(24, { letterSpacing: "0.12em" }) }}>{labels.keyIdea}</div>
          <div style={{ display: "flex", marginTop: 18, ...serif(64, { lineHeight: 1.12 }) }}>{`“${card.keyIdea}”`}</div>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", paddingTop: 48 }}>
        <StoryFooter author={labels.author} cta={labels.cta} />
      </div>
    </div>
  );
}

