"use client";

import { useTranslations } from "next-intl";
import { collectionMinutes, publishedEntries, type Collection } from "@/domain/entities";
import { Link } from "@/main/i18n/navigation";
import { Icon } from "@/presentation/components/Icon";
import { SegmentedProgress, type SegmentState } from "@/presentation/components/SegmentedProgress";
import { useCollectionProgress, useEntryHref } from "../use-collection-progress";
import styles from "./CollectionProgressPanel.module.css";

/** Progresso do visitante, segmentos por item e o botão para começar/continuar. */
export function CollectionProgressPanel({ collection }: { collection: Collection }) {
  const t = useTranslations("Collection");
  const progress = useCollectionProgress(collection);
  const hrefOf = useEntryHref();
  const published = publishedEntries(collection);
  const minutes = collectionMinutes(collection);
  const pad = (n: number) => String(n).padStart(2, "0");
  const total = collection.entries.length;

  const segments: SegmentState[] = collection.entries.map((entry) => {
    if (entry.status === "upcoming") return "upcoming";
    if (progress.states.get(entry.position) === "done") return "done";
    return entry === progress.current ? "current" : "todo";
  });

  // Regra: começa no 1º item; continua no 1º não concluído; com tudo visto, revê desde o início.
  const target = progress.current ?? published[0];
  const ctaKey = !progress.current ? "again" : progress.done === 0 && progress.states.get(target.position) !== "started" ? "start" : "continue";
  const href = hrefOf(target);
  const unit = t(`unit.${collection.kind}`);
  const label = progress.tracked
    ? t(`progress.${collection.kind}`, { done: pad(progress.done), total: pad(published.length) })
    : t("count", { count: pad(total) });

  return (
    <div className={styles.panel}>
      <div className={`mono ${styles.row}`}>
        <span>{label}</span>
        {progress.tracked ? (
          <>
            <span className={styles.countMobile}>
              {minutes ? t("countAndTime", { count: pad(total), minutes }) : t("count", { count: pad(total) })}
            </span>
            <span className={styles.countTablet}>{t("count", { count: pad(total) })}</span>
            <span className={styles.timeDesktop}>{minutes ? t("totalTime", { minutes }) : null}</span>
          </>
        ) : (
          // Sem acompanhamento o rótulo já é a contagem: à direita fica só o tempo.
          <span>{minutes ? t("totalTime", { minutes }) : null}</span>
        )}
      </div>
      <div className={styles.segments}>
        <SegmentedProgress key={progress.ready ? "ready" : "loading"} segments={segments} label={label} />
      </div>
      {progress.tracked && minutes > 0 && <div className={`mono ${styles.timeTablet}`}>{t("totalTimeLong", { minutes })}</div>}
      {href && (
        <Link href={href} className={styles.cta}>
          <span>{t(`cta.${ctaKey}`, { unit, n: target.position })}</span>
          <span className={styles.ctaIcon} aria-hidden="true">
            <Icon name="arrowRight" strokeWidth={1.8} />
          </span>
        </Link>
      )}
      {progress.tracked && <p className={`mono ${styles.note}`}>{t("progressNote")}</p>}
    </div>
  );
}
