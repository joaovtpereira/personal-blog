import { validateComment, type PublicComment } from "@/domain/entities";
import type { PostCommentModel } from "@/domain/models";
import type { GetPostComments, PostCommentParams, PostCommentResult, PostPostComment } from "@/domain/use-cases";
import type { EmailSender } from "@/shared/email";
import type { CommentStore } from "@/shared/feedback";

export class PostCommentsLoader implements GetPostComments {
  constructor(private readonly store: CommentStore<PostCommentModel>) {}

  async execute({ postId }: { postId: string }): Promise<PublicComment[]> {
    const models = await this.store.listFor(postId);
    return models
      .filter((model) => model.status === "aprovado")
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((model) => ({
        id: model.id,
        authorName: model.author_name?.trim() || null,
        text: model.body,
        createdAt: model.created_at,
      }));
  }
}

/**
 * Valida, guarda como "pendente" e avisa o moderador. O comentário aparece depois de aprovado
 * (status "aprovado" no Firestore). O e-mail do leitor fica só para a moderação.
 */
export class PostCommentModeration implements PostPostComment {
  constructor(
    private readonly store: CommentStore<PostCommentModel>,
    private readonly emailSender: EmailSender,
    private readonly moderatorEmail: string,
  ) {}

  async execute(params: PostCommentParams): Promise<PostCommentResult> {
    const errors = validateComment(params);
    if (Object.keys(errors).length > 0) return { status: "invalid", errors };

    const readerEmail = params.email.trim();
    const model: PostCommentModel = {
      id: `pc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      post_id: params.postId,
      author_name: params.name.trim() || null,
      body: params.text.trim(),
      created_at: new Date().toISOString(),
      status: "pendente",
      author_email: readerEmail || null,
      locale: params.locale,
    };

    try {
      await this.store.add(model);
    } catch {
      return { status: "failed" };
    }

    // Aviso ao moderador: se falhar, o comentário já está guardado e aparece no console do Firebase.
    await this.emailSender
      .send({
        to: this.moderatorEmail,
        replyTo: readerEmail || this.moderatorEmail,
        subject: `[Moderação] Comentário em “${params.postTitle}”`,
        text: [
          `Post: ${model.post_id} — ${params.postTitle}`,
          `Autor: ${model.author_name ?? "(anônimo)"}`,
          `E-mail (não publicado): ${readerEmail || "(não informado)"}`,
          `Idioma: ${params.locale}`,
          `Enviado em: ${model.created_at}`,
          `Comentário: ${model.id} (aprove mudando status para "aprovado")`,
          "",
          model.body,
        ].join("\n"),
      })
      .catch(() => undefined);
    return { status: "pending" };
  }
}
