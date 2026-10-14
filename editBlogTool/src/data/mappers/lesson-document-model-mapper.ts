import {
  CONTENT_LOCALES,
  CONTENT_LOCATION,
  ensureSlots,
  folderOf,
  formatDurationText,
  parseDuration,
  readingMinutes,
  setLessonFormat,
  slugOfFile,
  videoProviderOf,
  videoUrlOf,
  type ContentLocale,
  type IdFactory,
  type LessonDraft,
} from "@editor/domain/entities";
import type { DocumentReadContext, EditorBlockMapper, LessonDocumentInput, LessonDocumentMapper, OpenedLesson } from "@editor/domain/mappers";
import type { LessonFrontmatterModel, MarkdownDocumentModel, ParsedDocumentModel } from "@editor/domain/models";
import { FrontmatterReader } from "./frontmatter-reader";

/** Aula ⇄ frontmatter (LessonModel do blog) + blocos. */
export class LessonDocumentModelMapper implements LessonDocumentMapper {
  constructor(
    private readonly blocks: EditorBlockMapper,
    private readonly newId: IdFactory,
  ) {}

  toModel({ lesson, order, slug, study, workspace, resolveImage }: LessonDocumentInput): MarkdownDocumentModel<LessonFrontmatterModel> {
    const provider = videoProviderOf(lesson.videoUrl);
    const frontmatter: LessonFrontmatterModel = {
      id: lesson.source?.id ?? `${study.slug}-${slug}`,
      study_id: study.id ?? study.slug,
      locale: workspace.publication.locale,
      slug,
      order,
      title: lesson.title,
      format: lesson.format === "video" ? "video" : "texto",
      reading_minutes: readingMinutes(lesson.blocks),
      video:
        lesson.format === "video"
          ? {
              provider: provider === "file" ? "arquivo" : provider,
              ref: lesson.videoUrl.trim(),
              duration_seconds: parseDuration(lesson.duration),
              poster: null,
            }
          : null,
      study,
      tags: [...workspace.publication.tags],
    };

    return {
      path: lesson.source?.path ?? CONTENT_LOCATION.lesson(study.slug, order, slug),
      frontmatter,
      blocks: lesson.blocks.map((block) => this.blocks.toModel(block, resolveImage)),
    };
  }

  toEntity(model: ParsedDocumentModel, { path, resolveImage }: DocumentReadContext): OpenedLesson {
    const fm = new FrontmatterReader(model.frontmatter);
    const study = fm.object("study");
    const folderSlug = folderOf(path).split("/").filter(Boolean).pop() ?? "";
    const slug = fm.text("slug") || slugOfFile(path, true);
    const format = fm.text("format") === "texto" ? "text" : "video";
    const video = fm.object("video");
    const locale = CONTENT_LOCALES.find((l) => l === fm.text("locale")) as ContentLocale | undefined;

    const blocks = ensureSlots(model.blocks.map((block) => this.blocks.toEntity(block, resolveImage)), "lesson", this.newId);
    const lesson: LessonDraft = setLessonFormat(
      {
        id: this.newId(),
        format,
        title: fm.text("title"),
        videoUrl: video ? videoUrlOf(video.text("provider"), video.text("ref")) : "",
        duration: formatDurationText(video?.number("duration_seconds")),
        blocks,
        source: { path, id: fm.text("id") || `${folderSlug}-${slug}`, slug, publishedAt: null, order: fm.number("order") },
      },
      format,
      this.newId,
    );

    return {
      lesson,
      study: {
        id: study?.text("id") || fm.text("study_id") || null,
        slug: study?.text("slug") || folderSlug,
        title: study?.text("title") || folderSlug,
      },
      publication: { tags: fm.list("tags"), ...(locale ? { locale } : {}) },
    };
  }
}
