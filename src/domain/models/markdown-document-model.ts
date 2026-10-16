import type { CollectionModel } from "./collection-model";
import type { ContentBlockModel } from "./content-block-model";
import type { LessonModel } from "./lesson-model";
import type { PostContentModel } from "./post-content-model";
import type { PostModel } from "./post-model";
import type { StudyModel } from "./study-model";

/**
 * Arquivos .md em content/ (gravados pelo editor em editBlogTool ou à mão): frontmatter YAML +
 * corpo em CommonMark/GFM com diretivas (`:::callout{tone="dica"}`, `::video{...}`, `::verdict`).
 * Formato externo: não usar na apresentação.
 */

/** Marcação de posição de um bloco fixo (::cover, ::verdict...). O conteúdo vem do frontmatter. */
export type SlotBlockModel = { type: "slot"; slot: string };

export type CodeBlockModel = Extract<ContentBlockModel, { type: "code" }> & { line_numbers?: boolean };

/** Trecho que o leitor não reconhece: gravado de volta exatamente como estava. */
export type RawBlockModel = { type: "raw"; markdown: string };

export type DocumentBlockModel = Exclude<ContentBlockModel, { type: "code" }> | CodeBlockModel | SlotBlockModel | RawBlockModel;

export type CollectionLinkModel = {
  /** join = entra numa coleção existente · create = cria a coleção */
  action: "join" | "create";
  id: string | null;
  slug: string;
  name: string;
  /** posição deste item na coleção (1-based) */
  position: number;
  /** ao criar a série a partir de uma resenha anterior, ela vira a parte 1 */
  previous_ref_id?: string | null;
};

type BookFrontmatter = Omit<NonNullable<PostContentModel["book"]>, "pros" | "cons"> & { pros?: string[]; cons?: string[] };

type GameFrontmatter = Omit<NonNullable<PostContentModel["game"]>, "pros" | "cons" | "completed"> & {
  pros?: string[];
  cons?: string[];
  /** jogo zerado (selo ✓ ZERADO) */
  completed?: boolean;
};

export type PostFrontmatterModel = Omit<PostModel, "excerpt"> & {
  excerpt: string;
  lead?: PostContentModel["lead"];
  book?: BookFrontmatter | null;
  game?: GameFrontmatter | null;
  collection?: CollectionLinkModel | null;
};

export type LessonFrontmatterModel = Omit<LessonModel, "blocks"> & {
  study: { id: string | null; slug: string; title: string };
  tags: string[];
};

/** content/post/study/<estudo>/_study.md — dados do estudo que não cabem nas aulas. */
export type StudyFrontmatterModel = {
  id: string;
  slug: string;
  locale: string;
  title: string;
  description: string;
  tags: string[];
  /** ordem na listagem de estudos (1 = primeiro) */
  order: number;
};

export type MarkdownDocumentModel<TFrontmatter extends object = object> = {
  /** caminho relativo à raiz do blog */
  path: string;
  frontmatter: TFrontmatter;
  blocks: DocumentBlockModel[];
};

/** Arquivo lido do disco: frontmatter ainda sem validação + blocos. */
export type ParsedDocumentModel = {
  frontmatter: Record<string, unknown>;
  blocks: DocumentBlockModel[];
};

/** Tudo que os .md de content/ descrevem, já no formato dos models do blog. */
export type ContentCatalogModel = {
  posts: PostModel[];
  postContents: PostContentModel[];
  lessons: LessonModel[];
  studies: StudyModel[];
  collections: CollectionModel[];
};
