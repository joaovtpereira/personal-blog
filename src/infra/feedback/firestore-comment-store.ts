import type { Firestore } from "firebase-admin/firestore";
import type { CommentStore } from "@/shared/feedback";

/** Comentários numa coleção do Firestore; o documento usa o id do comentário. */
export class FirestoreCommentStore<TModel extends { id: string }> implements CommentStore<TModel> {
  constructor(
    private readonly db: Firestore,
    private readonly collection: string,
    /** campo que liga o comentário ao post/aula (post_id, lesson_id) */
    private readonly targetField: keyof TModel & string,
  ) {}

  async listFor(targetId: string): Promise<TModel[]> {
    // Só um filtro de igualdade: dispensa índice composto. Status e ordem ficam no caso de uso.
    const snapshot = await this.db.collection(this.collection).where(this.targetField, "==", targetId).get();
    return snapshot.docs.map((doc) => ({ ...(doc.data() as TModel), id: doc.id }));
  }

  async add(model: TModel): Promise<void> {
    await this.db.collection(this.collection).doc(model.id).set(model);
  }
}
