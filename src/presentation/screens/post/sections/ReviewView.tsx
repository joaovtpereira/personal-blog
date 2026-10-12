import { useFormatter, useTranslations } from "next-intl";
import type { BookReview, GameReview } from "@/domain/entities";
import { Link } from "@/main/i18n/navigation";
import { ROUTES } from "@/main/routes";
import { CollectionNav } from "@/presentation/components/CollectionNav";
import { Comments } from "@/presentation/components/Comments";
import { ContentRenderer } from "@/presentation/components/Content";
import { BookCoverStage, GameCaptureStage } from "@/presentation/components/CoverStage";
import { FactSheet, type Fact } from "@/presentation/components/FactSheet";
import { Icon } from "@/presentation/components/Icon";
import { PointsCard } from "@/presentation/components/PointsCard";
import { LikeButton } from "@/presentation/components/ReactionButtons";
import { ReadingTarget } from "@/presentation/components/ReadingBar";
import { RelatedPostCard } from "@/presentation/components/RelatedPostCard";
import { ShareButton } from "@/presentation/components/ShareButton";
import { Tag } from "@/presentation/components/Tag";
import { VerdictCard } from "@/presentation/components/VerdictCard";
import { formatShortDate } from "@/presentation/utils/format";
import type { PostViewProps } from "../post-view-props";
import styles from "./ReviewView.module.css";

/**
 * Resenha de livro ou de jogo.
 * Celular/tablet: tudo em coluna (no tablet, gostei · nem tanto · veredito lado a lado).
 * Desktop: texto à esquerda e coluna fixa com veredito, ficha, tags, ações e próxima leitura.
 */
export function ReviewView({ page, comments, commentAction, commentContext }: PostViewProps) {
  const t = useTranslations("PostPage");
  const tp = useTranslations("Post");
  const format = useFormatter();
  const { detail, collection, related } = page;
  const { post, review } = detail;
  if (!review) return null;

  const date = formatShortDate(format, post.publishedAt);
  const isBook = review.kind === "book";
  const facts = isBook ? bookFacts(review, t) : gameFacts(review, t);
  const practice = isBook ? [] : practiceFacts(review, t);
  const subtitle = isBook ? t("by", { author: review.author }) : `${review.studio} · ${review.platform}`;
  const likes = detail.reactions.type === "like" ? detail.reactions.count : 0;
  const next = related[0];
  const commentsId = "comentarios";

  const tags = (
    <div className={`mono ${styles.tagList}`}>
      {post.tags.map((tag) => (
        <Link key={tag} href={{ pathname: ROUTES.blog, query: { tag } }} className={styles.tagLink}>
          <Tag name={tag} />
        </Link>
      ))}
    </div>
  );

  const actions = (
    <div className={styles.actionsRow}>
      <LikeButton postId={post.id} count={likes} className={styles.like} />
      <a href={`#${commentsId}`} className={`${styles.round} ${styles.desktopOnly}`} aria-label={t("goComments")}>
        <Icon name="chat" />
      </a>
      <ShareButton
        title={post.title}
        label={t("copyLink")}
        ariaLabel={t("copyLink")}
        copiedLabel={t("copied")}
        variant="round"
        mode="copy"
        icon="link"
        className={styles.copy}
      />
    </div>
  );

  return (
    <div className={`wrap ${styles.page} ${isBook ? styles.book : styles.game}`}>
      <Link href={ROUTES.blog} className={`ul rise ${styles.back}`}>
        ← {t("backShort")}
      </Link>

      <header className={styles.hero}>
        <div className={`rise d1 mono ${styles.badges}`}>
          <span className={styles.badge}>{tp(`kind.${post.kind}`)}</span>
          {review.kind === "game" && review.completed && <span className={styles.completed}>{t("completed")}</span>}
          <span className={`${styles.date} ${styles.dateShort}`}>{date}</span>
          <span className={`${styles.date} ${styles.dateLong}`}>{t("dateAndTime", { date, minutes: post.readingMinutes })}</span>
        </div>
        <h1 className={`rise d2 ${styles.title}`}>{post.title}</h1>
        <div className={styles.subtitleRow}>
          <span className={`rise d3 serif ${styles.subtitle}`}>{subtitle}</span>
          {isBook && <div className={`rise d4 ${styles.heroTags}`}>{tags}</div>}
        </div>
      </header>

      {collection && (
        <div className={`rise d4 ${styles.collection}`}>
          <CollectionNav collection={collection} />
        </div>
      )}

      <div className={styles.cover}>
        {review.kind === "book" ? (
          <BookCoverStage title={post.title} image={review.coverImage} placeholderLabel={t("cover")} />
        ) : (
          <GameCaptureStage image={review.captureImage} label={t("capture")} alt={t("captureAlt", { title: post.title })} />
        )}
      </div>

      <div className={`rise d4 ${styles.facts}`}>
        <FactSheet facts={facts} columns={isBook ? 3 : 2} title={t("facts.title")} />
        {practice.length > 0 && <FactSheet facts={practice} columns={3} title={t("facts.practice")} className={styles.practice} />}
      </div>

      <div className={styles.main}>
        <ReadingTarget className={styles.article}>
          <ContentRenderer blocks={detail.blocks} headingOffset={0} />
        </ReadingTarget>
        <div className={styles.points}>
          <PointsCard label={t("pros")} items={review.pros} className={styles.pros} />
          <PointsCard label={t("cons")} items={review.cons} className={styles.cons} />
        </div>
        <div className={styles.comments}>
          <Comments id={commentsId} comments={comments} action={commentAction} context={commentContext} variant="review" askEmail />
        </div>
      </div>

      <aside className={styles.aside}>
        <VerdictCard
          label={t("verdict")}
          line={review.verdict.line}
          score={review.verdict.score}
          scoreLabel={t("verdictAria", { score: review.verdict.score })}
          className={styles.verdict}
        />
        <div className={styles.factsAside}>
          <FactSheet facts={[...facts, ...practice]} layout="list" title={t("facts.title")} />
        </div>
        <div className={styles.asideTags}>{tags}</div>
        <div className={styles.actions}>{actions}</div>
        {next && (
          <div className={styles.next}>
            <div className={`mono ${styles.nextLabel}`}>{t("nextRead")}</div>
            <RelatedPostCard post={next} />
            <Link href={ROUTES.blog} className={`ul ${styles.allPosts}`}>
              ← {t("allPosts")}
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}

type T = ReturnType<typeof useTranslations<"PostPage">>;

const bookFacts = (review: BookReview, t: T): Fact[] => [
  { label: t("facts.year"), value: review.year },
  { label: t("facts.pages"), value: review.pages },
  { label: review.genres.length > 1 ? t("facts.genres") : t("facts.genre"), value: review.genres.join(", ") },
];

const gameFacts = (review: GameReview, t: T): Fact[] => [
  { label: t("facts.platform"), value: review.platform },
  { label: t("facts.hours"), value: t("facts.hoursValue", { hours: review.hours }) },
  { label: t("facts.genre"), value: review.genre },
  { label: t("facts.release"), value: review.release },
];

const practiceFacts = (review: GameReview, t: T): Fact[] => [
  { label: t("facts.worth"), value: review.worth },
  { label: t("facts.difficulty"), value: review.difficulty },
  { label: t("facts.audience"), value: review.audience },
];
