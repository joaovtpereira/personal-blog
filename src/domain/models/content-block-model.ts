/**
 * Blocos como saem do parser de markdown (tipos no estilo mdast). Textos podem ter
 * marcação inline: **negrito**, *itálico*, `código` e [link](url).
 */
export type VideoRefModel = {
  provider: "youtube" | "vimeo" | "arquivo";
  ref: string;
  duration_seconds?: number | null;
  poster?: string | null;
};

export type ContentBlockModel =
  | { type: "heading"; depth: 2 | 3 | 4; text: string }
  | { type: "lead"; text: string }
  | { type: "paragraph"; text: string; drop_cap?: boolean; muted?: boolean }
  | { type: "key_idea"; label?: string | null; text: string }
  | { type: "blockquote"; text: string; cite?: string | null }
  | { type: "reference"; text: string }
  | { type: "code"; value: string; lang?: string | null; filename?: string | null }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "checklist"; title?: string | null; items: { text: string; checked: boolean }[] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "table"; caption?: string | null; header: string[]; rows: string[][] }
  | { type: "callout"; tone: "nota" | "dica" | "atencao" | "exercicio"; title?: string | null; text: string }
  | { type: "image"; src: string; alt: string; caption?: string | null; credit?: string | null; ratio?: string | null }
  | { type: "video"; video: VideoRefModel; caption?: string | null }
  | { type: "key_points"; title?: string | null; items: string[] }
  | { type: "glossary"; items: { term: string; definition: string }[] }
  | { type: "thematic_break"; variant?: "linha" | "curto" | "ornamento" }
  | { type: "spoiler"; text: string };
