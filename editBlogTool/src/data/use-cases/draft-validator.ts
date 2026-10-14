import {
  bookCollectionPlan,
  COLLECTION_CHECK_KEY,
  gameCollectionPlan,
  hasPlaceholder,
  isFilled,
  isValidVideoUrl,
  lessonCheckKey,
  REQUIRED_FIELDS,
  requiredLessonFields,
  STUDY_CHECK_KEY,
  studyTarget,
  type DraftReport,
  type EditorBlock,
  type EditorCatalog,
  type EditorWorkspace,
  type ImageRef,
  type RequirementCheck,
} from "@editor/domain/entities";
import type { ValidateDraft } from "@editor/domain/use-cases";

const short = (text: string, max = 28) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

function summary(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (value && typeof value === "object" && "fileName" in value) return (value as ImageRef).fileName;
  if (typeof value === "number") return `${value}/5`;
  return String(value);
}

function check(key: string, label: string, value: unknown, valid = isFilled(value)): RequirementCheck {
  const filled = isFilled(value);
  return {
    key,
    label,
    ok: valid,
    problem: valid ? null : filled ? "invalid" : "missing",
    value: valid ? short(summary(value).replace(/^https?:\/\//, "")) : null,
  };
}

/** Regras de publicação: campos obrigatórios por tipo + recomendações (tags, marcadores, imagens). */
export class DraftValidator implements ValidateDraft {
  validate(workspace: EditorWorkspace, catalog: EditorCatalog): DraftReport {
    const required: RequirementCheck[] = [];
    let blocks: EditorBlock[];

    if (workspace.kind === "lesson") {
      const { study, lessons } = workspace.study;
      const target = studyTarget(study, catalog);
      required.push({ key: STUDY_CHECK_KEY, label: "Estudo", ok: !!target, problem: target ? null : "missing", value: target ? short(target.title) : null });
      lessons.forEach((lesson, i) => {
        const prefix = `Aula ${String(i + 1).padStart(2, "0")} · `;
        for (const field of requiredLessonFields(lesson.format)) {
          const value = lesson[field.key as "title" | "videoUrl"];
          const valid = field.key === "videoUrl" ? isValidVideoUrl(value) : isFilled(value);
          required.push(check(lessonCheckKey(lesson.id, field.key), prefix + field.label, value, valid));
        }
      });
      blocks = lessons.flatMap((lesson) => lesson.blocks);
    } else {
      const meta = workspace[workspace.kind].meta as Record<string, unknown>;
      for (const field of REQUIRED_FIELDS[workspace.kind]) required.push(check(field.key, field.label, meta[field.key]));

      if (workspace.kind !== "thought") {
        const plan =
          workspace.kind === "book"
            ? bookCollectionPlan(workspace.book.meta, catalog)
            : gameCollectionPlan(workspace.game.meta, catalog);
        required.push({
          key: COLLECTION_CHECK_KEY,
          label: workspace.kind === "book" ? "Ligação com resenha anterior" : "Coleção",
          ok: !!plan,
          problem: plan ? null : "missing",
          value: plan ? (plan.status === "standalone" ? "não" : short(plan.name)) : null,
        });
      }
      blocks = workspace[workspace.kind].blocks;
    }

    const { tags } = workspace.publication;
    const placeholders = blocks.filter(hasPlaceholder).length;
    const emptyFigures = blocks.filter((b) => b.type === "figure" && !b.image).length;
    const recommendations: RequirementCheck[] = [
      {
        key: "tags",
        label: tags.length ? `${tags.length} tag(s): ${tags.map((t) => `#${t}`).join(" ")}` : "Nenhuma tag selecionada.",
        ok: tags.length > 0,
        problem: tags.length ? null : "missing",
        value: null,
      },
      {
        key: "placeholders",
        label: placeholders ? `${placeholders} bloco(s) de texto ainda têm marcadores [ ].` : "Nenhum marcador [ ] pendente nos blocos.",
        ok: placeholders === 0,
        problem: placeholders ? "missing" : null,
        value: null,
      },
    ];
    if (emptyFigures) {
      recommendations.push({ key: "figures", label: `${emptyFigures} imagem(ns) sem arquivo enviado.`, ok: false, problem: "missing", value: null });
    }

    const done = required.filter((c) => c.ok).length;
    return { required, recommendations, done, total: required.length, ready: done === required.length };
  }
}
