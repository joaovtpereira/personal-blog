import { toAnchor, type CalloutTone, type ContentBlock } from "@/domain/entities";
import type { ContentBlockMapper } from "@/domain/mappers";
import type { ContentBlockModel } from "@/domain/models";
import { parseInline, serializeInline } from "./inline-markdown";
import { toVideoRefModel, toVideoSource } from "./video-source-mapper";

type ModelTone = Extract<ContentBlockModel, { type: "callout" }>["tone"];
type ModelDivider = NonNullable<Extract<ContentBlockModel, { type: "thematic_break" }>["variant"]>;

const TONE: Record<ModelTone, CalloutTone> = { nota: "note", dica: "tip", atencao: "warning", exercicio: "exercise" };
const MODEL_TONE = Object.fromEntries(Object.entries(TONE).map(([k, v]) => [v, k])) as Record<CalloutTone, ModelTone>;

const DIVIDER = { linha: "line", curto: "short", ornamento: "ornament" } as const;
const MODEL_DIVIDER = { line: "linha", short: "curto", ornament: "ornamento" } as const satisfies Record<
  (typeof DIVIDER)[ModelDivider],
  ModelDivider
>;

/** Traduz blocos do markdown (mdast-like) para os blocos do Design System e vice-versa. */
export class ContentBlockModelMapper implements ContentBlockMapper {
  toEntity(model: ContentBlockModel): ContentBlock {
    switch (model.type) {
      case "heading":
        return { type: "heading", level: model.depth, text: model.text, anchor: toAnchor(model.text) };
      case "lead":
        return { type: "lead", text: parseInline(model.text) };
      case "paragraph":
        return { type: "paragraph", text: parseInline(model.text), dropCap: !!model.drop_cap, muted: !!model.muted };
      case "key_idea":
        return { type: "keyIdea", label: model.label ?? null, text: model.text };
      case "blockquote":
        return { type: "quote", text: parseInline(model.text), cite: model.cite ?? null };
      case "reference":
        return { type: "reference", text: model.text };
      case "code":
        return { type: "code", code: model.value, language: model.lang ?? null, filename: model.filename ?? null };
      case "list":
        return { type: "list", ordered: model.ordered, items: model.items.map((item) => parseInline(item)) };
      case "checklist":
        return {
          type: "checklist",
          title: model.title ?? null,
          items: model.items.map((item) => ({ text: parseInline(item.text), checked: item.checked })),
        };
      case "steps":
        return { type: "steps", items: model.items.map((item) => ({ title: item.title, text: parseInline(item.text) })) };
      case "table":
        return { type: "table", caption: model.caption ?? null, columns: [...model.header], rows: model.rows.map((r) => [...r]) };
      case "callout":
        return { type: "callout", tone: TONE[model.tone], title: model.title ?? null, text: parseInline(model.text) };
      case "image":
        return {
          type: "figure",
          src: model.src,
          alt: model.alt,
          caption: model.caption ?? null,
          credit: model.credit ?? null,
          ratio: model.ratio ?? null,
        };
      case "video":
        return { type: "video", video: toVideoSource(model.video), caption: model.caption ?? null };
      case "key_points":
        return { type: "keyPoints", title: model.title ?? null, items: model.items.map((item) => parseInline(item)) };
      case "glossary":
        return {
          type: "glossary",
          items: model.items.map((item) => ({ term: item.term, definition: parseInline(item.definition) })),
        };
      case "thematic_break":
        return { type: "divider", variant: DIVIDER[model.variant ?? "linha"] };
      case "spoiler":
        return { type: "spoiler", text: parseInline(model.text) };
    }
  }

  toModel(entity: ContentBlock): ContentBlockModel {
    switch (entity.type) {
      case "heading":
        return { type: "heading", depth: entity.level, text: entity.text };
      case "lead":
        return { type: "lead", text: serializeInline(entity.text) };
      case "paragraph":
        return { type: "paragraph", text: serializeInline(entity.text), drop_cap: entity.dropCap, muted: entity.muted };
      case "keyIdea":
        return { type: "key_idea", label: entity.label, text: entity.text };
      case "quote":
        return { type: "blockquote", text: serializeInline(entity.text), cite: entity.cite };
      case "reference":
        return { type: "reference", text: entity.text };
      case "code":
        return { type: "code", value: entity.code, lang: entity.language, filename: entity.filename };
      case "list":
        return { type: "list", ordered: entity.ordered, items: entity.items.map(serializeInline) };
      case "checklist":
        return {
          type: "checklist",
          title: entity.title,
          items: entity.items.map((item) => ({ text: serializeInline(item.text), checked: item.checked })),
        };
      case "steps":
        return { type: "steps", items: entity.items.map((item) => ({ title: item.title, text: serializeInline(item.text) })) };
      case "table":
        return { type: "table", caption: entity.caption, header: [...entity.columns], rows: entity.rows.map((r) => [...r]) };
      case "callout":
        return { type: "callout", tone: MODEL_TONE[entity.tone], title: entity.title, text: serializeInline(entity.text) };
      case "figure":
        return { type: "image", src: entity.src, alt: entity.alt, caption: entity.caption, credit: entity.credit, ratio: entity.ratio };
      case "video":
        return { type: "video", video: toVideoRefModel(entity.video), caption: entity.caption };
      case "keyPoints":
        return { type: "key_points", title: entity.title, items: entity.items.map(serializeInline) };
      case "glossary":
        return {
          type: "glossary",
          items: entity.items.map((item) => ({ term: item.term, definition: serializeInline(item.definition) })),
        };
      case "divider":
        return { type: "thematic_break", variant: MODEL_DIVIDER[entity.variant] };
      case "spoiler":
        return { type: "spoiler", text: serializeInline(entity.text) };
    }
  }
}
