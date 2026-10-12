"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import type { Study } from "@/domain/entities";
import { Chip } from "@/presentation/components/Chip";
import { StudyCard } from "@/presentation/components/StudyCard";
import { useStudiesProgress } from "@/presentation/contexts/StudyProgressContext";
import styles from "./StudiesCatalog.module.css";

type Filter = "all" | "inProgress" | "completed";

const FILTERS: Filter[] = ["all", "inProgress", "completed"];

type StudiesCatalogProps = {
  studies: Study[];
  /** Texto de apoio — no desktop aparece na linha dos filtros. */
  lead: string;
};

/** Texto de apoio + filtros por progresso do visitante + grade de cards. */
export function StudiesCatalog({ studies, lead }: StudiesCatalogProps) {
  const t = useTranslations("Studies");
  const [filter, setFilter] = useState<Filter>("all");
  const { ready, summaries } = useStudiesProgress(studies);

  const visible = studies
    .map((study, index) => ({ study, index }))
    .filter(({ study }) => {
      if (filter === "all") return true;
      const status = summaries.get(study.id)?.status;
      return filter === "completed" ? status === "completed" : status === "inProgress";
    });

  return (
    <>
      <div className={`rise d4 ${styles.toolbar}`}>
        <p className={styles.lead}>{lead}</p>
        <div role="group" aria-label={t("filters.label")} className={styles.filters}>
          {FILTERS.map((id) => (
            <Chip key={id} selected={filter === id} aria-pressed={filter === id} onClick={() => setFilter(id)}>
              {t(`filters.${id}`)}
            </Chip>
          ))}
        </div>
      </div>

      <div aria-live="polite">
        {visible.length === 0 ? (
          <p className={styles.empty}>{ready || filter === "all" ? t(`empty.${filter}`) : null}</p>
        ) : (
          <ul key={filter} className={styles.grid}>
            {visible.map(({ study, index }, i) => (
              <li key={study.id} className={styles.item}>
                <StudyCard study={study} index={index} variant="catalog" delay={i * 0.08} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className={`mono ${styles.note}`}>{t("progressNote")}</p>
    </>
  );
}
