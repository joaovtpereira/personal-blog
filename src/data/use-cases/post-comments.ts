import { validateComment, type PublicComment } from "@/domain/entities";
import type { PostCommentModel } from "@/domain/models";
import type { GetPostComments, PostCommentParams, PostCommentResult, PostPostComment } from "@/domain/use-cases";
import type { CollectionDataSource } from "@/shared/data-source";
import type { EmailSender } from "@/shared/email";

export class PostCommentsLoader implements GetPostComments {
  constructor(private readonly dataSource: CollectionDataSource<PostCommentModel>) {}

  async execute({ postId }: { postId: string }): Promise<PublicComment[]> {
    const models = await this.dataSource.findAll();
    return models
      .filter((model) => model.post_id === postId && model.status === "aprovado")
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((model) => ({
        id: model.id,
        authorName: model.author_name?.trim() || null,
        text: model.body,
        createdAt: model.created_at,
      }));
  }
}

/** Valida e manda o comentário para moderação. O e-mail do leitor vai só para o moderador. */
export class PostCommentModeration implements PostPostComment {
  constructor(
    private readonly emailSender: EmailSender,
    private readonly moderatorEmail: string,
  ) {}

  async execute(params: PostCommentParams): Promise<PostCommentResult> {
    const errors = validateComment(params);
    if (Object.keys(errors).length > 0) return { status: "invalid", errors };

    const model: PostCommentModel = {
      id: `pc-${Date.now().toString(36)}`,
      post_id: params.postId,
      author_name: params.name.trim() || null,
      body: params.text.trim(),
      created_at: new Date().toISOString(),
      status: "pendente",
    };
    const readerEmail = params.email.trim();

    try {
      await this.emailSender.send({
        to: this.moderatorEmail,
        replyTo: readerEmail || this.moderatorEmail,
        subject: `[Moderação] Comentário em “${params.postTitle}”`,
        text: [
          `Post: ${model.post_id} — ${params.postTitle}`,
          `Autor: ${model.author_name ?? "(anônimo)"}`,
          `E-mail (não publicado): ${readerEmail || "(não informado)"}`,
          `Idioma: ${params.locale}`,
          `Enviado em: ${model.created_at}`,
          "",
          model.body,
        ].join("\n"),
      });
      return { status: "pending" };
    } catch {
      return { status: "failed" };
    }
  }
}
