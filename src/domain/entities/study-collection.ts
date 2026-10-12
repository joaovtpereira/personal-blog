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
