import { CONTENT_PATH } from "@/domain/entities/content-path";
import { studyOrderOf, type StudyMetaDraft } from "@editor/domain/entities";
import type { DocumentReadContext, StudyDocumentInput, StudyDocumentMapper } from "@editor/domain/mappers";
import type { MarkdownDocumentModel, ParsedDocumentModel, StudyFrontmatterModel } from "@editor/domain/models";
import { FrontmatterReader } from "./frontmatter-reader";

/** Dados do estudo ⇄ content/post/study/<estudo>/_study.md (só frontmatter, sem corpo). */
export class StudyDocumentModelMapper implements StudyDocumentMapper {
  toModel({ study, meta, workspace, fallbackOrder }: StudyDocumentInput): MarkdownDocumentModel<StudyFrontmatterModel> {
    const { locale, tags } = workspace.publication;
    return {
      path: CONTENT_PATH.study(study.slug, locale),
      frontmatter: {
        id: study.id ?? study.slug,
        slug: study.slug,
        locale,
        title: study.title,
        description: meta.description.trim(),
        tags: [...tags],
        order: studyOrderOf(meta) ?? fallbackOrder,
      },
      blocks: [],
    };
  }

  toEntity(model: ParsedDocumentModel, _context: DocumentReadContext): StudyMetaDraft {
    const fm = new FrontmatterReader(model.frontmatter);
    const order = fm.number("order");
    return { description: fm.text("description"), order: order === null ? "" : String(order) };
  }
}
