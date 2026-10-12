import type { CollectionKind } from "./collection";

/** Item vizinho dentro de uma coleção (estudo ou post). */
export type CollectionItem = {
  slug: string;
  title: string;
  /** 1-based */
  position: number;
};

/** Onde um estudo/post está dentro da sua coleção (navegação anterior/atual/próximo). */
export type CollectionPosition = {
  kind: CollectionKind;
  id: string;
  slug: string;
  name: string;
  position: number;
  total: number;
  previous: CollectionItem | null;
  current: CollectionItem;
  next: CollectionItem | null;
};

export type StudyCollectionPosition = CollectionPosition;

/** Monta a posição a partir dos itens publicados em ordem; null quando não é coleção (< 2 itens). */
export function collectionPositionOf(
  base: Pick<CollectionPosition, "kind" | "id" | "slug" | "name">,
  items: { slug: string; title: string }[],
  currentSlug: string,
): CollectionPosition | null {
  const ordered = items.map((item, i) => ({ ...item, position: i + 1 }));
  const index = ordered.findIndex((item) => item.slug === currentSlug);
  if (ordered.length < 2 || index < 0) return null;
  return {
    ...base,
    position: index + 1,
    total: ordered.length,
    previous: ordered[index - 1] ?? null,
    current: ordered[index],
    next: ordered[index + 1] ?? null,
  };
}
