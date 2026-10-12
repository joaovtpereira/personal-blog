import { validateComment, type PublicComment } from "@/domain/entities";
import type { PublicCommentMapper } from "@/domain/mappers";
import type { LessonCommentModel } from "@/domain/models";
import type {
  GetLessonComments,
  PostLessonComment,
  PostLessonCommentParams,
  PostLessonCommentResult,
} from "@/domain/use-cases";
import type { CollectionDataSource } from "@/shared/data-source";
import type { EmailSender } from "@/shared/email";

export class LessonCommentsLoader implements GetLessonComments {
  constructor(
    private readonly dataSource: CollectionDataSource<LessonCommentModel>,
    private readonly mapper: PublicCommentMapper,
  ) {}

  async execute({ lessonId }: { lessonId: string }): Promise<PublicComment[]> {
    const models = await this.dataSource.findAll();
    return models
      .filter((model) => model.lesson_id === lessonId && model.status === "aprovado")
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((model) => this.mapper.toEntity(model));
  }
}

/** Valida e manda o comentário para a moderação (hoje, um e-mail para o autor do site). */
export class LessonCommentModeration implements PostLessonComment {
  constructor(
    private readonly emailSender: EmailSender,
    private readonly moderatorEmail: string,
  ) {}

  async execute(params: PostLessonCommentParams): Promise<PostLessonCommentResult> {
    const errors = validateComment(params);
    if (Object.keys(errors).length > 0) return { status: "invalid", errors };

    const model: LessonCommentModel = {
      id: `c-${Date.now().toString(36)}`,
      study_id: params.studyId,
      lesson_id: params.lessonId,
      author_name: params.name.trim() || null,
      body: params.text.trim(),
      created_at: new Date().toISOString(),
      status: "pendente",
    };

    try {
      await this.emailSender.send({
        to: this.moderatorEmail,
        replyTo: this.moderatorEmail,
        subject: `[Moderação] Comentário em “${params.lessonTitle}”`,
        text: [
          `Estudo: ${model.study_id}`,
          `Aula: ${model.lesson_id} — ${params.lessonTitle}`,
          `Autor: ${model.author_name ?? "(anônimo)"}`,
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
