import {
  fileNameOf,
  folderOf,
  isBound,
  kindOfPath,
  type ContentReading,
  type EditorBlock,
  type ImageRef,
  type OpenedContent,
} from "@editor/domain/entities";
import type { LessonDocumentMapper, PostDocumentMapper } from "@editor/domain/mappers";
import type { OpenContentFile } from "@editor/domain/use-cases";
import type { ContentFileReader } from "@editor/shared/content-files";
import type { ImagePicker } from "@editor/shared/image-picker";
import type { MarkdownParser } from "@editor/shared/markdown";

const countImages = (blocks: EditorBlock[]) => blocks.filter((b) => !isBound(b) && b.type === "figure" && b.image).length;
const countUnknown = (blocks: EditorBlock[]) => blocks.filter((b) => b.type === "raw").length;

/** Abre um .md do blog. Aulas trazem junto as outras aulas da mesma pasta de estudo. */
export class MarkdownContentOpener implements OpenContentFile {
  constructor(
    private readonly reader: ContentFileReader,
    private readonly parser: MarkdownParser,
    private readonly posts: PostDocumentMapper,
    private readonly lessons: LessonDocumentMapper,
    private readonly images: ImagePicker,
  ) {}

  async open(path: string): Promise<OpenedContent> {
    const root = await this.reader.blogRoot();
    // "/images/x/capa.png" já está no blog: exibe de public/ e não copia de novo ao salvar.
    const resolveImage = (url: string): ImageRef => {
      const fileName = fileNameOf(url);
      if (!url.startsWith("/")) return { sourcePath: url, fileName, previewUrl: url, publicUrl: url };
      const absolute = `${root}/public${url}`;
      return { sourcePath: absolute, fileName, previewUrl: this.images.previewUrlOf(absolute), publicUrl: url };
    };

    if (kindOfPath(path) === "lesson") return this.openStudy(path, resolveImage);

    const parsed = this.parser.parse(await this.reader.read(path));
    const { kind, draft, publication } = this.posts.toEntity(parsed, { path, resolveImage });
    const meta = draft.meta as { title: string; cover?: ImageRef | null; capture?: ImageRef | null; collection?: { kept: { name: string; position: number } | null } };
    const kept = meta.collection?.kept;
    const reading: ContentReading = {
      title: meta.title,
      blocks: draft.blocks.length,
      images: countImages(draft.blocks) + (meta.cover || meta.capture ? 1 : 0),
      unknown: countUnknown(draft.blocks),
      collection: kept ? `${kept.name} · parte ${kept.position}` : null,
      study: null,
    };
    return { kind, path, draft, publication, reading } as OpenedContent;
  }

  private async openStudy(path: string, resolveImage: (url: string) => ImageRef): Promise<OpenedContent> {
    const folder = folderOf(path);
    const siblings = (await this.reader.list())
      .map((entry) => entry.path)
      .filter((p) => folderOf(p) === folder)
      .sort();
    const opened = await Promise.all(
      (siblings.includes(path) ? siblings : [...siblings, path]).map(async (p) =>
        this.lessons.toEntity(this.parser.parse(await this.reader.read(p)), { path: p, resolveImage }),
      ),
    );
    opened.sort((a, b) => (a.lesson.source?.order ?? 0) - (b.lesson.source?.order ?? 0));
    const focus = opened.find((o) => o.lesson.source?.path === path) ?? opened[0];
    const { study } = focus;

    return {
      kind: "lesson",
      path,
      focusLessonId: focus.lesson.id,
      publication: focus.publication,
      study: {
        study: { mode: "opened", studyId: study.id, newStudyName: "", opened: study },
        lessons: opened.map((o) => o.lesson),
      },
      reading: {
        title: focus.lesson.title,
        blocks: focus.lesson.blocks.length,
        images: countImages(focus.lesson.blocks),
        unknown: countUnknown(focus.lesson.blocks),
        collection: null,
        study: { title: study.title, lessons: opened.length },
      },
    };
  }
}
