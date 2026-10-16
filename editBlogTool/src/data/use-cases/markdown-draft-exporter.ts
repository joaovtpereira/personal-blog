import {
  CONTENT_LOCATION,
  isBound,
  slugify,
  studyTarget,
  type EditorBlock,
  type EditorCatalog,
  type EditorWorkspace,
  type ImageRef,
  type PostKind,
} from "@editor/domain/entities";
import type { LessonDocumentMapper, PostDocumentMapper, StudyDocumentMapper } from "@editor/domain/mappers";
import type { MarkdownDocumentModel } from "@editor/domain/models";
import type { ExportDraft, ExportedFile, ExportResult, SavedSource, ValidateDraft } from "@editor/domain/use-cases";
import type { ContentFileWriter } from "@editor/shared/content-files";
import type { MarkdownSerializer } from "@editor/shared/markdown";

const slugOf = (title: string, fallback: string) => slugify(title) || fallback;

/** "Minha Capa (1).PNG" → "minha-capa-1.png" */
function imageFileName(ref: ImageRef) {
  const dot = ref.fileName.lastIndexOf(".");
  const ext = dot > 0 ? ref.fileName.slice(dot + 1).toLowerCase() : "jpg";
  return `${slugify(dot > 0 ? ref.fileName.slice(0, dot) : ref.fileName) || "imagem"}.${ext}`;
}

/** Imagem que já está publicada (public/images ou URL externa) não precisa ser copiada. */
const publishedUrl = (image: ImageRef) => image.publicUrl ?? (/^https?:\/\//.test(image.sourcePath) ? image.sourcePath : null);

const figureImages = (blocks: EditorBlock[]) =>
  blocks.flatMap((b) => (!isBound(b) && b.type === "figure" && b.image ? [b.image] : []));

type Job = {
  /** study = _study.md: não é rascunho aberto, não volta como origem salva */
  kind: "post" | "lesson" | "study";
  lessonId: string | null;
  order: number | null;
  slug: string;
  document: (resolve: (image: ImageRef) => string) => MarkdownDocumentModel<{ id: string; published_at?: string }>;
  images: ImageRef[];
  imageFolder: string;
};

/**
 * Exporta o rascunho aberto: copia imagens novas para public/images/<pasta> e grava o .md.
 * Rascunho aberto de um arquivo grava no mesmo caminho (substitui o arquivo).
 */
export class MarkdownDraftExporter implements ExportDraft {
  constructor(
    private readonly validator: ValidateDraft,
    private readonly posts: PostDocumentMapper,
    private readonly lessons: LessonDocumentMapper,
    private readonly serializer: MarkdownSerializer,
    private readonly writer: ContentFileWriter,
    private readonly studies: StudyDocumentMapper,
    private readonly now: () => Date = () => new Date(),
  ) {}

  targets(workspace: EditorWorkspace, catalog: EditorCatalog): string[] {
    return this.jobs(workspace, catalog).map((job) => job.document(() => "").path);
  }

  async export(workspace: EditorWorkspace, catalog: EditorCatalog): Promise<ExportResult> {
    const report = this.validator.validate(workspace, catalog);
    if (!report.ready) throw new Error(`Faltam ${report.total - report.done} campo(s) obrigatório(s).`);

    const files: ExportedFile[] = [];
    const saved: SavedSource[] = [];
    for (const job of this.jobs(workspace, catalog)) {
      const urls = new Map<string, string>();
      const usedNames = new Set<string>();
      for (const image of job.images) {
        if (urls.has(image.sourcePath)) continue;
        const published = publishedUrl(image);
        if (published) {
          urls.set(image.sourcePath, published);
          continue;
        }
        let name = imageFileName(image);
        for (let n = 2; usedNames.has(name); n++) name = name.replace(/(-\d+)?(\.\w+)$/, `-${n}$2`);
        usedNames.add(name);
        const target = CONTENT_LOCATION.image(job.imageFolder, name);
        const result = await this.writer.copyImage(image.sourcePath, target.file);
        urls.set(image.sourcePath, target.url);
        files.push({ path: result.path, kind: "image", overwritten: result.overwritten });
      }

      const document = job.document((image) => urls.get(image.sourcePath) ?? image.previewUrl);
      const result = await this.writer.writeMarkdown(document.path, this.serializer.serialize(document));
      files.push({ path: result.path, kind: "markdown", overwritten: result.overwritten });
      if (job.kind === "study") continue;
      saved.push({
        lessonId: job.lessonId,
        source: { path: document.path, id: document.frontmatter.id, slug: job.slug, publishedAt: document.frontmatter.published_at ?? null, order: job.order },
      });
    }
    return { files, saved };
  }

  private jobs(workspace: EditorWorkspace, catalog: EditorCatalog): Job[] {
    if (workspace.kind !== "lesson") return [this.postJob(workspace.kind, workspace, catalog)];

    const study = studyTarget(workspace.study.study, catalog) ?? { id: null, slug: "sem-estudo", title: "", existingLessons: 0 };
    const { lessons } = workspace.study;
    // Aulas abertas mantêm a ordem do arquivo; novas entram depois da última.
    let next = Math.max(study.existingLessons, ...lessons.map((l) => l.source?.order ?? 0));
    const ref = { id: study.id, slug: study.slug, title: study.title };
    // Estudo já publicado mantém a ordem; novo vai para o fim da lista.
    const known = catalog.studies.find((s) => s.slug === study.slug);
    const fallbackOrder = known?.order ?? catalog.studies.length + (known ? 0 : 1);
    const studyJob: Job = {
      kind: "study",
      lessonId: null,
      order: null,
      slug: study.slug,
      imageFolder: study.slug,
      images: [],
      document: () => this.studies.toModel({ study: ref, meta: workspace.study.meta, workspace, fallbackOrder }),
    };
    const lessonJobs = lessons.map((lesson, i): Job => {
      const slug = lesson.source?.slug ?? slugOf(lesson.title, `aula-${i + 1}`);
      const order = lesson.source?.order ?? ++next;
      return {
        kind: "lesson",
        lessonId: lesson.id,
        order,
        slug,
        imageFolder: `${study.slug}/${slug}`,
        images: figureImages(lesson.blocks),
        document: (resolveImage) =>
          this.lessons.toModel({ lesson, order, slug, study: ref, workspace, resolveImage }),
      };
    });
    return [...lessonJobs, studyJob];
  }

  private postJob(kind: PostKind, workspace: EditorWorkspace, catalog: EditorCatalog): Job {
    const draft = workspace[kind];
    // O nome do arquivo não muda ao editar, mesmo que o título mude.
    const slug = draft.source?.slug ?? slugOf(draft.meta.title, "sem-titulo");
    const cover = kind === "book" ? workspace.book.meta.cover : kind === "game" ? workspace.game.meta.capture : null;
    return {
      kind: "post",
      lessonId: null,
      order: null,
      slug,
      imageFolder: slug,
      images: [...(cover ? [cover] : []), ...figureImages(draft.blocks)],
      document: (resolveImage) => this.posts.toModel({ kind, workspace, catalog, slug, publishedAt: this.now().toISOString(), resolveImage }),
    };
  }
}
