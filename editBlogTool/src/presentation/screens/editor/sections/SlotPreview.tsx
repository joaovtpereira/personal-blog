import { Badge } from "@/presentation/components/Badge";
import { ContentRenderer } from "@/presentation/components/Content";
import { BookCoverStage, GameCaptureStage } from "@/presentation/components/CoverStage";
import { FactSheet, type Fact } from "@/presentation/components/FactSheet";
import { VerdictCard } from "@/presentation/components/VerdictCard";
import { isValidVideoUrl, type BlockSlot, type BookMeta, type EditorWorkspace, type GameMeta, type LessonDraft } from "@editor/domain/entities";
import type { BlockPreviewMapper } from "@editor/domain/mappers";
import { KIND_EYEBROW } from "@editor/presentation/utils/block-meta";
import { pad2 } from "@editor/presentation/utils/text-lines";
import styles from "./DocumentCanvas.module.css";

export type SlotContext = {
  workspace: EditorWorkspace;
  lesson: LessonDraft;
  lessonIndex: number;
  preview: BlockPreviewMapper;
};

const or = (value: string, placeholder: string) => (value.trim() ? value : placeholder);

const TITLE_PLACEHOLDER = { thought: "[Título do pensamento]", book: "[Nome do livro]", game: "[Nome do jogo]", lesson: "[Título da aula]" };

function bookFacts(meta: BookMeta): Fact[] {
  return [
    { label: "Autor", value: or(meta.author, "[autor]") },
    { label: "Ano", value: or(meta.year, "[ano]") },
    { label: "Páginas", value: or(meta.pages, "[nº]") },
    { label: "Gêneros", value: meta.genres.length ? meta.genres.join(", ") : "[gêneros]" },
  ];
}

function gameFacts(meta: GameMeta): Fact[] {
  return [
    { label: "Plataforma", value: or(meta.platform, "[plataforma]") },
    { label: "Horas jogadas", value: meta.hours.trim() ? `${meta.hours}h` : "[XX]h" },
    { label: "Gênero", value: or(meta.genre, "[gênero]") },
    { label: "Lançamento", value: or(meta.year, "[ano]") },
  ];
}

/** Blocos fixos renderizados com os componentes do blog a partir dos dados obrigatórios. */
export function SlotPreview({ slot, context }: { slot: BlockSlot; context: SlotContext }) {
  const { workspace, lesson, lessonIndex, preview } = context;
  const { kind } = workspace;
  const book = workspace.book.meta;
  const game = workspace.game.meta;
  const lead = (text: string) => <ContentRenderer blocks={[preview.lead(text)]} headingOffset={0} />;

  switch (slot) {
    case "title": {
      const title = kind === "lesson" ? lesson.title : workspace[kind].meta.title;
      const eyebrow = kind === "lesson" ? `Aula ${pad2(lessonIndex + 1)} · ${lesson.format === "video" ? "Vídeo" : "Texto"}` : KIND_EYEBROW[kind];
      return (
        <div className={styles.titleSlot}>
          <Badge>{eyebrow.toUpperCase()}</Badge>
          <h2 className={`${styles.docTitle} ${title.trim() ? "" : styles.placeholder}`}>{or(title, TITLE_PLACEHOLDER[kind])}</h2>
        </div>
      );
    }
    case "lead":
      return lead(or(workspace.thought.meta.lead, "[Linha fina: a ideia que move o texto.]"));
    case "author":
      return lead(`por ${or(book.author, "[Autor]")}`);
    case "studioPlatform":
      return lead(`${or(game.studio, "[Estúdio]")} · ${or(game.platform, "[Plataforma]")}`);
    case "cover":
      return (
        <div className={styles.stage}>
          <BookCoverStage title={or(book.title, "[Nome do livro]")} image={book.cover?.previewUrl ?? null} placeholderLabel="ENVIE A CAPA NA ABA DADOS" />
        </div>
      );
    case "capture":
      return (
        <div className={styles.stage}>
          <GameCaptureStage image={game.capture?.previewUrl ?? null} label={game.capture ? "CAPTURA DO AUTOR" : "ENVIE A CAPTURA NA ABA DADOS"} alt={`Captura de ${or(game.title, "[Nome do jogo]")}`} />
        </div>
      );
    case "factSheet":
      return <FactSheet title="Ficha técnica" facts={kind === "game" ? gameFacts(game) : bookFacts(book)} columns={2} />;
    case "inPractice":
      return (
        <FactSheet
          title="Na prática"
          columns={3}
          facts={[
            { label: "Vale o preço?", value: or(game.worth, "[sim / em promoção / não]") },
            { label: "Dificuldade", value: or(game.difficulty, "[nível]") },
            { label: "Para quem", value: or(game.audience, "[perfil]") },
          ]}
        />
      );
    case "verdict": {
      const meta = kind === "game" ? game : book;
      const score = meta.score ?? 0;
      return (
        <div className={styles.verdict}>
          <VerdictCard label="Veredito" line={or(meta.verdictLine, "[Uma linha final]")} score={score} scoreLabel={`Nota ${score} de 5`} />
        </div>
      );
    }
    case "video":
      return isValidVideoUrl(lesson.videoUrl) ? (
        <ContentRenderer
          headingOffset={0}
          blocks={[preview.toContentBlock({ id: "lesson-video", type: "video", url: lesson.videoUrl, duration: lesson.duration })]}
        />
      ) : (
        <div className={`mono ${styles.mediaPlaceholder}`} style={{ aspectRatio: "16 / 9" }}>
          SEM VÍDEO — OBRIGATÓRIO NO FORMATO VÍDEO. ADICIONE NA ABA DADOS.
        </div>
      );
  }
}
