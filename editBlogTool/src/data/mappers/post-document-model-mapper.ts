import {
  bookCollectionPlan,
  CONTENT_LOCALES,
  CONTENT_LOCATION,
  ensureSlots,
  gameCollectionPlan,
  kindOfPath,
  readingMinutes,
  slugOfFile,
  type CollectionPlan,
  type ContentLocale,
  type ContentSource,
  type IdFactory,
  type KeptCollection,
  type PostKind,
} from "@editor/domain/entities";
import type { DocumentReadContext, EditorBlockMapper, OpenedPost, PostDocumentInput, PostDocumentMapper } from "@editor/domain/mappers";
import type { CollectionLinkModel, MarkdownDocumentModel, ParsedDocumentModel, PostFrontmatterModel } from "@editor/domain/models";
import { FrontmatterReader } from "./frontmatter-reader";

const POST_TYPE: Record<PostKind, PostFrontmatterModel["type"]> = {
  thought: "pensamento",
  book: "resenha-livro",
  game: "resenha-jogo",
};

function collectionLink(plan: CollectionPlan | null): CollectionLinkModel | null {
  if (!plan || plan.status === "standalone") return null;
  return {
    action: plan.status,
    id: plan.id,
    slug: plan.slug,
    name: plan.name,
    position: plan.position,
    previous_ref_id: plan.status === "create" && plan.previous ? plan.previous.id : undefined,
  };
}

/** Itens vazios (linhas em branco no campo) não vão para o arquivo. */
const cleanList = (items: string[]) => items.map((item) => item.trim()).filter(Boolean);

const KIND_OF_TYPE: Record<string, PostKind> = { pensamento: "thought", "resenha-livro": "book", "resenha-jogo": "game" };

/** Coleção gravada no arquivo → opção "manter coleção atual". */
function keptCollection(fm: FrontmatterReader | null): KeptCollection | null {
  const name = fm?.text("name");
  if (!fm || !name) return null;
  return {
    status: fm.text("action") === "create" ? "create" : "join",
    id: fm.text("id") || null,
    slug: fm.text("slug"),
    name,
    position: fm.number("position") ?? 1,
    previousId: fm.text("previous_ref_id") || null,
  };
}

/** Rascunho de post ⇄ frontmatter (PostModel + PostContentModel do blog) + blocos. */
export class PostDocumentModelMapper implements PostDocumentMapper {
  constructor(
    private readonly blocks: EditorBlockMapper,
    private readonly newId: IdFactory,
  ) {}

  toEntity(model: ParsedDocumentModel, { path, resolveImage }: DocumentReadContext): OpenedPost {
    const fm = new FrontmatterReader(model.frontmatter);
    const pathKind = kindOfPath(path);
    const kind = KIND_OF_TYPE[fm.text("type")] ?? (pathKind !== "lesson" ? pathKind : null);
    if (!kind) throw new Error(`Não reconheci o tipo do post em ${path}.`);

    const slug = fm.text("slug") || slugOfFile(path);
    const source: ContentSource = { path, id: fm.text("id") || slug, slug, publishedAt: fm.text("published_at") || null, order: null };
    const blocks = ensureSlots(
      model.blocks.map((block) => this.blocks.toEntity(block, resolveImage)),
      kind,
      this.newId,
    );
    const cover = fm.text("cover_image") ? resolveImage(fm.text("cover_image")) : null;
    const kept = keptCollection(fm.object("collection"));
    const locale = CONTENT_LOCALES.find((l) => l === fm.text("locale")) as ContentLocale | undefined;
    const publication = { tags: fm.list("tags"), ...(locale ? { locale } : {}) };

    const featured = fm.bool("featured");

    if (kind === "thought") {
      return { kind, publication, draft: { meta: { title: fm.text("title"), lead: fm.text("lead") || fm.text("excerpt"), featured }, blocks, source } };
    }
    if (kind === "book") {
      const book = fm.object("book") ?? new FrontmatterReader({});
      return {
        kind,
        publication,
        draft: {
          source,
          blocks,
          meta: {
            title: fm.text("title"),
            author: fm.text("author"),
            cover,
            year: book.text("year"),
            pages: book.text("pages"),
            genres: book.list("genres"),
            score: fm.number("rating"),
            verdictLine: book.text("verdict_line"),
            pros: book.list("pros"),
            cons: book.list("cons"),
            featured,
            collection: { answer: kept ? "kept" : "standalone", previousReviewId: null, newSeriesName: "", kept },
          },
        },
      };
    }
    const game = fm.object("game") ?? new FrontmatterReader({});
    return {
      kind,
      publication,
      draft: {
        source,
        blocks,
        meta: {
          title: fm.text("title"),
          studio: game.text("studio"),
          platform: fm.text("platform"),
          capture: cover,
          hours: game.text("hours"),
          year: game.text("release"),
          genre: game.text("genre"),
          score: fm.number("rating"),
          verdictLine: game.text("verdict_line"),
          worth: game.text("worth"),
          difficulty: game.text("difficulty"),
          audience: game.text("audience"),
          pros: game.list("pros"),
          cons: game.list("cons"),
          completed: game.bool("completed"),
          featured,
          collection: { answer: kept ? "kept" : "standalone", collectionId: null, newCollectionName: "", kept },
        },
      },
    };
  }

  toModel({ kind, workspace, catalog, slug, publishedAt, resolveImage }: PostDocumentInput): MarkdownDocumentModel<PostFrontmatterModel> {
    const draft = workspace[kind];
    const { tags, locale } = workspace.publication;
    // Arquivo aberto: mantém id e data de publicação originais.
    const base = {
      id: draft.source?.id ?? slug,
      slug,
      locale,
      type: POST_TYPE[kind],
      tags: [...tags],
      reading_time_minutes: readingMinutes(draft.blocks),
      published_at: draft.source?.publishedAt ?? publishedAt,
    };

    let frontmatter: PostFrontmatterModel;
    if (kind === "thought") {
      const meta = workspace.thought.meta;
      frontmatter = { ...base, title: meta.title, excerpt: meta.lead, lead: meta.lead, rating: null, featured: meta.featured };
    } else if (kind === "book") {
      const meta = workspace.book.meta;
      frontmatter = {
        ...base,
        title: meta.title,
        excerpt: meta.verdictLine || meta.author,
        rating: meta.score,
        author: meta.author,
        cover_image: meta.cover ? resolveImage(meta.cover) : null,
        featured: meta.featured,
        book: {
          year: meta.year,
          pages: meta.pages,
          genres: [...meta.genres],
          verdict_line: meta.verdictLine,
          pros: cleanList(meta.pros),
          cons: cleanList(meta.cons),
        },
        collection: collectionLink(bookCollectionPlan(meta, catalog)),
      };
    } else {
      const meta = workspace.game.meta;
      frontmatter = {
        ...base,
        title: meta.title,
        excerpt: meta.verdictLine || `${meta.studio} · ${meta.platform}`,
        rating: meta.score,
        platform: meta.platform,
        cover_image: meta.capture ? resolveImage(meta.capture) : null,
        game: {
          studio: meta.studio,
          hours: meta.hours,
          release: meta.year,
          genre: meta.genre,
          worth: meta.worth,
          difficulty: meta.difficulty,
          audience: meta.audience,
          verdict_line: meta.verdictLine,
          completed: meta.completed,
          pros: cleanList(meta.pros),
          cons: cleanList(meta.cons),
        },
        featured: meta.featured,
        collection: collectionLink(gameCollectionPlan(meta, catalog)),
      };
    }

    return {
      path: draft.source?.path ?? CONTENT_LOCATION.post(kind, slug, locale),
      frontmatter,
      blocks: draft.blocks.map((block) => this.blocks.toModel(block, resolveImage)),
    };
  }
}
