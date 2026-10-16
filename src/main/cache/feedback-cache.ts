import { cacheLife, cacheTag } from "next/cache";
import type { PostReactions, PublicComment } from "@/domain/entities";
import { makeGetLessonComments, makeGetPostComments, makeGetPostReactions } from "../factories/use-cases/use-cases";
import { CACHE_TAGS } from "./cache-tags";

/*
 * Dados vivos (Firestore) com cache do Next: entram no HTML estático da página e são remontados
 * no servidor de tempos em tempos — o 1º leitor depois da expiração refaz, os seguintes recebem pronto.
 */

/** Comentários aprovados: aparecem em até 1 hora depois da aprovação no Firestore. */
export async function cachedPostComments(postId: string): Promise<PublicComment[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.postComments(postId));
  return makeGetPostComments().execute({ postId });
}

export async function cachedLessonComments(lessonId: string): Promise<PublicComment[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.lessonComments(lessonId));
  return makeGetLessonComments().execute({ lessonId });
}

/** Totais de reações: refeitos a cada minuto e na hora em que alguém reage (updateTag na ação). */
export async function cachedPostReactions(postId: string): Promise<PostReactions> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.postReactions(postId));
  return makeGetPostReactions().execute({ postId });
}
