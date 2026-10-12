"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import type { Post, PostKind } from "@/domain/entities";
import { Link } from "@/main/i18n/navigation";
import { ROUTES } from "@/main/routes";
import { Chip } from "@/presentation/components/Chip";
import { PostCard } from "@/presentation/components/PostCard";
import { richTags } from "@/presentation/i18n/rich";
import styles from "./LatestPostsSection.module.css";

type Filter = "all" | PostKind;

const FILTERS: Filter[] = ["all", "thought", "book", "game"];

/** Celular mostra 3 em lista, tablet 4 em grade de 2, desktop 3 em grade de 3. */
const MAX_VISIBLE = 4;

export function LatestPostsSection({ posts }: { posts: Post[] }) {
  const t = useTranslations("Home.latest");
  const tp = useTranslations("Post");
  const [filter, setFilter] = useState<Filter>("all");
  const visible = posts.filter((post) => filter === "all" || post.kind === filter).slice(0, MAX_VISIBLE);

  return (
    <section className={`wrap ${styles.section}`} aria-labelledby="latest-title">
      <div className={styles.header}>
        <h2 id="latest-title" className={styles.title}>
          {t.rich("title", richTags)}
        </h2>
        <Link href={ROUTES.blog} className={`ul ${styles.seeAllTop}`}>
          {t("seeAll")}
        </Link>
        <div role="group" aria-label={t("filterLabel")} className={styles.filters}>
          {FILTERS.map((id) => (
            <Chip key={id} selected={filter === id} aria-pressed={filter === id} onClick={() => setFilter(id)}>
              {tp(`filters.${id}`)}
            </Chip>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className={styles.empty}>{t("empty")}</p>
      ) : (
        <div key={filter} className={styles.list} aria-live="polite">
          {visible.map((post, i) => (
            <PostCard key={post.id} post={post} delay={i * 0.08} />
          ))}
        </div>
      )}

      <Link href={ROUTES.blog} className={`ul ${styles.seeAllBottom}`}>
        {t("seeAllPosts")} →
      </Link>
    </section>
  );
}
