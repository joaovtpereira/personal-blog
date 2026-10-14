import type { DocumentBlockModel, ParsedDocumentModel } from "@editor/domain/models";
import type { MarkdownParser } from "@editor/shared/markdown";
import { splitFrontMatter } from "./yaml-front-matter";

/**
 * Lê o formato gravado pelo DirectiveMarkdownSerializer: CommonMark + tabelas GFM + diretivas
 * (`:::nome{attrs}` ... `:::` e `::nome[rótulo]{attrs}`). O que não reconhece vira bloco "raw",
 * que é gravado de volta sem mudanças.
 */
type Attrs = Record<string, string | true>;

const SLOTS = ["title", "lead", "author", "studio-platform", "cover", "capture", "fact-sheet", "in-practice", "verdict", "video"];
const TONES = ["nota", "dica", "atencao", "exercicio"] as const;
const DIVIDERS = ["linha", "curto", "ornamento"] as const;

function parseAttrs(source: string | undefined): Attrs {
  const attrs: Attrs = {};
  if (!source) return attrs;
  for (const [, key, quoted, bare] of source.matchAll(/([\w-]+)(?:=(?:"((?:[^"\\]|\\.)*)"|([^\s}]+)))?/g)) {
    attrs[key] = quoted !== undefined ? JSON.parse(`"${quoted}"`) : (bare ?? true);
  }
  return attrs;
}

const str = (value: string | true | undefined) => (typeof value === "string" ? value : null);

const bulletItems = (lines: string[]) => lines.filter((l) => /^\s*[-*]\s+/.test(l)).map((l) => l.replace(/^\s*[-*]\s+/, ""));

const orderedItems = (lines: string[]) => lines.filter((l) => /^\s*\d+\.\s+/.test(l)).map((l) => l.replace(/^\s*\d+\.\s+/, ""));

const IMAGE = /^!\[([^\]]*)\]\((\S+?)(?:\s+"[^"]*")?\)$/;

function parseTable(lines: string[], caption: string | null): DocumentBlockModel | null {
  const rows = lines.filter((l) => l.trim().startsWith("|")).map((l) =>
    l
      .trim()
      .replace(/^\||\|$/g, "")
      .split(/(?<!\\)\|/)
      .map((cell) => cell.trim().replace(/\\\|/g, "|")),
  );
  if (rows.length < 2 || !rows[1].every((cell) => /^:?-{3,}:?$/.test(cell))) return null;
  return { type: "table", caption, header: rows[0], rows: rows.slice(2) };
}

function container(name: string, attrs: Attrs, body: string[]): DocumentBlockModel | null {
  const text = body.join("\n").trim();
  switch (name) {
    case "lead":
      return { type: "lead", text };
    case "drop-cap":
      return { type: "paragraph", text, drop_cap: true };
    case "muted":
      return { type: "paragraph", text, muted: true };
    case "key-idea":
      return { type: "key_idea", label: str(attrs.label), text };
    case "reference":
      return { type: "reference", text };
    case "spoiler":
      return { type: "spoiler", text };
    case "callout": {
      const tone = TONES.find((t) => t === attrs.tone) ?? "nota";
      return { type: "callout", tone, title: str(attrs.title), text };
    }
    case "checklist":
      return {
        type: "checklist",
        title: str(attrs.title),
        items: bulletItems(body).map((item) => {
          const [, mark, rest] = item.match(/^\[([ xX])\]\s*(.*)$/) ?? [null, " ", item];
          return { text: rest, checked: mark.toLowerCase() === "x" };
        }),
      };
    case "steps":
      return {
        type: "steps",
        items: orderedItems(body).map((item) => {
          const [, title, rest] = item.match(/^\*\*(.+?)\*\*\s*(?:—\s*(.*))?$/) ?? [null, item, ""];
          return { title, text: rest ?? "" };
        }),
      };
    case "key-points":
      return { type: "key_points", title: str(attrs.title), items: bulletItems(body) };
    case "glossary":
      return {
        type: "glossary",
        items: bulletItems(body).map((item) => {
          const [, term, definition] = item.match(/^\*\*(.+?)\*\*:\s*(.*)$/) ?? [null, item, ""];
          return { term, definition };
        }),
      };
    case "table":
      return parseTable(body, str(attrs.caption));
    case "figure": {
      const [first = "", ...rest] = body.filter((l) => l.trim());
      const image = first.trim().match(IMAGE);
      if (!image) return null;
      return {
        type: "image",
        alt: image[1],
        src: decodeURI(image[2]),
        caption: rest.join(" ").trim() || null,
        credit: str(attrs.credit),
        ratio: str(attrs.ratio),
      };
    }
    default:
      return null;
  }
}

function leaf(name: string, label: string | undefined, attrs: Attrs): DocumentBlockModel | null {
  if (name === "video" && typeof attrs.ref === "string") {
    const provider = attrs.provider === "youtube" || attrs.provider === "vimeo" ? attrs.provider : "arquivo";
    const duration = Number(attrs.duration);
    return {
      type: "video",
      video: { provider, ref: attrs.ref, duration_seconds: Number.isFinite(duration) && attrs.duration ? duration : null, poster: str(attrs.poster) },
      caption: label ?? null,
    };
  }
  if (name === "divider") return { type: "thematic_break", variant: DIVIDERS.find((d) => d === attrs.variant) ?? "linha" };
  if (SLOTS.includes(name) && Object.keys(attrs).length === 0 && !label) return { type: "slot", slot: name };
  return null;
}

function parseFence(info: string, code: string): DocumentBlockModel {
  const [lang = ""] = info.trim().split(/\s+/);
  const title = info.match(/title="((?:[^"\\]|\\.)*)"/);
  return {
    type: "code",
    value: code,
    lang: lang && !lang.includes("=") ? lang : null,
    filename: title ? JSON.parse(`"${title[1]}"`) : null,
    line_numbers: /\bshowLineNumbers\b/.test(info),
  };
}

const isBlank = (line: string) => line.trim() === "";
const startsBlock = (line: string) => /^(```|~~~|:::|::\w|#{1,6}\s|>|\s*[-*]\s|\s*\d+\.\s|\||---\s*$|!\[)/.test(line);

export class DirectiveMarkdownParser implements MarkdownParser {
  parse(text: string): ParsedDocumentModel {
    const { data, body } = splitFrontMatter(text);
    const lines = body.split("\n");
    const blocks: DocumentBlockModel[] = [];
    let i = 0;

    const take = (until: (line: string) => boolean) => {
      const out: string[] = [];
      while (i < lines.length && !until(lines[i])) out.push(lines[i++]);
      return out;
    };

    while (i < lines.length) {
      const line = lines[i];
      if (isBlank(line)) {
        i++;
        continue;
      }
      const start = i;
      const raw = () => ({ type: "raw" as const, markdown: lines.slice(start, i).join("\n").trimEnd() });

      const fence = line.match(/^(`{3,}|~{3,})(.*)$/);
      if (fence) {
        i++;
        const code = take((l) => l.startsWith(fence[1]) && l.trim() === fence[1]);
        i++;
        blocks.push(parseFence(fence[2], code.join("\n")));
        continue;
      }

      const open = line.match(/^:::([\w-]+)(?:\{(.*)\})?\s*$/);
      if (open) {
        i++;
        const inner = take((l) => l.trim() === ":::");
        i++;
        blocks.push(container(open[1], parseAttrs(open[2]), inner) ?? raw());
        continue;
      }

      const directive = line.match(/^::([\w-]+)(?:\[([^\]]*)\])?(?:\{(.*)\})?\s*$/);
      if (directive) {
        i++;
        blocks.push(leaf(directive[1], directive[2], parseAttrs(directive[3])) ?? raw());
        continue;
      }

      const heading = line.match(/^(#{1,6})\s+(.*)$/);
      if (heading) {
        i++;
        const depth = Math.min(4, Math.max(2, heading[1].length)) as 2 | 3 | 4;
        blocks.push({ type: "heading", depth, text: heading[2].trim() });
        continue;
      }

      if (/^---\s*$/.test(line)) {
        i++;
        blocks.push({ type: "thematic_break", variant: "linha" });
        continue;
      }

      if (line.startsWith(">")) {
        const quote = take((l) => !l.startsWith(">")).map((l) => l.replace(/^>\s?/, ""));
        const citeAt = quote.findLastIndex((l) => l.startsWith("— "));
        const cite = citeAt >= 0 ? quote[citeAt].slice(2).trim() : null;
        const textLines = (citeAt >= 0 ? quote.slice(0, citeAt) : quote).join("\n").trim();
        blocks.push({ type: "blockquote", text: textLines, cite });
        continue;
      }

      if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
        const ordered = /^\s*\d+\./.test(line);
        const items = take((l) => isBlank(l) || !/^\s*([-*]|\d+\.)\s+/.test(l));
        blocks.push({ type: "list", ordered, items: ordered ? orderedItems(items) : bulletItems(items) });
        continue;
      }

      if (line.trim().startsWith("|")) {
        take((l) => !l.trim().startsWith("|"));
        blocks.push(parseTable(lines.slice(start, i), null) ?? raw());
        continue;
      }

      const image = line.trim().match(IMAGE);
      if (image) {
        i++;
        blocks.push({ type: "image", alt: image[1], src: decodeURI(image[2]), caption: null, credit: null, ratio: null });
        continue;
      }

      i++;
      const paragraph = [line, ...take((l) => isBlank(l) || startsBlock(l))];
      blocks.push({ type: "paragraph", text: paragraph.join("\n").trim() });
    }

    return { frontmatter: data, blocks };
  }
}
