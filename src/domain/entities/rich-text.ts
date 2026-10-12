/** Texto com formatação inline (negrito, itálico, código, links), independente de markdown/HTML. */
export type TextMark = "bold" | "italic" | "code";

export type InlineNode =
  | { type: "text"; text: string; marks: TextMark[] }
  | { type: "link"; href: string; children: InlineNode[] };

export type RichText = InlineNode[];

export const plainText = (rich: RichText): string =>
  rich.map((node) => (node.type === "text" ? node.text : plainText(node.children))).join("");
