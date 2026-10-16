import type { ContentBlockModel } from "./content-block-model";

/** Corpo + frontmatter específico de um post (markdown). Não usar na apresentação. */
export type PostContentModel = {
  post_id: string;
  locale: string;
  /** linha fina (pensamentos) */
  lead?: string | null;
  blocks: ContentBlockModel[];
  book?: {
    year: string;
    pages: string;
    genres: string[];
    verdict_line: string;
    pros: string[];
    cons: string[];
  } | null;
  game?: {
    studio: string;
    hours: string;
    release: string;
    genre: string;
    completed: boolean;
    worth: string;
    difficulty: string;
    audience: string;
    verdict_line: string;
    pros: string[];
    cons: string[];
  } | null;
  /** totais vindos do back-end */
  likes?: number;
  reactions?: { fez_sentido: number; me_fez_pensar: number; discordo: number };
};

/** Comentário de post como vem/vai para o back-end. Não usar na apresentação. */
export type PostCommentModel = {
  id: string;
  post_id: string;
  author_name: string | null;
  body: string;
  created_at: string;
  status: "aprovado" | "pendente" | "rejeitado";
  /** só para a moderação: nunca vai para a tela */
  author_email?: string | null;
  locale?: string;
};

/** Totais de curtidas/reações de um post (documento post_reactions/<post_id>). */
export type PostReactionCountsModel = {
  post_id: string;
  likes: number;
  fez_sentido: number;
  me_fez_pensar: number;
  discordo: number;
};

/** Reações escolhidas pelo visitante, guardadas no navegador. */
export type PostReactionStoreModel = {
  version: 1;
  choices: Record<string, string>;
};
