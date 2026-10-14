import type { ContentBlock } from "./content-block";
import type { LessonFormat } from "./lesson";
import type { Locale } from "./locale";
import type { PostPage, Verdict } from "./post-detail";
import type { StudyLessonPage } from "./study-lesson-page";

export type ShareKind = "thought" | "book" | "game" | "lesson";

/** Imagem para story (9:16) e prévia do link no WhatsApp/Facebook (1,91:1). */
export type ShareImageFormat = "story" | "link";

export const SHARE_IMAGE_SIZES: Record<ShareImageFormat, { width: number; height: number }> = {
  story: { width: 1080, height: 1920 },
  link: { width: 1200, height: 630 },
};

/** Nome do arquivo na URL: /…/story.png e /…/link.png */
export const SHARE_IMAGE_FILES: Record<ShareImageFormat, string> = {
  story: "story.png",
  link: "link.png",
};

export const shareImageFormatOf = (file: string): ShareImageFormat | null =>
  (Object.keys(SHARE_IMAGE_FILES) as ShareImageFormat[]).find((format) => SHARE_IMAGE_FILES[format] === file) ?? null;

type ShareCardBase = {
  locale: Locale;
  title: string;
  /** Caminho da página sem o idioma (/blog/slug). */
  path: string;
  /** Texto curto para a prévia do link. */
  summary: string;
};

export type ThoughtShareCard = ShareCardBase & {
  kind: "thought";
  lead: string | null;
  /** A frase que resume o pensamento (primeira "ideia central" do texto). */
  keyIdea: string | null;
  readingMinutes: number;
  publishedAt: string;
};

export type BookShareCard = ShareCardBase & {
  kind: "book";
  author: string;
  coverImage: string | null;
  verdict: Verdict;
  publishedAt: string;
};

export type GameShareCard = ShareCardBase & {
  kind: "game";
  studio: string;
  platform: string;
  completed: boolean;
  hours: string;
  worth: string;
  captureImage: string | null;
  verdict: Verdict;
};

export type LessonShareCard = ShareCardBase & {
  kind: "lesson";
  studyTitle: string;
  number: number;
  total: number;
  format: LessonFormat;
  durationSeconds: number | null;
  readingMinutes: number;
  keyIdea: string | null;
};

/** O que vai na imagem e no painel de compartilhar, por tipo de conteúdo. */
export type ShareCard = ThoughtShareCard | BookShareCard | GameShareCard | LessonShareCard;

const firstKeyIdea = (blocks: ContentBlock[]): string | null =>
  blocks.find((block): block is Extract<ContentBlock, { type: "keyIdea" }> => block.type === "keyIdea")?.text ?? null;

/** Regras de negócio: o que cada tipo de post mostra quando é compartilhado. */
export function postShareCard(page: PostPage, path: string): ShareCard {
  const { post, lead, blocks, review } = page.detail;
  const base = { locale: post.locale, title: post.title, path, summary: lead ?? post.excerpt };

  if (review?.kind === "book") {
    return { ...base, kind: "book", author: review.author, coverImage: review.coverImage, verdict: review.verdict, publishedAt: post.publishedAt };
  }
  if (review?.kind === "game") {
    return {
      ...base,
      kind: "game",
      studio: review.studio,
      platform: review.platform,
      completed: review.completed,
      hours: review.hours,
      worth: review.worth,
      captureImage: review.captureImage,
      verdict: review.verdict,
    };
  }
  return {
    ...base,
    kind: "thought",
    lead,
    keyIdea: firstKeyIdea(blocks),
    readingMinutes: post.readingMinutes,
    publishedAt: post.publishedAt,
  };
}

export function lessonShareCard(page: StudyLessonPage, path: string): LessonShareCard {
  const { study, lesson, lessons } = page;
  return {
    locale: study.locale,
    title: lesson.title,
    path,
    summary: study.title,
    kind: "lesson",
    studyTitle: study.title,
    number: lesson.number,
    total: lessons.length,
    format: lesson.format,
    durationSeconds: lesson.video?.durationSeconds ?? lesson.durationSeconds,
    readingMinutes: lesson.readingMinutes,
    keyIdea: lesson.summary?.keyIdea ?? firstKeyIdea(lesson.blocks),
  };
}

/** Redes que recebem o link por URL (o story vai pelo menu nativo do aparelho). */
export type ShareNetwork = "whatsapp" | "facebook" | "email";

/** O que o painel de compartilhar precisa no navegador. */
export type ShareTarget = {
  kind: ShareKind;
  title: string;
  /** Endereço completo da página (vai no WhatsApp, Facebook...). */
  url: string;
  /** Domínio exibido na prévia do link. */
  host: string;
  summary: string;
  storyImage: string;
  linkImage: string;
  /** Nome do PNG ao baixar. */
  imageFileName: string;
};
