import { DEFAULT_LOCALE, LOCALES, type Locale } from "./locale";

/**
 * Onde cada conteúdo fica em content/ (regra compartilhada pelo blog, que lê, e pelo editor, que grava):
 *   content/post/blog/thoughts/<slug>.md          pensamento (PT)
 *   content/post/blog/review-book/<slug>.es.md    resenha de livro em espanhol (mesmo slug do PT)
 *   content/post/study/<estudo>/01-<slug>.md      aula 1 do estudo
 *   content/post/study/<estudo>/_study.md         dados do estudo (descrição, tags, ordem)
 */
export type ContentPostKind = "thought" | "book" | "game";

export type ContentFileInfo =
  | { kind: ContentPostKind; slug: string; locale: Locale | null }
  | { kind: "lesson"; slug: string; locale: Locale | null; studySlug: string; order: number | null }
  | { kind: "study"; locale: Locale | null; studySlug: string };

export const CONTENT_DIR = "content";

const POST_DIR = "content/post/blog";
const STUDY_DIR = "content/post/study";
export const STUDY_META_FILE = "_study";

const POST_FOLDER: Record<ContentPostKind, string> = {
  thought: "thoughts",
  book: "review-book",
  game: "review-game",
};

const localeSuffix = (locale: Locale) => (locale === DEFAULT_LOCALE ? "" : `.${locale}`);

/** "a.es.md" → { name: "a", locale: "es" } · "a.md" → { name: "a", locale: null } */
function splitName(fileName: string): { name: string; locale: Locale | null } {
  const base = fileName.replace(/\.md$/, "");
  const suffix = base.match(/\.([a-z]{2})$/)?.[1];
  const locale = LOCALES.find((l) => l === suffix) ?? null;
  return { name: locale ? base.slice(0, -(locale.length + 1)) : base, locale };
}

/** Tipo, slug e idioma pelo caminho; null = fora do padrão (ignorado). */
export function contentFileInfo(path: string): ContentFileInfo | null {
  if (!path.endsWith(".md")) return null;
  const parts = path.split("/");
  const { name, locale } = splitName(parts[parts.length - 1]);

  if (path.startsWith(`${STUDY_DIR}/`) && parts.length === 5) {
    const studySlug = parts[3];
    if (name === STUDY_META_FILE) return { kind: "study", locale, studySlug };
    const match = name.match(/^(\d+)-(.+)$/);
    return { kind: "lesson", slug: match ? match[2] : name, locale, studySlug, order: match ? Number(match[1]) : null };
  }

  if (path.startsWith(`${POST_DIR}/`) && parts.length === 5) {
    const kind = (Object.keys(POST_FOLDER) as ContentPostKind[]).find((k) => POST_FOLDER[k] === parts[3]);
    return kind ? { kind, slug: name, locale } : null;
  }
  return null;
}

/** Caminhos de gravação (relativos à raiz do blog). PT sem sufixo; outros idiomas com .<idioma>.md. */
export const CONTENT_PATH = {
  post: (kind: ContentPostKind, slug: string, locale: Locale = DEFAULT_LOCALE) =>
    `${POST_DIR}/${POST_FOLDER[kind]}/${slug}${localeSuffix(locale)}.md`,
  lesson: (studySlug: string, order: number, lessonSlug: string, locale: Locale = DEFAULT_LOCALE) =>
    `${STUDY_DIR}/${studySlug}/${String(order).padStart(2, "0")}-${lessonSlug}${localeSuffix(locale)}.md`,
  study: (studySlug: string, locale: Locale = DEFAULT_LOCALE) =>
    `${STUDY_DIR}/${studySlug}/${STUDY_META_FILE}${localeSuffix(locale)}.md`,
};

/** Idioma do arquivo: o sufixo do nome manda; sem sufixo, o campo locale; sem os dois, português. */
export function contentLocale(fileLocale: Locale | null, frontmatterLocale: unknown): Locale {
  return fileLocale ?? LOCALES.find((l) => l === frontmatterLocale) ?? DEFAULT_LOCALE;
}
