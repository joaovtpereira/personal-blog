/**
 * Frontmatter YAML mínimo. Textos saem entre aspas duplas (JSON é YAML válido),
 * então acentos, ":" e "#" não quebram o arquivo. Campos undefined são omitidos.
 */
type Scalar = string | number | boolean | null;

const isScalar = (value: unknown): value is Scalar =>
  value === null || ["string", "number", "boolean"].includes(typeof value);

const scalar = (value: Scalar) => (typeof value === "string" ? JSON.stringify(value) : String(value));

function lines(value: object, indent: string): string[] {
  const out: string[] = [];
  for (const [key, raw] of Object.entries(value)) {
    if (raw === undefined) continue;
    if (isScalar(raw)) {
      out.push(`${indent}${key}: ${scalar(raw)}`);
    } else if (Array.isArray(raw)) {
      if (raw.every(isScalar)) {
        out.push(`${indent}${key}: [${raw.map(scalar).join(", ")}]`);
      } else {
        out.push(`${indent}${key}:`);
        for (const item of raw) {
          const [first, ...rest] = lines(item as object, `${indent}    `);
          out.push(`${indent}  - ${first.trimStart()}`, ...rest);
        }
      }
    } else {
      out.push(`${indent}${key}:`, ...lines(raw as object, `${indent}  `));
    }
  }
  return out;
}

export const toFrontMatter = (data: object) => ["---", ...lines(data, ""), "---"].join("\n");

/* ---------- Leitura ---------- */

function parseScalar(raw: string): unknown {
  const value = raw.trim();
  if (value === "" || value === "~" || value === "null") return null;
  if (value === "true" || value === "false") return value === "true";
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if (value.startsWith('"') || value.startsWith("[") || value.startsWith("{")) {
    try {
      return JSON.parse(value);
    } catch {
      /* não é JSON: segue como texto */
    }
  }
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replace(/''/g, "'");
  return value;
}

type Line = { indent: number; text: string };

function parseMap(lines: Line[], start: number, indent: number): [Record<string, unknown>, number] {
  const out: Record<string, unknown> = {};
  let i = start;
  while (i < lines.length && lines[i].indent === indent && !lines[i].text.startsWith("- ")) {
    const { text } = lines[i];
    const colon = text.indexOf(":");
    if (colon < 0) {
      i++;
      continue;
    }
    const key = text.slice(0, colon).trim();
    const rest = text.slice(colon + 1);
    i++;
    if (rest.trim() !== "") {
      out[key] = parseScalar(rest);
    } else if (i < lines.length && lines[i].indent > indent) {
      [out[key], i] = lines[i].text.startsWith("- ") ? parseList(lines, i, lines[i].indent) : parseMap(lines, i, lines[i].indent);
    } else {
      out[key] = null;
    }
  }
  return [out, i];
}

function parseList(lines: Line[], start: number, indent: number): [unknown[], number] {
  const out: unknown[] = [];
  let i = start;
  while (i < lines.length && lines[i].indent === indent && lines[i].text.startsWith("- ")) {
    const item = lines[i].text.slice(2);
    if (item.includes(":") && !item.trim().startsWith('"')) {
      // item de lista que é um mapa: "- chave: valor" + linhas seguintes mais recuadas
      const nested: Line[] = [{ indent: indent + 2, text: item }];
      i++;
      while (i < lines.length && lines[i].indent > indent) nested.push(lines[i++]);
      out.push(parseMap(nested, 0, indent + 2)[0]);
    } else {
      out.push(parseScalar(item));
      i++;
    }
  }
  return [out, i];
}

/** Separa o frontmatter (entre ---) do corpo. Aceita o YAML que toFrontMatter grava e YAML simples escrito à mão. */
export function splitFrontMatter(text: string): { data: Record<string, unknown>; body: string } {
  const normalized = text.replace(/\r\n?/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { data: {}, body: normalized };
  const lines = match[1]
    .split("\n")
    .filter((line) => line.trim() && !line.trim().startsWith("#"))
    .map((line) => ({ indent: line.length - line.trimStart().length, text: line.trim() }));
  return { data: parseMap(lines, 0, 0)[0], body: normalized.slice(match[0].length) };
}
