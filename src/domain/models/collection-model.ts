/**
 * Coleção (trilha de estudos ou série de resenhas) como vem do markdown/API.
 * Itens "em-breve" podem ser anunciados só com título. Não usar na apresentação.
 */
export type CollectionItemModel = {
  /** id do estudo/post; null para itens anunciados ainda sem conteúdo */
  ref_id: string | null;
  status: "publicado" | "em-breve";
  /** obrigatório para "em-breve"; nos publicados vem do próprio estudo/post */
  title?: string | null;
};

export type CollectionModel = {
  id: string;
  slug: string;
  locale: string;
  kind: "estudos" | "resenhas";
  name: string;
  description: string;
  items: CollectionItemModel[];
};
