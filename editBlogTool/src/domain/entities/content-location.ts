import { CONTENT_PATH, contentFileInfo } from "@/domain/entities/content-path";
import type { DraftKind, PostKind } from "./draft";
import type { ContentLocale } from "./draft-options";

/** "Primeiros passos!" → "primeiros-passos" */
export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/* Onde cada arquivo fica em content/ é regra do blog (que lê os arquivos): uma só definição. */

/** Tipo do conteúdo pela pasta; null = fora do padrão (ou o _study.md, que não abre no editor). */
export function kindOfPath(path: string): DraftKind | null {
  const info = contentFileInfo(path);
  return !info || info.kind === "study" ? null : info.kind;
}

/** Idioma pelo nome do arquivo ("a.es.md" → "es"); null = sem sufixo (o campo locale decide). */
export const localeOfPath = (path: string): ContentLocale | null => contentFileInfo(path)?.locale ?? null;

/** Pasta do arquivo ("content/post/study/estudo-1/01-a.md" → "content/post/study/estudo-1/"). */
export const folderOf = (path: string) => path.slice(0, path.lastIndexOf("/") + 1);

export const fileNameOf = (path: string) => path.slice(path.lastIndexOf("/") + 1);

/** Slug pelo nome do arquivo, sem a ordem da aula nem o sufixo de idioma ("01-introducao.es.md" → "introducao"). */
export const slugOfFile = (path: string) => {
  const info = contentFileInfo(path);
  return info && info.kind !== "study" ? info.slug : fileNameOf(path).replace(/\.md$/, "");
};

/** Português grava <slug>.md; os outros idiomas, <slug>.<idioma>.md ao lado (mesmo slug). */
export const CONTENT_LOCATION = {
  post: (kind: PostKind, slug: string, locale: ContentLocale) => CONTENT_PATH.post(kind, slug, locale),
  lesson: (studySlug: string, order: number, lessonSlug: string, locale: ContentLocale) =>
    CONTENT_PATH.lesson(studySlug, order, lessonSlug, locale),
  /** caminho no disco (relativo à raiz do blog) e URL pública da imagem */
  image: (folder: string, fileName: string) => ({
    file: `public/images/${folder}/${fileName}`,
    url: `/images/${folder}/${fileName}`,
  }),
};
