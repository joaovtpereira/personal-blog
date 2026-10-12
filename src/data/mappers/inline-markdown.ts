import type { InlineNode, RichText, TextMark } from "@/domain/entities";

/**
 * Markdown inline mínimo → RichText: `código`, **negrito**, *itálico* e [texto](url).
 * O parser completo de markdown entra na integração; aqui fica só o que os blocos usam.
 */
const TOKEN = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)\s]+\))/g;

export function parseInline(source: string, marks: TextMark[] = []): RichText {
  const nodes: InlineNode[] = [];
  let last = 0;
  for (const match of source.matchAll(TOKEN)) {
    const [token] = match;
    const start = match.index ?? 0;
    if (start > last) nodes.push({ type: "text", text: source.slice(last, start), marks: [...marks] });

    if (token.startsWith("`")) {
      nodes.push({ type: "text", text: token.slice(1, -1), marks: [...marks, "code"] });
    } else if (token.startsWith("**")) {
      nodes.push(...parseInline(token.slice(2, -2), [...marks, "bold"]));
    } else if (token.startsWith("*")) {
      nodes.push(...parseInline(token.slice(1, -1), [...marks, "italic"]));
    } else {
      const [, label, href] = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/) ?? [];
      nodes.push({ type: "link", href, children: parseInline(label, marks) });
    }
    last = start + token.length;
  }
  if (last < source.length) nodes.push({ type: "text", text: source.slice(last), marks: [...marks] });
  return nodes;
}

export function serializeInline(rich: RichText): string {
  return rich
    .map((node) => {
      if (node.type === "link") return `[${serializeInline(node.children)}](${node.href})`;
      let text = node.text;
      if (node.marks.includes("code")) text = `\`${text}\``;
      if (node.marks.includes("italic")) text = `*${text}*`;
      if (node.marks.includes("bold")) text = `**${text}**`;
      return text;
    })
    .join("");
}
