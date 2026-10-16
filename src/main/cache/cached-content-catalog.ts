import { cacheLife, cacheTag } from "next/cache";
import type { ContentCatalogModel } from "@/domain/models";
import type { ContentCatalog } from "@/shared/content";
import { makeFileContentCatalog } from "../factories/infra/content-catalog";
import { CACHE_TAGS } from "./cache-tags";

/**
 * Os .md só mudam com um novo deploy: em produção ficam no cache até lá ("max").
 * Em desenvolvimento é refeito a cada minuto.
 */
async function loadCatalog(): Promise<ContentCatalogModel> {
  "use cache";
  if (process.env.NODE_ENV === "production") cacheLife("max");
  // Desenvolvimento: refaz a cada minuto (um .md salvo aparece em até ~1 min ao recarregar).
  // Revalidar mais rápido que isso faz o Next tratar o catálogo como dado sem cache (aviso "Blocking Route").
  else cacheLife("minutes");
  cacheTag(CACHE_TAGS.content);
  return makeFileContentCatalog().load();
}

/** Catálogo de conteúdo servido pelo cache do Next. */
export class CachedContentCatalog implements ContentCatalog {
  load(): Promise<ContentCatalogModel> {
    return loadCatalog();
  }
}
