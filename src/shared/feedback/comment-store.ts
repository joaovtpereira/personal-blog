/** Onde os comentários ficam (Firestore, memória...). Um store por tipo (post, aula). */
export interface CommentStore<TModel> {
  /** Todos os comentários de um post/aula, de qualquer status. */
  listFor(targetId: string): Promise<TModel[]>;
  add(model: TModel): Promise<void>;
}
