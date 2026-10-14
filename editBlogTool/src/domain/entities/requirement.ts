/** Resultado da checagem de um campo obrigatório ou recomendação. */
export type RequirementCheck = {
  /** chave do campo ("title", "collection", "lesson.<id>.videoUrl"...) */
  key: string;
  label: string;
  ok: boolean;
  /** "invalid" = preenchido, mas em formato errado */
  problem: "missing" | "invalid" | null;
  /** resumo do valor preenchido */
  value: string | null;
};

export type DraftReport = {
  required: RequirementCheck[];
  recommendations: RequirementCheck[];
  done: number;
  total: number;
  /** pode exportar */
  ready: boolean;
};

export const findCheck = (report: DraftReport, key: string) => report.required.find((c) => c.key === key) ?? null;
