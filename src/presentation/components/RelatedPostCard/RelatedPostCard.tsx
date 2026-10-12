import { useTranslations } from "next-intl";
import type { Post } from "@/domain/entities";
import { Link } from "@/main/i18n/navigation";
import { ROUTES } from "@/main/routes";
import { Icon } from "../Icon";
import styles from "./RelatedPostCard.module.css";

/** "Próxima leitura": tipo em mono + título + seta. */
export function RelatedPostCard({ post, label, className }: { post: Post; label?: string; className?: string }) {
  const tp = useTranslations("Post");
  return (
    <Link href={ROUTES.post(post.slug)} className={`lift ${styles.card} ${className ?? ""}`}>
      <span className={styles.text}>
        <span className={`mono ${styles.kind}`}>{label ?? tp(`kind.${post.kind}`)}</span>
        <span className={styles.title}>{post.title}</span>
      </span>
      <Icon name="arrowUpRight" size={20} className="arrow" />
    </Link>
  );
}

/** Pensamento relacionado: "#tag · X MIN" + título. */
export function ThoughtLinkCard({ post }: { post: Post }) {
  const t = useTranslations("Blog");
  return (
    <Link href={ROUTES.post(post.slug)} className={`lift ${styles.thought}`}>
      <span className={`mono ${styles.kind}`}>
        {post.tags[0] ? `#${post.tags[0]} · ` : ""}
        {t("readingTime", { minutes: post.readingMinutes })}
      </span>
      <span className={styles.thoughtTitle}>{post.title}</span>
    </Link>
  );
}
