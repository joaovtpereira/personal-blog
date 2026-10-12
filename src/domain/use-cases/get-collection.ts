import type { Collection, Locale } from "../entities";

export interface GetCollection {
  /** null quando não existe ou não é coleção (menos de 2 itens publicados). */
  execute(params: { locale: Locale; slug: string }): Promise<Collection | null>;
}

export interface GetCollectionRoutes {
  execute(): Promise<{ locale: Locale; slug: string }[]>;
}
