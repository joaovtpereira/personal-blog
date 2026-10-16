import { cacheLife, cacheTag } from "next/cache";
import type { Locale, ShareImageFormat } from "@/domain/entities";
import { makeShareImageResponse } from "../factories/share/share-image-response";
import { makeGetLessonShareCard, makeGetPostShareCard } from "../factories/use-cases/use-cases";
import { CACHE_TAGS } from "./cache-tags";

/* PNGs de compartilhamento: gerados uma vez por conteúdo e guardados (mudam só com um novo deploy). */

const bytesOf = async (response: Response) => new Uint8Array(await response.arrayBuffer());

/** null = post inexistente (a rota responde 404). */
export async function cachedPostShareImage(locale: Locale, slug: string, format: ShareImageFormat): Promise<Uint8Array | null> {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.content);
  const card = await makeGetPostShareCard().execute({ locale, slug });
  return card ? bytesOf(await makeShareImageResponse(card, format)) : null;
}

export async function cachedLessonShareImage(
  locale: Locale,
  studySlug: string,
  lessonSlug: string,
  format: ShareImageFormat,
): Promise<Uint8Array | null> {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.content);
  const card = await makeGetLessonShareCard().execute({ locale, studySlug, lessonSlug });
  return card ? bytesOf(await makeShareImageResponse(card, format)) : null;
}

/** Resposta PNG com cache de CDN. */
export const pngResponse = (bytes: Uint8Array) =>
  new Response(bytes as BodyInit, {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
  });
