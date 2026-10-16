import type { PostCommentModel } from "@/domain/models";

export const POST_COMMENTS_MOCK: PostCommentModel[] = [
  { id: "pc1", post_id: "p2", author_name: "[Nome do leitor]", body: "[Comentário sobre a resenha.]", created_at: "2026-10-03T12:00:00Z", status: "aprovado" },
  { id: "pc2", post_id: "p2", author_name: null, body: "[Outro comentário aprovado, sem nome.]", created_at: "2026-10-02T12:00:00Z", status: "aprovado" },
  { id: "pc3", post_id: "p2", author_name: "[Pendente]", body: "[Aguardando moderação.]", created_at: "2026-10-04T12:00:00Z", status: "pendente" },
  { id: "pc4", post_id: "p1", author_name: "[Nome do leitor]", body: "[Comentário concordando e acrescentando uma experiência.]", created_at: "2026-10-09T12:00:00Z", status: "aprovado" },
  { id: "pc5", post_id: "p1", author_name: "[Nome do leitor]", body: "[Comentário com outro ponto de vista.]", created_at: "2026-10-09T15:00:00Z", status: "aprovado" },
];
