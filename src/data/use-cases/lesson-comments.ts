import { validateComment, type PublicComment } from "@/domain/entities";
import type { PublicCommentMapper } from "@/domain/mappers";
import type { LessonCommentModel } from "@/domain/models";
import type {
  GetLessonComments,
  PostLessonComment,
  PostLessonCommentParams,
  PostLessonCommentResult,
} from "@/domain/use-cases";
import type { EmailSender } from "@/shared/email";
import type { CommentStore } from "@/shared/feedback";

export class LessonCommentsLoader implements GetLessonComments {
  constructor(
    private readonly store: CommentStore<LessonCommentModel>,
    private readonly mapper: PublicCommentMapper,
  ) {}

  async execute({ lessonId }: { lessonId: string }): Promise<PublicComment[]> {
    const models = await this.store.listFor(lessonId);
    return models
      .filter((model) => model.status === "aprovado")
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((model) => this.mapper.toEntity(model));
  }
}

/** Valida, guarda como "pendente" e avisa o moderador. Aparece depois de aprovado no Firestore. */
export class LessonCommentModeration implements PostLessonComment {
  constructor(
    private readonly store: CommentStore<LessonCommentModel>,
    private readonly emailSender: EmailSender,
    private readonly moderatorEmail: string,
  ) {}

  async execute(params: PostLessonCommentParams): Promise<PostLessonCommentResult> {
    const errors = validateComment(params);
    if (Object.keys(errors).length > 0) return { status: "invalid", errors };

    const model: LessonCommentModel = {
      id: `lc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      study_id: params.studyId,
      lesson_id: params.lessonId,
      author_name: params.name.trim() || null,
      body: params.text.trim(),
      created_at: new Date().toISOString(),
      status: "pendente",
      locale: params.locale,
    };

    try {
      await this.store.add(model);
    } catch {
      return { status: "failed" };
    }

    await this.emailSender
      .send({
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
      })
      .catch(() => undefined);
    return { status: "pending" };
  }
}
