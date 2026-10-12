import type { CollectionModel } from "@/domain/models";

type Locale = "pt" | "es" | "en";

const TEXT = {
  pt: {
    topic: "[Nome do tópico]",
    series: "[Nome da série]",
    about: "[Sobre a coleção: o que une esses itens e em que ordem vale a pena seguir.]",
    upcomingStudy: "[Próximo estudo da trilha]",
    upcomingReview: "[Próximo livro da série]",
  },
  es: {
    topic: "[Nombre del tema]",
    series: "[Nombre de la serie]",
    about: "[Sobre la colección: qué une estos ítems y en qué orden vale la pena seguirlos.]",
    upcomingStudy: "[Próximo estudio de la ruta]",
    upcomingReview: "[Próximo libro de la serie]",
  },
  en: {
    topic: "[Topic name]",
    series: "[Series name]",
    about: "[About the collection: what ties these items together and the order worth following.]",
    upcomingStudy: "[Next study in the track]",
    upcomingReview: "[Next book in the series]",
  },
} satisfies Record<Locale, unknown>;

export const COLLECTIONS_MOCK: CollectionModel[] = (["pt", "es", "en"] as const).flatMap((locale) => {
  const t = TEXT[locale];
  return [
    {
      id: "col-1",
      slug: "colecao-1",
      locale,
      kind: "estudos",
      name: t.topic,
      description: t.about,
      items: [
        { ref_id: "s3", status: "publicado" },
        { ref_id: "s1", status: "publicado" },
        { ref_id: "s4", status: "publicado" },
        // Cenário: item anunciado, ainda sem conteúdo.
        { ref_id: null, status: "em-breve", title: t.upcomingStudy },
      ],
    },
    // Cenário: coleção com 1 estudo — pela regra de negócio não é coleção (404 e sem navegação).
    { id: "col-2", slug: "colecao-2", locale, kind: "estudos", name: t.topic, description: t.about, items: [{ ref_id: "s2", status: "publicado" }] },
    // Série de resenhas (usada pelo blog): completa, sem itens futuros.
    {
      id: "col-3",
      slug: "serie-1",
      locale,
      kind: "resenhas",
      name: t.series,
      description: t.about,
      items: [
        { ref_id: "p7", status: "publicado" },
        { ref_id: "p5", status: "publicado" },
        { ref_id: "p2", status: "publicado" },
        { ref_id: null, status: "em-breve", title: t.upcomingReview },
      ],
    },
  ];
});
