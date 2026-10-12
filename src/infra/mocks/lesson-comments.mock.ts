import type { LessonCommentModel } from "@/domain/models";

export const LESSON_COMMENTS_MOCK: LessonCommentModel[] = [
  {
    id: "c1",
    study_id: "s1",
    lesson_id: "s1-aula-01",
    author_name: "[Nome do leitor]",
    body: "[Dúvida ou comentário sobre esta aula.]",
    created_at: "2026-10-08T14:20:00Z",
    status: "aprovado",
  },
  {
    id: "c2",
    study_id: "s1",
    lesson_id: "s1-aula-01",
    author_name: null,
    body: "[Outro comentário aprovado, de alguém que preferiu não se identificar.]",
    created_at: "2026-10-02T09:00:00Z",
    status: "aprovado",
  },
  {
    // Cenário: ainda em moderação — não pode aparecer.
    id: "c3",
    study_id: "s1",
    lesson_id: "s1-aula-01",
    author_name: "[Pendente]",
    body: "[Comentário aguardando moderação.]",
    created_at: "2026-10-10T09:00:00Z",
    status: "pendente",
  },
  {
    id: "c4",
    study_id: "s2",
    lesson_id: "s2-aula-01",
    author_name: "[Nome do leitor]",
    body: "[Dúvida ou comentário sobre esta aula.]",
    created_at: "2026-10-05T18:00:00Z",
    status: "aprovado",
  },
];
