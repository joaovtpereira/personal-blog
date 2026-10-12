"use client";

import { useFormatter, useTranslations } from "next-intl";
import type { ResumeDate, ResumeExperience } from "@/domain/entities";

/** "OUT 2026 — HOJE", "2021 — FEV 2025" no idioma atual. */
export function useResumePeriod() {
  const format = useFormatter();
  const t = useTranslations("Resume");

  const date = ({ year, month }: ResumeDate) =>
    month
      ? `${format
          .dateTime(new Date(Date.UTC(year, month - 1, 15)), { month: "short", timeZone: "UTC" })
          .replace(/\./g, "")
          .toUpperCase()} ${year}`
      : String(year);

  return (experience: Pick<ResumeExperience, "start" | "end">) =>
    `${date(experience.start)} — ${experience.end ? date(experience.end) : t("present")}`;
}
