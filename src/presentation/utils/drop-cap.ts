import { plainText, type RichText } from "@/domain/entities";

export interface DropCapSplit {
  /** Capitular desenhada (decorativa). */
  cap: string;
  /** Letra que a capitular "tirou" do texto — lida só por leitores de tela. */
  spoken: string;
  /** Texto que segue a capitular. */
  rest: RichText;
}

const LEADING = /^([«“"'‘(¿¡]*)(\p{L}|\p{N})/u;

/**
 * Separa a capitular do parágrafo.
 * Texto ainda não escrito ("[...]") segue o canvas: capitular "[A]" e o texto inteiro ao lado.
 */
export function splitDropCap(text: RichText): DropCapSplit | null {
  const [first, ...others] = text;
  if (!first || first.type !== "text") return null;

  const plain = plainText(text).trim();
  if (plain.startsWith("[") && plain.endsWith("]")) {
    const letter = plain.slice(1).match(LEADING);
    return letter ? { cap: `[${letter[2]}]`, spoken: "", rest: text } : null;
  }

  const match = first.text.match(LEADING);
  if (!match) return null;
  const cap = match[0];
  return { cap, spoken: cap, rest: [{ ...first, text: first.text.slice(cap.length) }, ...others] };
}
