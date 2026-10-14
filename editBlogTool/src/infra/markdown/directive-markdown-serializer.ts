import type { DocumentBlockModel, MarkdownDocumentModel } from "@editor/domain/models";
import type { MarkdownSerializer } from "@editor/shared/markdown";
import { toFrontMatter } from "./yaml-front-matter";

/**
 * Markdown (CommonMark + tabelas GFM) com diretivas no padrão remark-directive para os blocos
 * que o markdown puro não tem: `:::callout{tone="dica"}` ... `:::` e `::verdict` (bloco fixo).
 */
type Attributes = Record<string, string | number | boolean | null | undefined>;

function attributes(attrs: Attributes): string {
  const parts = Object.entries(attrs)
    .filter(([, v]) => v !== null && v !== undefined && v !== "" && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}=${JSON.stringify(String(v))}`));
  return parts.length ? `{${parts.join(" ")}}` : "";
}

const container = (name: string, body: string, attrs: Attributes = {}) => `:::${name}${attributes(attrs)}\n${body}\n:::`;

const bullets = (items: string[]) => items.map((item) => `- ${item}`).join("\n");

const cell = (text: string) => text.replace(/\|/g, "\\|").replace(/\n/g, " ");

function fence(code: string, info: string) {
  const longest = Math.max(2, ...(code.match(/`+/g) ?? []).map((m) => m.length));
  const ticks = "`".repeat(longest + 1);
  return `${ticks}${info}\n${code}\n${ticks}`;
}

function block(model: DocumentBlockModel): string {
  switch (model.type) {
    case "slot":
      return `::${model.slot}`;
    case "raw":
      return model.markdown;
    case "heading":
      return `${"#".repeat(model.depth)} ${model.text}`;
    case "lead":
      return container("lead", model.text);
    case "paragraph":
      if (model.drop_cap) return container("drop-cap", model.text);
      if (model.muted) return container("muted", model.text);
      return model.text;
    case "key_idea":
      return container("key-idea", model.text, { label: model.label });
    case "blockquote": {
      const quote = model.text.split("\n").map((line) => `> ${line}`);
      if (model.cite) quote.push(">", `> — ${model.cite}`);
      return quote.join("\n");
    }
    case "reference":
      return container("reference", model.text);
    case "code": {
      const info = [model.lang ?? "", model.filename ? `title=${JSON.stringify(model.filename)}` : "", "line_numbers" in model && model.line_numbers ? "showLineNumbers" : ""]
        .filter(Boolean)
        .join(" ");
      return fence(model.value, info);
    }
    case "list":
      return model.items.map((item, i) => (model.ordered ? `${i + 1}. ${item}` : `- ${item}`)).join("\n");
    case "checklist":
      return container("checklist", model.items.map((item) => `- [${item.checked ? "x" : " "}] ${item.text}`).join("\n"), {
        title: model.title,
      });
    case "steps":
      return container("steps", model.items.map((item, i) => `${i + 1}. **${item.title}** — ${item.text}`).join("\n"));
    case "table": {
      const row = (cells: string[]) => `| ${cells.map(cell).join(" | ")} |`;
      const table = [row(model.header), row(model.header.map(() => "---")), ...model.rows.map(row)].join("\n");
      return model.caption ? container("table", table, { caption: model.caption }) : table;
    }
    case "callout":
      return container("callout", model.text, { tone: model.tone, title: model.title });
    case "image": {
      const image = `![${model.alt.replace(/[[\]]/g, "")}](${model.src.replace(/ /g, "%20")})`;
      if (!model.caption && !model.credit && !model.ratio) return image;
      return container("figure", model.caption ? `${image}\n${model.caption}` : image, { credit: model.credit, ratio: model.ratio });
    }
    case "video":
      return `::video${model.caption ? `[${model.caption}]` : ""}${attributes({
        provider: model.video.provider,
        ref: model.video.ref,
        duration: model.video.duration_seconds,
        poster: model.video.poster,
      })}`;
    case "key_points":
      return container("key-points", bullets(model.items), { title: model.title });
    case "glossary":
      return container("glossary", model.items.map((item) => `- **${item.term}**: ${item.definition}`).join("\n"));
    case "thematic_break":
      return !model.variant || model.variant === "linha" ? "---" : `::divider${attributes({ variant: model.variant })}`;
    case "spoiler":
      return container("spoiler", model.text);
  }
}

export class DirectiveMarkdownSerializer implements MarkdownSerializer {
  serialize(document: MarkdownDocumentModel): string {
    return `${toFrontMatter(document.frontmatter)}\n\n${document.blocks.map(block).join("\n\n")}\n`;
  }
}
