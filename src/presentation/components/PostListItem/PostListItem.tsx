import { useFormatter, useTranslations } from "next-intl";
import type { Post } from "@/domain/entities";
import { Link } from "@/main/i18n/navigation";
import { ROUTES } from "@/main/routes";
import { formatShortDate, pad2 } from "../../utils/format";
import { Icon } from "../Icon";
import { Rating } from "../Rating";
import styles from "./PostListItem.module.css";

type PostListItemProps = {
  post: Post;
  /** Posição na lista filtrada (01, 02...). */
  position: number;
  delay?: number;
  className?: string;
};

/**
 * Texto na listagem do blog.
 * Celular: linha numerada · Tablet: card em grade · Desktop: linha larga com nota e meta à direita.
 * Meta: autor (livro), plataforma (jogo) ou data (pensamento) + tempo de leitura.
 */
export function PostListItem({ post, position, delay = 0, className }: PostListItemProps) {
  const tp = useTranslations("Post");
  const t = useTranslations("Blog");
  const format = useFormatter();
  const meta = `${post.subject ?? formatShortDate(format, post.publishedAt)} · ${t("readingTime", { minutes: post.readingMinutes })}`;
  const tagLine = post.tags.map((tag) => `#${tag}`).join("  ");
  const rating =
    post.rating !== null ? <Rating score={post.rating} label={tp("rating", { score: post.rating })} /> : null;

  return (
    <li className={`swap ${styles.entry} ${className ?? ""}`} style={{ animationDelay: `${delay}s` }}>
      <Link href={ROUTES.post(post.slug)} className={styles.item}>
        <span className={`mono ${styles.number}`}>{pad2(position)}</span>
        <span className={styles.main}>
          <span className={`mono ${styles.kind}`}>{tp(`kind.${post.kind}`)}</span>
          <span className={styles.title}>{post.title}</span>
          {rating && <span className={styles.ratingInline}>{rating}</span>}
          <span className={`mono ${styles.meta}`}>{meta}</span>
          <span className={`mono ${styles.tagLine}`}>{tagLine}</span>
        </span>
        <span className={styles.side}>
          {rating && <span className={styles.ratingSide}>{rating}</span>}
          <span className={`mono ${styles.sideMeta}`}>{meta}</span>
        </span>
        <Icon name="arrowUpRight" size={18} className={`arrow ${styles.arrow}`} />
      </Link>
    </li>
  );
}
