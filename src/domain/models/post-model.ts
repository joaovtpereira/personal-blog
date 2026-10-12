/** Formato externo (markdown/API). Não usar na camada de apresentação. */
export type PostModel = {
  id: string;
  slug: string;
  locale: string;
  type: "pensamento" | "resenha-livro" | "resenha-jogo";
  title: string;
  excerpt: string;
  tags: string[];
  reading_time_minutes: number;
  published_at: string;
  rating?: number | null;
};
