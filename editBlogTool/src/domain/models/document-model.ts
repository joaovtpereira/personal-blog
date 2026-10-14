import type { ContentBlockModel, LessonModel, PostContentModel, PostModel } from "@/domain/models";

/**
 * Formatos que o editor grava no repositório do blog. Reaproveitam os models do blog
 * (PostModel, PostContentModel, LessonModel, ContentBlockModel) para o parser futuro do blog
 * ler o mesmo formato.
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

export type PostFrontmatterModel = Omit<PostModel, "featured" | "excerpt"> & {
  excerpt: string;
  lead?: PostContentModel["lead"];
  book?: Omit<NonNullable<PostContentModel["book"]>, "pros" | "cons"> | null;
  game?: Omit<NonNullable<PostContentModel["game"]>, "pros" | "cons" | "completed"> | null;
  collection?: CollectionLinkModel | null;
};

export type LessonFrontmatterModel = Omit<LessonModel, "blocks" | "materials" | "summary"> & {
  study: { id: string | null; slug: string; title: string };
  tags: string[];
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
