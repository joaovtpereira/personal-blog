/** Slug reservado que nunca existe: a página dele responde 404. */
export const PLACEHOLDER_SLUG = "_";

/**
 * Com Cache Components, generateStaticParams precisa devolver ao menos um item.
 * Sem conteúdo publicado (ex.: nenhum estudo ainda), prerenderiza só o 404 de um slug reservado;
 * os conteúdos novos continuam sendo gerados no primeiro acesso.
 */
export const atLeastOne = <T>(params: T[], placeholder: T): T[] => (params.length > 0 ? params : [placeholder]);
