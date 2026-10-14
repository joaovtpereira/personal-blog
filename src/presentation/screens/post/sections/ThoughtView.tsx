import { useFormatter, useTranslations } from "next-intl";
import { CollectionNav } from "@/presentation/components/CollectionNav";
import { Comments } from "@/presentation/components/Comments";
import { ContentRenderer } from "@/presentation/components/Content";
import { AuthorByline } from "@/presentation/components/AuthorByline";
import { ThoughtReactions } from "@/presentation/components/ReactionButtons";
import { ShareTrigger } from "@/presentation/components/ShareSheet";
import { ReadingTarget } from "@/presentation/components/ReadingBar";
import { ThoughtLinkCard } from "@/presentation/components/RelatedPostCard";
import { formatShortDate } from "@/presentation/utils/format";
import type { PostViewProps } from "../post-view-props";
import styles from "./ThoughtView.module.css";

/** Pensamento: abertura centralizada, texto em coluna estreita, reações, conversa e outros pensamentos. */
export function ThoughtView({ page, comments, commentAction, commentContext, share }: PostViewProps) {
  const t = useTranslations("PostPage");
  const tp = useTranslations("Post");
  const format = useFormatter();
  const { detail, collection, related } = page;
  const { post } = detail;

  // A última palavra do título ganha o itálico serif (voz editorial do DS).
  const words = post.title.trim().split(/\s+/);
  const last = words.pop();

  return (
    <div className={`wrap ${styles.page}`}>
      <header className={styles.hero}>
        <span className={`serif ${styles.glyph}`} aria-hidden="true">
          “
        </span>
        <div className={`rise d1 mono ${styles.badges}`}>
          <span className={styles.badge}>{tp(`kind.${post.kind}`)}</span>
          <span className={styles.date}>{formatShortDate(format, post.publishedAt)}</span>
        </div>
        <h1 className={`rise d2 ${styles.title}`}>
          {words.length > 0 && `${words.join(" ")} `}
          <span className="serif">{last}</span>
        </h1>
        {detail.lead && <p className={`rise d3 serif ${styles.lead}`}>{detail.lead}</p>}
        <div className={`rise d4 ${styles.byline}`}>
          <AuthorByline name={t("author")} meta={post.tags.map((tag) => `#${tag}`).join(" · ")} />
        </div>
        <div className={styles.ink} aria-hidden="true" />
      </header>

      <ReadingTarget className={styles.article}>
        <ContentRenderer blocks={detail.blocks} headingOffset={0} />
      </ReadingTarget>

      {detail.reactions.type === "thought" && (
        <div className={styles.reactions}>
          <ThoughtReactions postId={post.id} counts={detail.reactions.counts} />
          <div className={styles.shareRow}>
            <ShareTrigger target={share} />
          </div>
        </div>
      )}

      {collection && (
        <div className={styles.collection}>
          <CollectionNav collection={collection} />
        </div>
      )}

      <div className={styles.comments}>
        <Comments id="comentarios" comments={comments} action={commentAction} context={commentContext} variant="thought" askEmail />
      </div>

      {related.length > 0 && (
        <section className={styles.related} aria-labelledby="other-thoughts">
          <h2 id="other-thoughts" className={`mono ${styles.relatedTitle}`}>
            {t("otherThoughts")}
          </h2>
          <div className={styles.relatedList}>
            {related.map((item) => (
              <ThoughtLinkCard key={item.id} post={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
