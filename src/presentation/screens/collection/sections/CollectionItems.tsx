"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import type { Collection, CollectionEntry } from "@/domain/entities";
import { Chip } from "@/presentation/components/Chip";
import { CollectionEntryItem, CollectionEntryList, type EntryVisualState } from "@/presentation/components/CollectionEntryItem";
import { useCollectionProgress, useEntryHref } from "../use-collection-progress";
import styles from "./CollectionItems.module.css";

type Order = "asc" | "desc";

/** Lista de itens com ordenação e o estado de cada um para o visitante. */
export function CollectionItems({ collection }: { collection: Collection }) {
  const t = useTranslations("Collection");
  const [order, setOrder] = useState<Order>("asc");
  const progress = useCollectionProgress(collection);
  const hrefOf = useEntryHref();
  const { kind } = collection;
  const entries = order === "asc" ? collection.entries : [...collection.entries].reverse();

  const describe = (entry: CollectionEntry): { state: EntryVisualState; tag: string; details: string | null } => {
    const details =
      kind === "studies"
        ? [entry.lessonCount !== null ? t("lessons", { count: entry.lessonCount }) : null, entry.minutes ? t("minutes", { minutes: entry.minutes }) : null]
            .filter(Boolean)
            .join(" · ") || null
        : entry.minutes
          ? t("reading", { minutes: entry.minutes })
          : null;

    if (entry.status === "upcoming") return { state: "upcoming", tag: t("tag.upcoming"), details: null };
    const progressState = progress.states.get(entry.position);
    if (progressState === "done") return { state: "done", tag: t(`tag.done.${kind}`), details };
    if (entry === progress.current && progress.tracked) return { state: "current", tag: t("tag.current"), details };
    if (progressState === "started") return { state: "todo", tag: t("tag.started"), details };
    return { state: "todo", tag: details ?? "", details };
  };

  return (
    <section aria-labelledby="collection-items-title">
      <div className={styles.header}>
        <h2 id="collection-items-title" className={styles.title}>
          <span className={styles.short}>{t("items")}</span>
          <span className={styles.long}>{t("allItems")}</span>{" "}
          <span className={`mono ${styles.count}`}>{String(collection.entries.length).padStart(2, "0")}</span>
        </h2>
        <div role="radiogroup" aria-label={t("order.label")} className={styles.order}>
          {(["asc", "desc"] as Order[]).map((id) => (
            <Chip key={id} role="radio" aria-checked={order === id} selected={order === id} onClick={() => setOrder(id)} className={styles.chip}>
              {t(`order.${id}`)}
            </Chip>
          ))}
        </div>
      </div>

      <div key={order} className={styles.list}>
        <CollectionEntryList label={collection.name}>
          {entries.map((entry, i) => {
            const { state, tag, details } = describe(entry);
            return (
              <CollectionEntryItem
                key={entry.position}
                number={entry.position}
                title={entry.title}
                href={hrefOf(entry)}
                state={state}
                unit={t(`unitUpper.${kind}`, { n: entry.position })}
                tag={tag}
                details={details}
                rating={entry.rating !== null && entry.status === "published" ? { score: entry.rating, label: t("rating", { score: entry.rating }) } : null}
                delay={i * 0.06}
              />
            );
          })}
        </CollectionEntryList>
      </div>
    </section>
  );
}
