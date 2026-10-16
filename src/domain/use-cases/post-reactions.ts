import type { PostReactionChoice, PostReactions } from "../entities";

/** Totais de curtidas (resenhas) ou das três reações (pensamentos) de um post. */
export interface GetPostReactions {
  execute(params: { postId: string }): Promise<PostReactions>;
}

export type ReactToPostParams = {
  postId: string;
  /** reação tocada */
  choice: PostReactionChoice;
  /** reação que o visitante já tinha neste post (guardada no navegador); null = nenhuma */
  previous: PostReactionChoice | null;
  /** identifica o visitante anônimo para o limite de tentativas (ex.: IP) */
  visitorKey: string;
};

export type ReactToPostResult =
  | { status: "ok"; reactions: PostReactions; choice: PostReactionChoice | null }
  | { status: "limited" }
  | { status: "invalid" };

/**
 * Regra: uma reação por visitante e post. Tocar na mesma desfaz; tocar em outra troca
 * (soma na nova e tira da anterior). Muitas tentativas seguidas são recusadas.
 */
export interface ReactToPost {
  execute(params: ReactToPostParams): Promise<ReactToPostResult>;
}
