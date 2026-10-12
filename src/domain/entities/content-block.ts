import type { RichText } from "./rich-text";
import type { VideoSource } from "./video-source";

/**
 * Blocos de conteúdo editorial (aulas, posts). Vêm do markdown e são traduzidos para cá pelos mappers.
 * Cada tipo corresponde a um componente do Design System.
 */
export type ContentBlock =
  | { type: "heading"; level: 2 | 3 | 4; text: string; anchor: string }
  | { type: "lead"; text: RichText }
  | { type: "paragraph"; text: RichText; dropCap: boolean; muted: boolean }
  | { type: "keyIdea"; label: string | null; text: string }
  | { type: "quote"; text: RichText; cite: string | null }
  | { type: "reference"; text: string }
  | { type: "code"; code: string; language: string | null; filename: string | null }
  | { type: "list"; ordered: boolean; items: RichText[] }
  | { type: "checklist"; title: string | null; items: { text: RichText; checked: boolean }[] }
  | { type: "steps"; items: { title: string; text: RichText }[] }
  | { type: "table"; caption: string | null; columns: string[]; rows: string[][] }
  | { type: "callout"; tone: CalloutTone; title: string | null; text: RichText }
  | { type: "figure"; src: string; alt: string; caption: string | null; credit: string | null; ratio: string | null }
  | { type: "video"; video: VideoSource; caption: string | null }
  | { type: "keyPoints"; title: string | null; items: RichText[] }
  | { type: "glossary"; items: { term: string; definition: RichText }[] }
  | { type: "divider"; variant: "line" | "short" | "ornament" }
  | { type: "spoiler"; text: RichText };

export type CalloutTone = "note" | "tip" | "warning" | "exercise";

export type ContentBlockType = ContentBlock["type"];

/** Âncora estável para títulos ("Primeiros passos" → "primeiros-passos"). */
export const toAnchor = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "secao";
