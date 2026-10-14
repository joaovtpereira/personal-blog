import messages from "@/assets/translations/pt.json";

/**
 * Adaptador de `next-intl` para os componentes do blog rodarem no Electron.
 * O editor é só em português: usa as mesmas traduções pt do blog.
 * Suporta {nome}, {n, plural, one {...} other {...}} e {x, select, a {...} other {...}}.
 */
type Values = Record<string, string | number | boolean | null | undefined>;
type Messages = { [key: string]: string | string[] | Messages };

function lookup(path: string): string | null {
  const value = path.split(".").reduce<Messages[string] | undefined>(
    (node, key) => (node && typeof node === "object" && !Array.isArray(node) ? node[key] : undefined),
    messages as Messages,
  );
  return typeof value === "string" ? value : null;
}

/** Índice do "}" que fecha o "{" em `start`. */
function closing(text: string, start: number): number {
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") depth++;
    if (text[i] === "}" && --depth === 0) return i;
  }
  return text.length - 1;
}

function options(source: string): Record<string, string> {
  const result: Record<string, string> = {};
  let i = 0;
  while (i < source.length) {
    const open = source.indexOf("{", i);
    if (open < 0) break;
    const key = source.slice(i, open).trim();
    const end = closing(source, open);
    result[key] = source.slice(open + 1, end);
    i = end + 1;
  }
  return result;
}

function argument(body: string, values: Values): string {
  const [name, type, ...rest] = body.split(",");
  const key = name.trim();
  const value = values[key];
  if (!type) return value === undefined || value === null ? `{${key}}` : String(value);

  const choices = options(rest.join(","));
  if (type.trim() === "plural") {
    const n = Number(value);
    const message = choices[`=${n}`] ?? (n === 1 ? choices.one : undefined) ?? choices.other ?? "";
    return format(message.replace(/#/g, String(n)), values);
  }
  return format(choices[String(value)] ?? choices.other ?? "", values);
}

function format(message: string, values: Values): string {
  let out = "";
  for (let i = 0; i < message.length; i++) {
    if (message[i] !== "{") {
      out += message[i];
      continue;
    }
    const end = closing(message, i);
    out += argument(message.slice(i + 1, end), values);
    i = end;
  }
  return out;
}

export function useTranslations(namespace?: string) {
  const t = (key: string, values: Values = {}) => {
    const path = namespace ? `${namespace}.${key}` : key;
    const message = lookup(path);
    return message === null ? path : format(message, values);
  };
  t.has = (key: string) => lookup(namespace ? `${namespace}.${key}` : key) !== null;
  return t;
}

export const useLocale = () => "pt";
