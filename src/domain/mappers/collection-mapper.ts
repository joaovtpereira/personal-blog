import type { Collection, CollectionEntry } from "../entities";
import type { CollectionModel } from "../models";

/** O que se sabe de um item publicado (estudo/post) para montar a coleção. */
export type ResolvedCollectionItem = Pick<CollectionEntry, "title" | "lessonCount" | "minutes" | "rating"> & {
  ref: NonNullable<CollectionEntry["ref"]>;
};

/** Busca o estudo/post de um item; null = despublicado ou inexistente (o item some). */
export type CollectionItemResolver = (refId: string) => ResolvedCollectionItem | null;

export interface CollectionMapper {
  toEntity(model: CollectionModel, resolve: CollectionItemResolver): Collection;
}
