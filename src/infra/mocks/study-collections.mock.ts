import type { StudyCollectionModel } from "@/domain/models";

const NAME = { pt: "[Nome do tópico]", es: "[Nombre del tema]", en: "[Topic name]" };

export const STUDY_COLLECTIONS_MOCK: StudyCollectionModel[] = (["pt", "es", "en"] as const).flatMap((locale) => [
  { id: "col-1", slug: "colecao-1", locale, name: NAME[locale], study_ids: ["s3", "s1", "s4"] },
  // Cenário: coleção com 1 estudo — pela regra de negócio não aparece.
  { id: "col-2", slug: "colecao-2", locale, name: NAME[locale], study_ids: ["s2"] },
]);
