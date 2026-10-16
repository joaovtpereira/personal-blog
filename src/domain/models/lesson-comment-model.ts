/** Comentário como vem/vai para o back-end. Não usar na apresentação. */
export type LessonCommentModel = {
  id: string;
  study_id: string;
  lesson_id: string;
  author_name: string | null;
  body: string;
  created_at: string;
  status: "aprovado" | "pendente" | "rejeitado";
  locale?: string;
};
