import { ImageResponse } from "next/og";
import { getFormatter, getTranslations } from "next-intl/server";
import { SHARE_IMAGE_SIZES, type ShareCard, type ShareImageFormat } from "@/domain/entities";
import { SITE_URL } from "@/main/config/site";
import { LinkImage, StoryImage, type ShareImageLabels } from "@/presentation/share-images";
import { formatShortDate, pad2 } from "@/presentation/utils/format";
import { makeImageAssetSource, makeImageFontSource } from "../infra/image";

/** Textos da imagem no idioma do conteúdo. */
async function makeLabels(card: ShareCard): Promise<ShareImageLabels> {
  const { locale } = card;
  const [t, tPost, tPostPage, format] = await Promise.all([
    getTranslations({ locale, namespace: "ShareImage" }),
    getTranslations({ locale, namespace: "Post" }),
    getTranslations({ locale, namespace: "PostPage" }),
    getFormatter({ locale }),
  ]);
  const host = SITE_URL.host.toUpperCase();
  const date = "publishedAt" in card ? formatShortDate(format, card.publishedAt) : "";
  const lessonMinutes =
    card.kind === "lesson" && card.durationSeconds ? Math.max(1, Math.round(card.durationSeconds / 60)) : null;

  return {
    kind: card.kind === "lesson" ? t("study") : tPost(`kind.${card.kind}`),
    meta:
      card.kind === "thought"
        ? t("thoughtMeta", { date, minutes: card.readingMinutes })
        : card.kind === "lesson"
          ? card.studyTitle.toUpperCase()
          : date,
    author: tPostPage("author"),
    host,
    cta: t(`cta.${card.kind === "lesson" ? "lesson" : card.kind === "thought" ? "thought" : "review"}`, { host }),
    keyIdea: card.kind === "lesson" ? t("keyIdeaLesson") : t("keyIdeaThought"),
    by: card.kind === "book" ? tPostPage("by", { author: card.author }) : "",
    verdict: t("verdict"),
    hours: t("hours"),
    hoursPlayed: card.kind === "game" ? t("hoursPlayed", { hours: card.hours.toUpperCase() }) : "",
    worth: t("worth"),
    score: t("score"),
    completed: t("completed"),
    cover: t("cover"),
    capture: t("capture"),
    rec: t("rec"),
    lessonWord: t("lessonWord"),
    lessonPosition: card.kind === "lesson" ? t("lessonPosition", { number: pad2(card.number), total: pad2(card.total) }) : "",
    lessonFormat:
      card.kind !== "lesson"
        ? ""
        : card.format === "video"
          ? lessonMinutes
            ? t("lessonVideo", { minutes: lessonMinutes })
            : t("lessonVideoNoTime")
          : t("lessonText", { minutes: card.readingMinutes }),
  };
}

const imageOf = (card: ShareCard): string | null =>
  card.kind === "book" ? card.coverImage : card.kind === "game" ? card.captureImage : null;

/** PNG do story ou da prévia do link de um post/aula. */
export async function makeShareImageResponse(card: ShareCard, format: ShareImageFormat): Promise<ImageResponse> {
  const source = imageOf(card);
  const [labels, fonts, image] = await Promise.all([
    makeLabels(card),
    makeImageFontSource().load(),
    source ? makeImageAssetSource().resolve(source) : Promise.resolve(null),
  ]);
  const props = { card, labels, image };
  return new ImageResponse(format === "story" ? <StoryImage {...props} /> : <LinkImage {...props} />, {
    ...SHARE_IMAGE_SIZES[format],
    fonts,
    headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
  });
}

