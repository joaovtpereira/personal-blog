import type { EditorCatalog } from "./catalog";
import { slugify } from "./content-location";
import type { BookMeta, GameMeta, KeptCollection } from "./draft";

/** Coleção que veio do arquivo aberto: mantida como estava. */
function keptPlan(kept: KeptCollection | null): CollectionPlan | null {
  if (!kept) return null;
  return {
    status: kept.status,
    id: kept.id,
    slug: kept.slug,
    name: kept.name,
    position: kept.position,
    total: kept.position,
    previous: kept.previousId ? { id: kept.previousId, title: "[Parte anterior]" } : null,
  };
}

/** O que acontece com a coleção ao publicar a resenha. */
export type CollectionPlan =
  | { status: "standalone" }
  | {
      status: "join" | "create";
      id: string | null;
      slug: string;
      name: string;
      /** posição desta resenha (1-based) e total depois de publicar */
      position: number;
      total: number;
      previous: { id: string; title: string } | null;
    };

/**
 * Regra de negócio: com menos de 2 itens não é coleção (o bloco de coleção não aparece).
 * null = resposta incompleta (campo obrigatório pendente).
 */
export function bookCollectionPlan(meta: BookMeta, catalog: EditorCatalog): CollectionPlan | null {
  const { answer, previousReviewId, newSeriesName } = meta.collection;
  if (answer === "standalone") return { status: "standalone" };
  if (answer === "kept") return keptPlan(meta.collection.kept);
  if (answer !== "continuation") return null;

  const previous = catalog.previousBookReviews.find((review) => review.id === previousReviewId);
  if (!previous) return null;
  if (previous.series) {
    const total = previous.series.publishedCount + 1;
    return { status: "join", id: previous.series.id, slug: previous.series.slug, name: previous.series.name, position: total, total, previous: { id: previous.id, title: previous.title } };
  }
  const name = newSeriesName.trim();
  if (!name) return null;
  return { status: "create", id: null, slug: slugify(name), name, position: 2, total: 2, previous: { id: previous.id, title: previous.title } };
}

export function gameCollectionPlan(meta: GameMeta, catalog: EditorCatalog): CollectionPlan | null {
  const { answer, collectionId, newCollectionName } = meta.collection;
  if (answer === "standalone") return { status: "standalone" };
  if (answer === "kept") return keptPlan(meta.collection.kept);
  if (answer === "existing") {
    const collection = catalog.gameCollections.find((c) => c.id === collectionId);
    if (!collection) return null;
    const total = collection.publishedCount + 1;
    return { status: "join", id: collection.id, slug: collection.slug, name: collection.name, position: total, total, previous: null };
  }
  if (answer === "new") {
    const name = newCollectionName.trim();
    return name ? { status: "create", id: null, slug: slugify(name), name, position: 1, total: 1, previous: null } : null;
  }
  return null;
}

/** Só mostra navegação de coleção com 2+ itens. */
export const showsCollection = (plan: CollectionPlan | null) => !!plan && plan.status !== "standalone" && plan.total >= 2;
