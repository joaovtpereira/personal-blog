import { contentLocale, type ContentFileInfo, type ContentPostKind, type Locale } from "@/domain/entities";
import type { ContentFileModel, MarkdownCatalogMapper } from "@/domain/mappers";
import type {
  CollectionModel,
  ContentBlockModel,
  ContentCatalogModel,
  DocumentBlockModel,
  LessonModel,
  PostContentModel,
  PostModel,
  StudyModel,
} from "@/domain/models";
import { FrontmatterReader } from "./frontmatter-reader";

const POST_TYPE: Record<ContentPostKind, PostModel["type"]> = {
  thought: "pensamento",
  book: "resenha-livro",
  game: "resenha-jogo",
};

const WORDS_PER_MINUTE = 200;

/** Slots (::cover, ::verdict) só marcam posição no editor: a tela já tem lugar fixo para eles. */
function toContentBlocks(blocks: DocumentBlockModel[]): ContentBlockModel[] {
  return blocks.flatMap((block): ContentBlockModel[] => {
    if (block.type === "slot") return [];
    // Trecho que o leitor não reconheceu: aparece como texto, sem perder conteúdo.
    if (block.type === "raw") return block.markdown.trim() ? [{ type: "paragraph", text: block.markdown }] : [];
    if (block.type === "code") {
      const { value, lang, filename } = block;
      return [{ type: "code", value, lang, filename }];
    }
    return [block];
  });
}

const blockText = (block: ContentBlockModel): string => {
  if ("text" in block && typeof block.text === "string") return block.text;
  if ("items" in block) return block.items.map((item) => (typeof item === "string" ? item : Object.values(item).join(" "))).join(" ");
  if (block.type === "code") return block.value;
  if (block.type === "table") return [...block.header, ...block.rows.flat()].join(" ");
  return "";
};

/** Tempo de leitura quando o arquivo não informa: palavras ÷ 200, no mínimo 1 minuto. */
const estimateMinutes = (blocks: ContentBlockModel[]) =>
  Math.max(1, Math.ceil(blocks.map(blockText).join(" ").split(/\s+/).filter(Boolean).length / WORDS_PER_MINUTE));

type PostFile = { info: Extract<ContentFileInfo, { kind: ContentPostKind }>; fm: FrontmatterReader; blocks: ContentBlockModel[] };
type LessonFile = { info: Extract<ContentFileInfo, { kind: "lesson" }>; fm: FrontmatterReader; blocks: ContentBlockModel[] };
type StudyFile = { info: Extract<ContentFileInfo, { kind: "study" }>; fm: FrontmatterReader };

type LinkedPost = { post: PostModel; content: PostContentModel; collection: FrontmatterReader | null };

/** Aula + o que ela diz do estudo (usado quando não há _study.md). */
type LinkedLesson = { lesson: LessonModel; study: { id: string; title: string; tags: string[] } };

/**
 * Frontmatter + blocos → PostModel/PostContentModel, LessonModel, StudyModel e as coleções de resenhas.
 * Campos que faltam viram vazios (a tela esconde a seção); arquivo sem título é ignorado.
 */
export class MarkdownCatalogModelMapper implements MarkdownCatalogMapper {
  constructor(private readonly warn: (message: string) => void = () => {}) {}

  toCatalog(files: ContentFileModel[]): ContentCatalogModel {
    const posts: PostFile[] = [];
    const lessons: LessonFile[] = [];
    const studies: StudyFile[] = [];
    for (const { info, document } of files) {
      const fm = new FrontmatterReader(document.frontmatter);
      if (info.kind === "study") studies.push({ info, fm });
      else if (info.kind === "lesson") lessons.push({ info, fm, blocks: toContentBlocks(document.blocks) });
      else posts.push({ info, fm, blocks: toContentBlocks(document.blocks) });
    }

    const linked = this.unique(
      posts.flatMap((file) => this.post(file)),
      (item) => `${item.post.locale}:${item.post.slug}`,
      "post",
    );
    const linkedLessons = this.unique(
      lessons.flatMap((file) => this.lesson(file)),
      ({ lesson }) => `${lesson.locale}:${lesson.study_id}:${lesson.slug}`,
      "aula",
    );
    const studyModels = this.studies(linkedLessons, studies);

    return {
      posts: linked.map((item) => item.post),
      postContents: linked.map((item) => item.content),
      lessons: linkedLessons.map((item) => item.lesson),
      studies: studyModels,
      collections: this.collections(linked),
    };
  }

  /** Dois arquivos com o mesmo idioma e slug: vale o primeiro e o outro é avisado. */
  private unique<T>(items: T[], key: (item: T) => string, label: string): T[] {
    const seen = new Set<string>();
    return items.filter((item) => {
      const id = key(item);
      if (seen.has(id)) {
        this.warn(`[content] ${label} duplicado ignorado: ${id}`);
        return false;
      }
      seen.add(id);
      return true;
    });
  }

  private post({ info, fm, blocks }: PostFile): LinkedPost[] {
    const title = fm.text("title").trim();
    if (!title) {
      this.warn(`[content] post sem título ignorado: ${info.slug}`);
      return [];
    }
    const locale = contentLocale(info.locale, fm.text("locale"));
    const slug = fm.text("slug") || info.slug;
    const id = fm.text("id") || slug;
    const lead = fm.text("lead") || null;
    const book = fm.object("book");
    const game = fm.object("game");

    const post: PostModel = {
      id,
      slug,
      locale,
      type: POST_TYPE[info.kind],
      title,
      excerpt: fm.text("excerpt") || lead || "",
      tags: fm.list("tags"),
      reading_time_minutes: fm.number("reading_time_minutes") ?? estimateMinutes(blocks),
      published_at: fm.text("published_at") || new Date(0).toISOString(),
      rating: fm.number("rating"),
      author: fm.text("author") || null,
      platform: fm.text("platform") || null,
      cover_image: fm.text("cover_image") || null,
      featured: fm.bool("featured"),
    };

    const content: PostContentModel = {
      post_id: id,
      locale,
      lead,
      blocks,
      book:
        info.kind === "book"
          ? {
              year: book?.text("year") ?? "",
              pages: book?.text("pages") ?? "",
              genres: book?.list("genres") ?? [],
              verdict_line: book?.text("verdict_line") ?? "",
              pros: book?.list("pros") ?? [],
              cons: book?.list("cons") ?? [],
            }
          : null,
      game:
        info.kind === "game"
          ? {
              studio: game?.text("studio") ?? "",
              hours: game?.text("hours") ?? "",
              release: game?.text("release") ?? "",
              genre: game?.text("genre") ?? "",
              completed: game?.bool("completed") ?? false,
              worth: game?.text("worth") ?? "",
              difficulty: game?.text("difficulty") ?? "",
              audience: game?.text("audience") ?? "",
              verdict_line: game?.text("verdict_line") ?? "",
              pros: game?.list("pros") ?? [],
              cons: game?.list("cons") ?? [],
            }
          : null,
      // Curtidas e reações são do back-end (ainda não existe): começam em zero.
      likes: 0,
      reactions: { fez_sentido: 0, me_fez_pensar: 0, discordo: 0 },
    };

    return [{ post, content, collection: fm.object("collection") }];
  }

  private lesson({ info, fm, blocks }: LessonFile): LinkedLesson[] {
    const title = fm.text("title").trim();
    if (!title) {
      this.warn(`[content] aula sem título ignorada: ${info.studySlug}/${info.slug}`);
      return [];
    }
    const study = fm.object("study");
    const studySlug = study?.text("slug") || info.studySlug;
    const slug = fm.text("slug") || info.slug;
    const video = fm.object("video");
    const summary = fm.object("summary");
    const provider = video?.text("provider");

    const lesson: LessonModel = {
        id: fm.text("id") || `${studySlug}-${slug}`,
        // O id do estudo é resolvido junto com o _study.md (ver studies()).
        study_id: studySlug,
        locale: contentLocale(info.locale, fm.text("locale")),
        slug,
        order: fm.number("order") ?? info.order ?? Number.MAX_SAFE_INTEGER,
        title,
        format: video?.text("ref") ? "video" : fm.text("format") === "video" ? "video" : "texto",
        reading_minutes: fm.number("reading_minutes") ?? estimateMinutes(blocks),
        video: video?.text("ref")
          ? {
              provider: provider === "youtube" || provider === "vimeo" ? provider : "arquivo",
              ref: video.text("ref"),
              duration_seconds: video.number("duration_seconds"),
              poster: video.text("poster") || null,
            }
          : null,
        summary: summary?.text("key_idea") ? { key_idea: summary.text("key_idea"), text: summary.text("text") } : null,
        blocks,
        materials: fm.objects("materials").flatMap((item, i) => {
          const url = item.text("url");
          if (!url) return [];
          const type = item.text("type");
          return [
            {
              id: item.text("id") || `${studySlug}-${slug}-material-${i + 1}`,
              title: item.text("title") || url,
              type: type === "pdf" || type === "link" ? type : "arquivo",
              url,
            },
          ];
        }),
    };
    return [{ lesson, study: { id: study?.text("id") || fm.text("study_id"), title: study?.text("title") ?? "", tags: fm.list("tags") } }];
  }

  /**
   * Um estudo por pasta e idioma. Os dados vêm do _study.md do idioma (ou do PT); sem ele,
   * título, id e tags vêm das próprias aulas. Estudo sem aulas não aparece.
   */
  private studies(lessons: LinkedLesson[], metaFiles: StudyFile[]): StudyModel[] {
    const metaOf = (studySlug: string, locale: Locale) => {
      const of = (l: Locale) =>
        metaFiles.find((m) => m.info.studySlug === studySlug && contentLocale(m.info.locale, m.fm.text("locale")) === l)?.fm ?? null;
      return { own: of(locale), base: of("pt") };
    };

    // Agrupa pela pasta (study_id ainda é o slug da pasta) e pelo idioma.
    const groups = new Map<string, LinkedLesson[]>();
    for (const item of lessons) {
      const key = `${item.lesson.locale}:${item.lesson.study_id}`;
      groups.set(key, [...(groups.get(key) ?? []), item]);
    }

    return [...groups.values()].map((group) => {
      const folder = group[0].lesson.study_id;
      const locale = group[0].lesson.locale;
      const { own, base } = metaOf(folder, locale as Locale);
      const pick = (read: (fm: FrontmatterReader) => string) => (own && read(own)) || (base && read(base)) || "";
      const id = pick((fm) => fm.text("id")) || group.map((item) => item.study.id).find(Boolean) || folder;
      const metaTags = own?.list("tags").length ? own.list("tags") : (base?.list("tags") ?? []);

      // As aulas passam a apontar para o id final do estudo.
      for (const item of group) item.lesson.study_id = id;
      const ordered = group.map((item) => item.lesson).sort((a, b) => a.order - b.order);

      return {
        id,
        slug: folder,
        locale,
        title: own?.text("title") || group.map((item) => item.study.title).find(Boolean) || base?.text("title") || folder,
        description: pick((fm) => fm.text("description")),
        tags: metaTags.length ? metaTags : [...new Set(group.flatMap((item) => item.study.tags))],
        order: own?.number("order") ?? base?.number("order") ?? Number.MAX_SAFE_INTEGER,
        lessons: ordered.map((lesson) => ({ id: lesson.id, slug: lesson.slug, format: lesson.format })),
      };
    });
  }

  /**
   * Séries de resenhas a partir do campo `collection` dos posts. Ao criar a série a partir de uma
   * resenha anterior (previous_ref_id), a anterior vira a parte 1. Regra de "2+ itens" fica nos casos de uso.
   */
  private collections(posts: LinkedPost[]): CollectionModel[] {
    const series = new Map<string, CollectionModel & { positions: Map<string, number> }>();
    const byId = (locale: string, id: string) => posts.find((p) => p.post.locale === locale && p.post.id === id);

    for (const { post, collection } of posts) {
      const slug = collection?.text("slug");
      if (!collection || !slug) continue;
      const id = collection.text("id") || slug;
      const key = `${post.locale}:${id}`;
      const entry = series.get(key) ?? {
        id,
        slug,
        locale: post.locale,
        kind: "resenhas" as const,
        name: collection.text("name") || slug,
        description: "",
        items: [],
        positions: new Map<string, number>(),
      };
      entry.positions.set(post.id, collection.number("position") ?? entry.positions.size + 1);
      const previous = collection.text("previous_ref_id");
      if (previous && byId(post.locale, previous) && !entry.positions.has(previous)) entry.positions.set(previous, 1);
      series.set(key, entry);
    }

    return [...series.values()].map(({ positions, ...collection }) => {
      const publishedAt = (id: string) => byId(collection.locale, id)?.post.published_at ?? "";
      const ids = [...positions.keys()].sort((a, b) => positions.get(a)! - positions.get(b)! || publishedAt(a).localeCompare(publishedAt(b)));
      return { ...collection, items: ids.map((ref_id) => ({ ref_id, status: "publicado" as const })) };
    });
  }
}
