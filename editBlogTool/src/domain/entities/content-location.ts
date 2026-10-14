import type { DraftKind, PostKind } from "./draft";

/** "Primeiros passos!" → "primeiros-passos" */
export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Pastas do repositório do blog onde os arquivos exportados ficam. */
const POST_FOLDER: Record<PostKind, string> = {
  thought: "thoughts",
  book: "review-book",
  game: "review-game",
};

/** Tipo do conteúdo pela pasta onde o arquivo está; null = fora do padrão. */
export function kindOfPath(path: string): DraftKind | null {
  if (path.startsWith("content/post/study/")) return "lesson";
  const folder = path.split("/")[3];
  const kind = (Object.keys(POST_FOLDER) as PostKind[]).find((k) => POST_FOLDER[k] === folder);
  return path.startsWith("content/post/blog/") && kind ? kind : null;
}

/** Pasta do arquivo ("content/post/study/estudo-1/01-a.md" → "content/post/study/estudo-1/"). */
export const folderOf = (path: string) => path.slice(0, path.lastIndexOf("/") + 1);

export const fileNameOf = (path: string) => path.slice(path.lastIndexOf("/") + 1);

/** Slug pelo nome do arquivo; em aulas sem o prefixo de ordem ("01-introducao.md" → "introducao"). */
export const slugOfFile = (path: string, lesson = false) => {
  const name = fileNameOf(path).replace(/\.md$/, "");
  return lesson ? name.replace(/^\d+-/, "") : name;
};

export const CONTENT_LOCATION = {
  post: (kind: PostKind, slug: string) => `content/post/blog/${POST_FOLDER[kind]}/${slug}.md`,
  lesson: (studySlug: string, order: number, lessonSlug: string) =>
    `content/post/study/${studySlug}/${String(order).padStart(2, "0")}-${lessonSlug}.md`,
  /** caminho no disco (relativo à raiz do blog) e URL pública da imagem */
  image: (folder: string, fileName: string) => ({
    file: `public/images/${folder}/${fileName}`,
    url: `/images/${folder}/${fileName}`,
  }),
};
