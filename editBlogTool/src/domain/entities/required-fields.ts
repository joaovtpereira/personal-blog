import type { DraftKind, LessonFormat } from "./draft";

export type RequiredField = {
  key: string;
  label: string;
  /** só obrigatório neste formato de aula */
  onlyFormat?: LessonFormat;
};

/** Campos obrigatórios para publicar, por tipo, na ordem em que aparecem na aba Dados. */
export const REQUIRED_FIELDS: Record<DraftKind, RequiredField[]> = {
  thought: [
    { key: "title", label: "Título" },
    { key: "lead", label: "Linha fina" },
  ],
  book: [
    { key: "title", label: "Nome do livro" },
    { key: "author", label: "Por (autor)" },
    { key: "cover", label: "Capa do livro" },
    { key: "year", label: "Ano" },
    { key: "pages", label: "Páginas" },
    { key: "genres", label: "Gêneros" },
    { key: "score", label: "Veredito (nota)" },
  ],
  game: [
    { key: "title", label: "Nome do jogo" },
    { key: "studio", label: "Estúdio" },
    { key: "platform", label: "Plataforma" },
    { key: "capture", label: "Captura do jogo" },
    { key: "hours", label: "Horas jogadas" },
    { key: "year", label: "Lançamento" },
    { key: "genre", label: "Gênero" },
    { key: "score", label: "Veredito (nota)" },
    { key: "worth", label: "Vale o preço?" },
    { key: "difficulty", label: "Dificuldade" },
    { key: "audience", label: "Para quem" },
  ],
  lesson: [
    { key: "title", label: "Título da aula" },
    { key: "videoUrl", label: "Vídeo da aula", onlyFormat: "video" },
  ],
};

export const requiredLessonFields = (format: LessonFormat) =>
  REQUIRED_FIELDS.lesson.filter((field) => !field.onlyFormat || field.onlyFormat === format);

/** Chave da checagem de um campo de aula no relatório. */
export const lessonCheckKey = (lessonId: string, field: string) => `lesson.${lessonId}.${field}`;

export const COLLECTION_CHECK_KEY = "collection";
export const STUDY_CHECK_KEY = "study";

/** Valor preenchido: texto não vazio, lista com itens, nota escolhida, imagem enviada. */
export function isFilled(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim() !== "";
  return true;
}
