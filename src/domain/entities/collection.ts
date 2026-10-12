import type { Locale } from "./locale";

export type CollectionKind = "studies" | "reviews";

/** Para onde um item da coleção leva. */
export type CollectionRef =
  | { type: "study"; id: string; slug: string; lessons: { id: string; slug: string }[] }
  | { type: "post"; id: string; slug: string };

export type CollectionEntry = {
  /** 1-based, na ordem da coleção */
  position: number;
  title: string;
  status: "published" | "upcoming";
  /** null nos itens "em breve" */
  ref: CollectionRef | null;
  /** Quantidade de aulas (só estudos). */
  lessonCount: number | null;
  /** Tempo do item em minutos (leitura + vídeo). */
  minutes: number | null;
  /** Nota da resenha (só resenhas). */
  rating: number | null;
};

export type Collection = {
  id: string;
  slug: string;
  locale: Locale;
  kind: CollectionKind;
  name: string;
  description: string;
  entries: CollectionEntry[];
};

/** Regra de negócio: com menos de 2 itens publicados não é coleção. */
export const MIN_COLLECTION_ITEMS = 2;

export const isCollection = (publishedCount: number): boolean => publishedCount >= MIN_COLLECTION_ITEMS;

export const publishedEntries = (collection: Collection): CollectionEntry[] =>
  collection.entries.filter((entry) => entry.status === "published");

/** Ainda há itens anunciados → coleção em andamento. */
export const collectionStatus = (collection: Collection): "ongoing" | "complete" =>
  collection.entries.some((entry) => entry.status === "upcoming") ? "ongoing" : "complete";

export const collectionMinutes = (collection: Collection): number =>
  collection.entries.reduce((sum, entry) => sum + (entry.minutes ?? 0), 0);

export type EntryProgress = "done" | "started" | "todo";

export type CollectionProgress = {
  done: number;
  /** Item onde o visitante deve continuar (1º publicado não concluído). null = tudo concluído. */
  current: CollectionEntry | null;
  states: Map<number, EntryProgress>;
};

/** Regra: o "você está aqui" é o primeiro item publicado que o visitante ainda não concluiu. */
export function collectionProgress(
  collection: Collection,
  progressOf: (entry: CollectionEntry) => EntryProgress,
): CollectionProgress {
  const states = new Map<number, EntryProgress>();
  let done = 0;
  let current: CollectionEntry | null = null;
  for (const entry of publishedEntries(collection)) {
    const state = progressOf(entry);
    states.set(entry.position, state);
    if (state === "done") done += 1;
    else current ??= entry;
  }
  return { done, current, states };
}
