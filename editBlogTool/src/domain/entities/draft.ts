import { boundBlock, createBlock, type BlockSlot, type EditorBlock, type IdFactory } from "./editor-block";
import type { ContentLocale } from "./draft-options";
import type { ImageRef } from "./image-ref";

export type DraftKind = "thought" | "book" | "game" | "lesson";
export type PostKind = Exclude<DraftKind, "lesson">;

/** Arquivo .md de onde o rascunho veio. Salvar substitui este arquivo (o nome não muda). */
export type ContentSource = {
  /** relativo à raiz do blog */
  path: string;
  id: string;
  slug: string;
  publishedAt: string | null;
  /** posição da aula no estudo */
  order: number | null;
};

/** Coleção que já estava gravada no arquivo aberto. */
export type KeptCollection = {
  status: "join" | "create";
  id: string | null;
  slug: string;
  name: string;
  position: number;
  previousId: string | null;
};

/** Opcionais de todo post: destaque no topo do blog. */
export type PostExtras = { featured: boolean };

export type ThoughtMeta = PostExtras & { title: string; lead: string };

export type BookCollection = {
  /** null = ainda não respondeu */
  /** kept = manter a coleção do arquivo aberto */
  answer: "standalone" | "continuation" | "kept" | null;
  previousReviewId: string | null;
  /** nome da série quando a resenha anterior ainda não está em uma */
  newSeriesName: string;
  kept: KeptCollection | null;
};

export type BookMeta = PostExtras & {
  title: string;
  author: string;
  cover: ImageRef | null;
  year: string;
  pages: string;
  genres: string[];
  score: number | null;
  verdictLine: string;
  /** "Gostei" e "Nem tanto" (opcionais) */
  pros: string[];
  cons: string[];
  collection: BookCollection;
};

export type GameCollection = {
  answer: "standalone" | "existing" | "new" | "kept" | null;
  collectionId: string | null;
  newCollectionName: string;
  kept: KeptCollection | null;
};

export type GameMeta = PostExtras & {
  title: string;
  studio: string;
  platform: string;
  capture: ImageRef | null;
  hours: string;
  year: string;
  genre: string;
  score: number | null;
  verdictLine: string;
  worth: string;
  difficulty: string;
  audience: string;
  pros: string[];
  cons: string[];
  /** jogo zerado (selo ✓ ZERADO) */
  completed: boolean;
  collection: GameCollection;
};

export type PostDraft<TMeta> = { meta: TMeta; blocks: EditorBlock[]; source: ContentSource | null };

export type LessonFormat = "video" | "text";

export type LessonMaterialType = "pdf" | "link" | "arquivo";

export type LessonMaterialDraft = { title: string; url: string; type: LessonMaterialType };

/** Tipo do material pelo endereço: .pdf → PDF, http(s) → link, o resto → arquivo do site. */
export function materialTypeOf(url: string): LessonMaterialType {
  const clean = url.trim().toLowerCase().split(/[?#]/)[0];
  if (clean.endsWith(".pdf")) return "pdf";
  return /^https?:\/\//.test(clean) ? "link" : "arquivo";
}

/** Cartão-resumo das aulas em texto dentro de estudos com vídeo (opcional). */
export type LessonSummaryDraft = { keyIdea: string; text: string };

export type LessonDraft = {
  id: string;
  format: LessonFormat;
  title: string;
  videoUrl: string;
  /** "12:40" */
  duration: string;
  summary: LessonSummaryDraft;
  materials: LessonMaterialDraft[];
  blocks: EditorBlock[];
  source: ContentSource | null;
};

/** opened = estudo de uma pasta aberta em content/post/study/<slug> */
export type StudyChoice = {
  mode: "existing" | "new" | "opened" | null;
  studyId: string | null;
  newStudyName: string;
  opened: { id: string | null; slug: string; title: string } | null;
};

/** Dados do estudo gravados em content/post/study/<estudo>/_study.md (título e tags vêm da escolha do estudo e da Publicação). */
export type StudyMetaDraft = {
  description: string;
  /** posição na listagem de estudos; texto do campo ("3"), vazio = depois dos outros */
  order: string;
};

export const EMPTY_STUDY_META: StudyMetaDraft = { description: "", order: "" };

/** "3" → 3 · vazio ou inválido → null */
export function studyOrderOf(meta: StudyMetaDraft): number | null {
  const value = Number(meta.order.trim());
  return meta.order.trim() && Number.isInteger(value) && value > 0 ? value : null;
}

export type StudyDraft = { study: StudyChoice; meta: StudyMetaDraft; lessons: LessonDraft[] };

export type Publication = { tags: string[]; tagPool: string[]; locale: ContentLocale };

/** Tudo que está aberto no editor: um rascunho por tipo + o estudo com as aulas. */
export type EditorWorkspace = {
  kind: DraftKind;
  thought: PostDraft<ThoughtMeta>;
  book: PostDraft<BookMeta>;
  game: PostDraft<GameMeta>;
  study: StudyDraft;
  publication: Publication;
};

export type PostMetaOf<K extends PostKind> = EditorWorkspace[K]["meta"];

/* ---------- Rascunhos iniciais ---------- */

export function createLesson(newId: IdFactory, format: LessonFormat): LessonDraft {
  const blocks: EditorBlock[] = [boundBlock(newId, "title")];
  if (format === "video") blocks.push(boundBlock(newId, "video"));
  blocks.push(createBlock(newId, "paragraph", { text: "[Abertura da aula: o contexto e a pergunta.]", dropCap: true }));
  return { id: newId(), format, title: "", videoUrl: "", duration: "", summary: { keyIdea: "", text: "" }, materials: [], blocks, source: null };
}

/** Vídeo obrigatório só no formato vídeo: troca o formato e adiciona/remove o bloco fixo do player. */
export function setLessonFormat(lesson: LessonDraft, format: LessonFormat, newId: IdFactory): LessonDraft {
  const hasVideo = lesson.blocks.some((b) => b.type === "bound" && b.slot === "video");
  let blocks = lesson.blocks;
  if (format === "video" && !hasVideo) blocks = [blocks[0], boundBlock(newId, "video"), ...blocks.slice(1)];
  if (format === "text") blocks = blocks.filter((b) => !(b.type === "bound" && b.slot === "video"));
  return { ...lesson, format, blocks };
}

export function createWorkspace(newId: IdFactory): EditorWorkspace {
  const block = createBlock.bind(null, newId);
  const slot = (s: Parameters<typeof boundBlock>[1]) => boundBlock(newId, s);

  return {
    kind: "book",
    thought: {
      meta: { title: "", lead: "", featured: false },
      blocks: [
        slot("title"),
        slot("lead"),
        block("paragraph", { text: "[Parágrafo de abertura: a situação que puxou essa reflexão.]", dropCap: true }),
        block("quote", { text: "[A frase que resume o pensamento.]" }),
        block("heading", { text: "[Contraponto]" }),
        block("paragraph", { text: "[O que poderia estar errado nessa ideia.]" }),
      ],
      source: null,
    },
    book: {
      meta: {
        title: "",
        author: "",
        cover: null,
        year: "",
        pages: "",
        genres: [],
        score: null,
        verdictLine: "",
        pros: [],
        cons: [],
        featured: false,
        collection: { answer: null, previousReviewId: null, newSeriesName: "", kept: null },
      },
      blocks: [
        slot("title"),
        slot("author"),
        slot("cover"),
        slot("factSheet"),
        block("paragraph", { text: "[Abertura: em que momento você leu o livro.]", dropCap: true }),
        block("quote", { text: "[Trecho do livro que ficou com você.]", cite: "[Autor], p. [nº]" }),
        block("spoiler", { text: "[O que acontece no final.]" }),
        block("divider"),
        slot("verdict"),
      ],
      source: null,
    },
    game: {
      meta: {
        title: "",
        studio: "",
        platform: "",
        capture: null,
        hours: "",
        year: "",
        genre: "",
        score: null,
        verdictLine: "",
        worth: "",
        difficulty: "",
        audience: "",
        pros: [],
        cons: [],
        completed: false,
        featured: false,
        collection: { answer: null, collectionId: null, newCollectionName: "", kept: null },
      },
      blocks: [
        slot("title"),
        slot("studioPlatform"),
        slot("capture"),
        slot("factSheet"),
        block("heading", { text: "Jogabilidade" }),
        block("paragraph", { text: "[Como é jogar: controles, ritmo, desafio.]" }),
        slot("inPractice"),
        slot("verdict"),
      ],
      source: null,
    },
    study: {
      study: { mode: null, studyId: null, newStudyName: "", opened: null },
      meta: { ...EMPTY_STUDY_META },
      lessons: [createLesson(newId, "video")],
    },
    publication: { tags: [], tagPool: [], locale: "pt" },
  };
}

/* ---------- Blocos fixos de cada tipo ---------- */

const TEMPLATE_SLOTS: Record<DraftKind, BlockSlot[]> = {
  thought: ["title", "lead"],
  book: ["title", "author", "cover", "factSheet", "verdict"],
  game: ["title", "studioPlatform", "capture", "factSheet", "inPractice", "verdict"],
  lesson: ["title"],
};
const TRAILING_SLOTS: BlockSlot[] = ["inPractice", "verdict"];

/**
 * Um arquivo aberto pode não ter a marcação de algum bloco fixo (::cover...).
 * Os que faltam entram no começo (cabeçalho) ou no fim (prática/veredito), na ordem do modelo.
 */
export function ensureSlots(blocks: EditorBlock[], kind: DraftKind, newId: IdFactory): EditorBlock[] {
  const present = new Set(blocks.flatMap((b) => (b.type === "bound" ? [b.slot] : [])));
  const missing = TEMPLATE_SLOTS[kind].filter((slot) => !present.has(slot));
  const lead = missing.filter((slot) => !TRAILING_SLOTS.includes(slot)).map((slot) => boundBlock(newId, slot));
  const trail = missing.filter((slot) => TRAILING_SLOTS.includes(slot)).map((slot) => boundBlock(newId, slot));
  const firstFree = blocks.findIndex((b) => b.type !== "bound");
  const at = firstFree < 0 ? blocks.length : firstFree;
  return [...blocks.slice(0, at), ...lead, ...blocks.slice(at), ...trail];
}
