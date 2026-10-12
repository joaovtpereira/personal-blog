import { notFound } from "next/navigation";
import type { Locale } from "@/domain/entities";
import { CollectionScreen } from "@/presentation/screens/collection";
import { makeGetCollection } from "../use-cases/use-cases";

export const loadCollection = (locale: Locale, slug: string) => makeGetCollection().execute({ locale, slug });

export async function makeCollectionScreen(locale: Locale, slug: string) {
  const collection = await loadCollection(locale, slug);
  // Inexistente ou com menos de 2 itens publicados: não é coleção.
  if (!collection) notFound();
  return <CollectionScreen collection={collection} />;
}
