import type { EditorCatalog, EditorWorkspace, ImageRef, LessonDraft, PostKind, Publication, StudyMetaDraft, StudyOption } from "../entities";
import type { LessonFrontmatterModel, MarkdownDocumentModel, ParsedDocumentModel, PostFrontmatterModel, StudyFrontmatterModel } from "../models";
import type { ImageUrlResolver } from "./editor-block-mapper";

/** Documento .md ⇄ rascunho. Na leitura o frontmatter chega sem validação (ParsedDocumentModel). */
export interface DocumentMapper<TEntity, TModel, TOpened> {
  toModel(entity: TEntity): TModel;
  toEntity(model: ParsedDocumentModel, context: DocumentReadContext): TOpened;
}

export type DocumentReadContext = {
  /** caminho relativo do arquivo lido */
  path: string;
  /** URL de imagem do arquivo ("/images/x.png") → imagem exibível no editor */
  resolveImage: (url: string) => ImageRef;
};

export type PostDocumentInput = {
  kind: PostKind;
  workspace: EditorWorkspace;
  catalog: EditorCatalog;
  slug: string;
  publishedAt: string;
  resolveImage: ImageUrlResolver;
};

export type LessonDocumentInput = {
  lesson: LessonDraft;
  order: number;
  slug: string;
  study: StudyRef;
  workspace: EditorWorkspace;
  resolveImage: ImageUrlResolver;
};

export type StudyRef = Pick<StudyOption, "slug" | "title"> & { id: string | null };

export type OpenedPost = { kind: PostKind; draft: EditorWorkspace[PostKind]; publication: Partial<Publication> };
export type OpenedLesson = { lesson: LessonDraft; study: StudyRef; publication: Partial<Publication> };

export type PostDocumentMapper = DocumentMapper<PostDocumentInput, MarkdownDocumentModel<PostFrontmatterModel>, OpenedPost>;
export type LessonDocumentMapper = DocumentMapper<LessonDocumentInput, MarkdownDocumentModel<LessonFrontmatterModel>, OpenedLesson>;

export type StudyDocumentInput = {
  study: StudyRef;
  meta: StudyMetaDraft;
  workspace: EditorWorkspace;
  /** ordem usada quando o campo está vazio (estudo novo vai para o fim da lista) */
  fallbackOrder: number;
};

/** _study.md ⇄ dados do estudo. */
export type StudyDocumentMapper = DocumentMapper<StudyDocumentInput, MarkdownDocumentModel<StudyFrontmatterModel>, StudyMetaDraft>;
