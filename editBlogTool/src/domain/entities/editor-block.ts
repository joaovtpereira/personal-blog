import type { ImageRef } from "./image-ref";

export type HeadingLevel = 2 | 3 | 4;
export type CalloutTone = "note" | "tip" | "warning" | "exercise";
export type DividerVariant = "line" | "short" | "ornament";
export type FigureRatio = "16 / 9" | "2 / 3" | "1 / 1";

/**
 * Blocos fixos: o conteúdo vem dos dados obrigatórios (aba Dados) e não é editado no bloco.
 * O autor só muda a posição deles no documento.
 */
export type BlockSlot =
  | "title"
  | "lead"
  | "author"
  | "studioPlatform"
  | "cover"
  | "capture"
  | "factSheet"
  | "inPractice"
  | "verdict"
  | "video";

/** Blocos livres, criados pela biblioteca e editados no inspector. */
export type FreeBlockData =
  | { type: "heading"; level: HeadingLevel; text: string; accent: string }
  | { type: "paragraph"; text: string; dropCap: boolean }
  | { type: "quote"; text: string; cite: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "checklist"; title: string; items: string[] }
  | { type: "figure"; image: ImageRef | null; alt: string; caption: string; credit: string; ratio: FigureRatio }
  | { type: "video"; url: string; duration: string }
  | { type: "divider"; variant: DividerVariant }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "table"; caption: string; columns: string[]; rows: string[][] }
  | { type: "code"; filename: string; code: string; lineNumbers: boolean }
  | { type: "callout"; tone: CalloutTone; title: string; text: string }
  | { type: "spoiler"; text: string }
  | { type: "keyPoints"; items: string[] }
  | { type: "glossary"; items: { term: string; definition: string }[] }
  /** trecho de um arquivo aberto que o editor não reconhece: volta ao arquivo exatamente como está */
  | { type: "raw"; markdown: string };

export type BoundBlockData = { type: "bound"; slot: BlockSlot };

export type FreeBlockType = FreeBlockData["type"];

export type FreeBlock = { id: string } & FreeBlockData;
export type BoundBlock = { id: string } & BoundBlockData;
export type EditorBlock = FreeBlock | BoundBlock;

export const isBound = (block: EditorBlock): block is BoundBlock => block.type === "bound";

/** Conteúdo inicial de cada bloco livre (marcadores [ ] indicam o que falta escrever). */
export const BLOCK_DEFAULTS: { [T in FreeBlockType]: Extract<FreeBlockData, { type: T }> } = {
  heading: { type: "heading", level: 2, text: "[Subtítulo]", accent: "" },
  paragraph: { type: "paragraph", text: "[Escreva o parágrafo.]", dropCap: false },
  quote: { type: "quote", text: "[Trecho em destaque.]", cite: "" },
  list: { type: "list", ordered: false, items: ["[Item 1]", "[Item 2]", "[Item 3]"] },
  checklist: { type: "checklist", title: "Antes da próxima aula", items: ["[Tarefa 1]", "[Tarefa 2]"] },
  figure: { type: "figure", image: null, alt: "", caption: "[Legenda da imagem.]", credit: "", ratio: "16 / 9" },
  video: { type: "video", url: "", duration: "" },
  divider: { type: "divider", variant: "ornament" },
  steps: {
    type: "steps",
    items: [
      { title: "[Passo 1]", text: "[explicação]" },
      { title: "[Passo 2]", text: "[explicação]" },
    ],
  },
  table: {
    type: "table",
    caption: "[Título da tabela]",
    columns: ["Coluna A", "Coluna B"],
    rows: [
      ["[valor]", "[valor]"],
      ["[valor]", "[valor]"],
    ],
  },
  code: { type: "code", filename: "exemplo.ts", code: "// [seu código aqui]", lineNumbers: true },
  callout: { type: "callout", tone: "tip", title: "", text: "[Texto do aviso.]" },
  spoiler: { type: "spoiler", text: "[Trecho com spoiler.]" },
  keyPoints: { type: "keyPoints", items: ["[Ideia 1]", "[Ideia 2]", "[Ideia 3]"] },
  glossary: {
    type: "glossary",
    items: [
      { term: "[Termo]", definition: "[definição]" },
      { term: "[Termo]", definition: "[definição]" },
    ],
  },
  raw: { type: "raw", markdown: "" },
};

export type IdFactory = () => string;

export const createBlock = <T extends FreeBlockType>(
  newId: IdFactory,
  type: T,
  data: Partial<Extract<FreeBlockData, { type: T }>> = {},
): FreeBlock => ({ ...structuredClone(BLOCK_DEFAULTS[type]), ...data, id: newId() }) as FreeBlock;

export const boundBlock = (newId: IdFactory, slot: BlockSlot): BoundBlock => ({ id: newId(), type: "bound", slot });

/** Marcadores "[ ... ]" que o autor ainda não trocou por texto (links e imagens do markdown não contam). */
export const hasPlaceholder = (block: EditorBlock): boolean =>
  !isBound(block) && block.type !== "raw" && /(?<!!)\[[^\]]+\](?!\()/.test(JSON.stringify({ ...block, image: undefined }));

/* ---------- Operações na lista de blocos (puras) ---------- */

export function moveBlock(blocks: EditorBlock[], id: string, direction: -1 | 1): EditorBlock[] {
  const from = blocks.findIndex((b) => b.id === id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= blocks.length) return blocks;
  const next = blocks.slice();
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}

/** Insere depois do bloco `afterId` (ou no fim, se não houver). */
export function insertBlock(blocks: EditorBlock[], block: EditorBlock, afterId: string | null): EditorBlock[] {
  const index = afterId ? blocks.findIndex((b) => b.id === afterId) : -1;
  const at = index >= 0 ? index + 1 : blocks.length;
  return [...blocks.slice(0, at), block, ...blocks.slice(at)];
}

/** Blocos fixos não podem ser duplicados nem removidos. */
export function duplicateBlock(blocks: EditorBlock[], id: string, newId: IdFactory): EditorBlock[] {
  const source = blocks.find((b) => b.id === id);
  if (!source || isBound(source)) return blocks;
  return insertBlock(blocks, { ...structuredClone(source), id: newId() }, id);
}

export function removeBlock(blocks: EditorBlock[], id: string): EditorBlock[] {
  return blocks.filter((b) => b.id !== id || isBound(b));
}

export function updateBlock(blocks: EditorBlock[], id: string, patch: Partial<FreeBlockData>): EditorBlock[] {
  return blocks.map((b) => (b.id === id && !isBound(b) ? ({ ...b, ...patch } as FreeBlock) : b));
}

/* ---------- Leitura ---------- */

const WORDS_PER_MINUTE = 200;

function blockText(block: EditorBlock): string {
  switch (block.type) {
    case "bound":
    case "divider":
    case "video":
      return "";
    case "figure":
      return block.caption;
    case "list":
    case "checklist":
    case "keyPoints":
      return block.items.join(" ");
    case "steps":
      return block.items.map((i) => `${i.title} ${i.text}`).join(" ");
    case "glossary":
      return block.items.map((i) => `${i.term} ${i.definition}`).join(" ");
    case "table":
      return block.rows.flat().join(" ");
    case "code":
      return block.code;
    case "raw":
      return block.markdown;
    default:
      return block.text;
  }
}

export const countWords = (blocks: EditorBlock[]) =>
  blocks.reduce((total, block) => total + (blockText(block).match(/\S+/g)?.length ?? 0), 0);

/** Tempo estimado de leitura (mínimo 1 minuto). */
export const readingMinutes = (blocks: EditorBlock[]) => Math.max(1, Math.round(countWords(blocks) / WORDS_PER_MINUTE));
