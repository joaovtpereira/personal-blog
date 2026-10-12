import { useFormatter, useTranslations } from "next-intl";
import type { Post } from "@/domain/entities";
import { Link } from "@/main/i18n/navigation";
import { ROUTES } from "@/main/routes";
import { Rating } from "../Rating";
import { Tag } from "../Tag";
import { formatShortDate } from "../../utils/format";
import styles from "./PostCard.module.css";

type PostCardProps = {
  post: Post;
  /** Atraso da animação de entrada, em segundos. */
  delay?: number;
};

/** Linha no celular; card no tablet e no desktop. */
export function PostCard({ post, delay = 0 }: PostCardProps) {
  const t = useTranslations("Post");
  const format = useFormatter();
  const date = formatShortDate(format, post.publishedAt);

  return (
    <Link href={ROUTES.post(post.slug)} className={`swap ${styles.card}`} style={{ animationDelay: `${delay}s` }}>
      <div className={`mono ${styles.meta}`}>
        <span>{t(`kind.${post.kind}`)}</span>
        <span>
          <time className={styles.date} dateTime={post.publishedAt}>
            {date} ·{" "}
          </time>
          {t("readingTime", { minutes: post.readingMinutes })}
        </span>
      </div>
      <h3 className={styles.title}>{post.title}</h3>
      <p className={styles.excerpt}>{post.excerpt}</p>
      {post.tags.length > 0 && (
        <div className={styles.tags}>
          {post.tags.map((tag) => (
            <Tag key={tag} name={tag} />
          ))}
        </div>
      )}
      <div className={styles.footer}>
        <span className={`mono ${styles.tagLine}`}>{post.tags.map((tag) => `#${tag}`).join("  ")}</span>
        {post.rating !== null && (
          <span className={styles.rating}>
            <Rating score={post.rating} label={t("rating", { score: post.rating })} />
            <span className={`mono ${styles.score}`} aria-hidden="true">
              {post.rating}/5
            </span>
          </span>
        )}
      </div>
    </Link>
  );
}
