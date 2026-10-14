import type { BlockSlot, CalloutTone, DividerVariant, EditorBlock, FigureRatio, IdFactory } from "@editor/domain/entities";
import { formatDurationText, parseDuration, videoProviderOf, videoUrlOf } from "@editor/domain/entities";
import type { EditorBlockMapper, ImageReader, ImageUrlResolver } from "@editor/domain/mappers";
import type { DocumentBlockModel } from "@editor/domain/models";

type ModelTone = "nota" | "dica" | "atencao" | "exercicio";
type ModelDivider = "linha" | "curto" | "ornamento";

const TONE: Record<CalloutTone, ModelTone> = { note: "nota", tip: "dica", warning: "atencao", exercise: "exercicio" };
const DIVIDER: Record<DividerVariant, ModelDivider> = { line: "linha", short: "curto", ornament: "ornamento" };
const SLOT: Record<BlockSlot, string> = {
  title: "title",
  lead: "lead",
  author: "author",
  studioPlatform: "studio-platform",
  cover: "cover",
  capture: "capture",
  factSheet: "fact-sheet",
  inPractice: "in-practice",
  verdict: "verdict",
  video: "video",
};

const invert = <K extends string, V extends string>(record: Record<K, V>) =>
  Object.fromEntries(Object.entries(record).map(([k, v]) => [v, k])) as Record<V, K>;

const MODEL_TONE = invert(TONE);
const MODEL_DIVIDER = invert(DIVIDER);
const MODEL_SLOT = invert(SLOT);
const RATIOS: FigureRatio[] = ["16 / 9", "2 / 3", "1 / 1"];
const ACCENT = /^(.*?)\s*\*([^*]+)\*$/;

const orNull = (text: string) => (text.trim() ? text.trim() : null);

/** "exemplo.ts" → arquivo + linguagem "ts"; "python" → só linguagem. */
function codeTarget(label: string) {
  const value = label.trim();
  if (!value) return { lang: null, filename: null };
  const dot = value.lastIndexOf(".");
  return dot > 0 ? { lang: value.slice(dot + 1), filename: value } : { lang: value, filename: null };
}


export class EditorBlockModelMapper implements EditorBlockMapper {
  constructor(private readonly newId: IdFactory) {}

  toModel(block: EditorBlock, resolveImage: ImageUrlResolver = (image) => image.previewUrl): DocumentBlockModel {
    switch (block.type) {
      case "bound":
        return { type: "slot", slot: SLOT[block.slot] };
      case "heading":
        return { type: "heading", depth: block.level, text: block.accent.trim() ? `${block.text} *${block.accent.trim()}*` : block.text };
      case "paragraph":
        return { type: "paragraph", text: block.text, drop_cap: block.dropCap };
      case "quote":
        return { type: "blockquote", text: block.text, cite: orNull(block.cite) };
      case "list":
        return { type: "list", ordered: block.ordered, items: [...block.items] };
      case "checklist":
        return { type: "checklist", title: orNull(block.title), items: block.items.map((text) => ({ text, checked: false })) };
      case "figure":
        return {
          type: "image",
          src: block.image ? resolveImage(block.image) : "",
          alt: block.alt.trim() || block.caption,
          caption: orNull(block.caption),
          credit: orNull(block.credit),
          ratio: block.ratio,
        };
      case "video": {
        const provider = videoProviderOf(block.url);
        return {
          type: "video",
          video: { provider: provider === "file" ? "arquivo" : provider, ref: block.url.trim(), duration_seconds: parseDuration(block.duration) },
          caption: null,
        };
      }
      case "divider":
        return { type: "thematic_break", variant: DIVIDER[block.variant] };
      case "steps":
        return { type: "steps", items: block.items.map((item) => ({ ...item })) };
      case "table":
        return { type: "table", caption: orNull(block.caption), header: [...block.columns], rows: block.rows.map((row) => [...row]) };
      case "code":
        return { type: "code", value: block.code, ...codeTarget(block.filename), line_numbers: block.lineNumbers };
      case "callout":
        return { type: "callout", tone: TONE[block.tone], title: orNull(block.title), text: block.text };
      case "spoiler":
        return { type: "spoiler", text: block.text };
      case "keyPoints":
        return { type: "key_points", title: null, items: [...block.items] };
      case "glossary":
        return { type: "glossary", items: block.items.map((item) => ({ ...item })) };
      case "raw":
        return { type: "raw", markdown: block.markdown };
    }
  }

  toEntity(model: DocumentBlockModel, readImage?: ImageReader): EditorBlock {
    const id = this.newId();
    switch (model.type) {
      case "slot":
        return { id, type: "bound", slot: MODEL_SLOT[model.slot] ?? "title" };
      case "heading": {
        const [, text, accent] = model.text.match(ACCENT) ?? [null, model.text, ""];
        return { id, type: "heading", level: model.depth, text, accent };
      }
      case "lead":
      case "reference":
        return { id, type: "paragraph", text: model.text, dropCap: false };
      case "paragraph":
        return { id, type: "paragraph", text: model.text, dropCap: !!model.drop_cap };
      case "key_idea":
        return { id, type: "quote", text: model.text, cite: model.label ?? "" };
      case "blockquote":
        return { id, type: "quote", text: model.text, cite: model.cite ?? "" };
      case "list":
        return { id, type: "list", ordered: model.ordered, items: [...model.items] };
      case "checklist":
        return { id, type: "checklist", title: model.title ?? "", items: model.items.map((item) => item.text) };
      case "image":
        return {
          id,
          type: "figure",
          image: !model.src ? null : readImage ? readImage(model.src) : { sourcePath: model.src, fileName: model.src.split("/").pop() ?? model.src, previewUrl: model.src, publicUrl: model.src },
          alt: model.alt,
          caption: model.caption ?? "",
          credit: model.credit ?? "",
          ratio: RATIOS.find((r) => r === model.ratio) ?? "16 / 9",
        };
      case "video":
        return { id, type: "video", url: videoUrlOf(model.video.provider, model.video.ref), duration: formatDurationText(model.video.duration_seconds) };
      case "thematic_break":
        return { id, type: "divider", variant: MODEL_DIVIDER[model.variant ?? "linha"] };
      case "steps":
        return { id, type: "steps", items: model.items.map((item) => ({ ...item })) };
      case "table":
        return { id, type: "table", caption: model.caption ?? "", columns: [...model.header], rows: model.rows.map((row) => [...row]) };
      case "code":
        return { id, type: "code", filename: model.filename ?? model.lang ?? "", code: model.value, lineNumbers: "line_numbers" in model ? !!model.line_numbers : false };
      case "callout":
        return { id, type: "callout", tone: MODEL_TONE[model.tone], title: model.title ?? "", text: model.text };
      case "spoiler":
        return { id, type: "spoiler", text: model.text };
      case "key_points":
        return { id, type: "keyPoints", items: [...model.items] };
      case "glossary":
        return { id, type: "glossary", items: model.items.map((item) => ({ ...item })) };
      case "raw":
        return { id, type: "raw", markdown: model.markdown };
    }
  }
}
