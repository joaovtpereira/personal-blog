import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import type { Post } from "@/domain/entities";
import { Link } from "@/main/i18n/navigation";
import { ROUTES } from "@/main/routes";
import { formatShortDate } from "../../utils/format";
import { Icon } from "../Icon";
import { Rating } from "../Rating";
import { Tag } from "../Tag";
import styles from "./FeaturedPostCard.module.css";

/**
 * Destaque do blog. A mídia muda pelo tipo: capa de livro inclinada, captura de jogo ou aspas do pensamento.
 * Celular: card vertical · Tablet/desktop: mídia e texto lado a lado.
 */
export function FeaturedPostCard({ post }: { post: Post }) {
  const t = useTranslations("Blog");
  const tp = useTranslations("Post");
  const format = useFormatter();
  const date = formatShortDate(format, post.publishedAt);
  const minutes = t("readingTime", { minutes: post.readingMinutes });

  return (
    <Link href={ROUTES.post(post.slug)} className={`lift ${styles.card}`}>
      <div className={styles.media}>
        <span className={`mono ${styles.badge}`}>{tp(`kind.${post.kind}`)}</span>
        {post.coverImage ? (
          <div className={`${styles.cover} ${post.kind === "game" ? styles.capture : ""}`}>
            <Image src={post.coverImage} alt="" fill sizes="240px" className={styles.coverImage} />
          </div>
        ) : post.kind === "book" ? (
          <>
            <div className={`serif ${styles.quote}`} aria-hidden="true">
              “
            </div>
            <div className={styles.book} aria-hidden="true">
              <span className="mono">{t("featured.cover")}</span>
              <span className="serif">{post.title}</span>
            </div>
            <span className={`mono ${styles.placeholderLabel}`}>{t("featured.cover")}</span>
          </>
        ) : post.kind === "game" ? (
          <div className={styles.screen} aria-hidden="true">
            <span className="mono">{t("featured.capture")}</span>
          </div>
        ) : (
          <div className={`serif ${styles.quote} ${styles.quoteAlways}`} aria-hidden="true">
            “
          </div>
        )}
      </div>

      <div className={styles.body}>
        <span className={`mono ${styles.kind}`}>{tp(`kind.${post.kind}`)}</span>
        {post.tags.length > 0 && (
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <Tag key={tag} name={tag} />
            ))}
          </div>
        )}
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <div className={styles.footer}>
          {post.rating !== null ? (
            <span className={styles.rating}>
              <Rating score={post.rating} label={tp("rating", { score: post.rating })} />
              <span className={`mono ${styles.score}`} aria-hidden="true">
                {post.rating}/5
              </span>
            </span>
          ) : (
            <span />
          )}
          <span className={`mono ${styles.meta}`}>
            <span className={styles.date}>{date} · </span>
            {minutes}
          </span>
          <Icon name="arrowUpRight" size={22} className={`arrow ${styles.arrow}`} />
        </div>
      </div>
    </Link>
  );
}
