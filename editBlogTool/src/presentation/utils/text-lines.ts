/** Conversões entre listas e o texto "uma linha por item" dos campos do inspector. */
export const toLines = (text: string) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export const splitPair = (line: string, separator: string) => {
  const at = line.indexOf(separator);
  return at < 0 ? [line.trim(), ""] : [line.slice(0, at).trim(), line.slice(at + separator.length).trim()];
};

export const LINE_FORMATS = {
  items: {
    parse: (text: string) => toLines(text),
    format: (items: string[]) => items.join("\n"),
  },
  steps: {
    parse: (text: string) => toLines(text).map((line) => splitPair(line, "—")).map(([title, text]) => ({ title, text })),
    format: (items: { title: string; text: string }[]) => items.map((i) => (i.text ? `${i.title} — ${i.text}` : i.title)).join("\n"),
  },
  glossary: {
    parse: (text: string) => toLines(text).map((line) => splitPair(line, ":")).map(([term, definition]) => ({ term, definition })),
    format: (items: { term: string; definition: string }[]) => items.map((i) => `${i.term}: ${i.definition}`).join("\n"),
  },
  table: {
    parse: (text: string) => {
      const [head, ...rows] = toLines(text).map((line) => line.split("|").map((cell) => cell.trim()));
      const columns = head?.length ? head : [""];
      return { columns, rows: rows.map((row) => columns.map((_, i) => row[i] ?? "")) };
    },
    format: ({ columns, rows }: { columns: string[]; rows: string[][] }) => [columns, ...rows].map((r) => r.join(" | ")).join("\n"),
  },
};

export const pad2 = (n: number) => String(n).padStart(2, "0");
