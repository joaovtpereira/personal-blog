import type { BookShareCard, GameShareCard, LessonShareCard, ThoughtShareCard } from "@/domain/entities";
import { AccentTitle, BookCover, CheckIcon, Chip, GameCapture, LessonSegments, LinkFooter, PlayIcon, ScoreValue, mono, serif } from "./parts";
import type { ShareImageProps } from "./StoryImage";
import { IMG } from "./tokens";

/** Prévia do link (Open Graph) 1200×630: texto à esquerda e o visual do tipo à direita. */
export function LinkImage(props: ShareImageProps) {
  const { card } = props;
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        padding: 56,
        gap: 48,
        background: IMG.bg,
        color: IMG.fg,
        fontFamily: IMG.sans,
        overflow: "hidden",
      }}
    >
      {card.kind === "thought" && <ThoughtLink {...props} card={card} />}
      {card.kind === "book" && <BookLink {...props} card={card} />}
      {card.kind === "game" && <GameLink {...props} card={card} />}
      {card.kind === "lesson" && <LessonLink {...props} card={card} />}
    </div>
  );
}

/** O gerador trata fragmentos como um bloco: cada tipo ganha sua linha. */
const KIND_ROW = { display: "flex", flexGrow: 1, gap: 48 } as const;

const textColumn = { display: "flex", flexDirection: "column", flexGrow: 1, flexBasis: 0, padding: "8px 0 8px 16px" } as const;

function ThoughtLink({ card, labels }: { card: ThoughtShareCard; labels: ShareImageProps["labels"] }) {
  return (
    <div style={{ ...textColumn, padding: "8px 16px" }}>
      <div style={{ display: "flex", position: "absolute", right: -16, top: -120, opacity: 0.08, ...serif(640, { lineHeight: 1 }) }}>“</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Chip size={18}>{labels.kind}</Chip>
        <div style={{ display: "flex", color: IMG.mute, ...mono(18) }}>{labels.meta}</div>
      </div>
      <div style={{ display: "flex", marginTop: "auto", maxWidth: 920 }}>
        <AccentTitle text={card.title} size={92} />
      </div>
      {card.lead && <div style={{ display: "flex", marginTop: 24, maxWidth: 900, color: IMG.mute, ...serif(36, { lineHeight: 1.25 }) }}>{card.lead}</div>}
      <LinkFooter author={labels.author} host={labels.host} />
    </div>
  );
}

function BookLink({ card, labels, image }: { card: BookShareCard; labels: ShareImageProps["labels"]; image: string | null }) {
  return (
    <div style={KIND_ROW}>
      <div style={textColumn}>
        <div style={{ display: "flex" }}>
          <Chip size={18}>{labels.kind}</Chip>
        </div>
        <div style={{ display: "flex", marginTop: "auto" }}>
          <AccentTitle text={card.title} size={88} accent={false} />
        </div>
        <div style={{ display: "flex", marginTop: 14, color: IMG.mute, ...serif(40) }}>{labels.by}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 36 }}>
          <ScoreValue score={card.verdict.score} size={72} />
          <div style={{ display: "flex", ...serif(30, { lineHeight: 1.15 }) }}>{card.verdict.line}</div>
        </div>
        <LinkFooter author={labels.author} host={labels.host} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 400, borderRadius: 36, background: IMG.card, border: `1px solid ${IMG.line}` }}>
        <BookCover src={image} title={card.title} label={labels.cover} width={240} />
      </div>
    </div>
  );
}

function GameLink({ card, labels, image }: { card: GameShareCard; labels: ShareImageProps["labels"]; image: string | null }) {
  return (
    <div style={KIND_ROW}>
      <div style={textColumn}>
        <div style={{ display: "flex", gap: 10 }}>
          <Chip size={18}>{labels.kind}</Chip>
          {card.completed && (
            <Chip size={18} inverted={false}>
              <CheckIcon size={20} />
              <span>{labels.completed}</span>
            </Chip>
          )}
        </div>
        <div style={{ display: "flex", marginTop: "auto" }}>
          <AccentTitle text={card.title} size={84} accent={false} />
        </div>
        <div style={{ display: "flex", marginTop: 14, color: IMG.mute, ...serif(38) }}>{`${card.studio} · ${card.platform}`}</div>
        <div style={{ display: "flex", gap: 28, marginTop: 32, color: IMG.mute, ...mono(18) }}>
          <span>{labels.hoursPlayed}</span>
          <span>{`${labels.score} ${card.verdict.score}/5`}</span>
        </div>
        <LinkFooter author={labels.author} host={labels.host} />
      </div>
      <GameCapture src={image} width={480} height={518} rec={labels.rec} scale={0.6} />
    </div>
  );
}

function LessonLink({ card, labels }: { card: LessonShareCard; labels: ShareImageProps["labels"] }) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div style={KIND_ROW}>
      <div style={textColumn}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Chip size={18}>{labels.kind}</Chip>
          <div style={{ display: "flex", color: IMG.mute, ...mono(18) }}>{labels.meta}</div>
        </div>
        <div style={{ display: "flex", marginTop: "auto" }}>
          <AccentTitle text={card.title} size={88} />
        </div>
        {card.keyIdea && <div style={{ display: "flex", marginTop: 18, color: IMG.mute, ...serif(32, { lineHeight: 1.25 }) }}>{`“${card.keyIdea}”`}</div>}
        <LinkFooter author={labels.author} host={labels.host} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: 400, borderRadius: 36, border: `1px solid ${IMG.line}`, background: IMG.card, padding: 36 }}>
        <div style={{ display: "flex", color: IMG.mute, ...mono(16, { letterSpacing: "0.12em" }) }}>{labels.lessonWord}</div>
        <div style={{ display: "flex", alignItems: "baseline", marginTop: 12, fontWeight: 500, fontSize: 150, letterSpacing: "-0.07em", lineHeight: 0.85 }}>
          <span>{pad(card.number)}</span>
          <span style={{ fontSize: 48, color: IMG.mute, letterSpacing: "-0.03em" }}>{`/${pad(card.total)}`}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <LessonSegments number={card.number} total={card.total} height={8} gap={6} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, ...mono(16) }}>
          {card.format === "video" && <PlayIcon size={16} color={IMG.fg} />}
          <span>{labels.lessonFormat}</span>
        </div>
      </div>
    </div>
  );
}
