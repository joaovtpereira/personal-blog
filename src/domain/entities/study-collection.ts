/** Estudo dentro de uma coleção (trilha de estudos relacionados). */
export type CollectionItem = {
  slug: string;
  title: string;
  /** 1-based */
  position: number;
};

export type StudyCollectionPosition = {
  id: string;
  slug: string;
  name: string;
  position: number;
  total: number;
  previous: CollectionItem | null;
  current: CollectionItem;
  next: CollectionItem | null;
};

/** Regra de negócio: com 1 item não é coleção. */
export const MIN_COLLECTION_ITEMS = 2;

export const isCollection = (total: number): boolean => total >= MIN_COLLECTION_ITEMS;
