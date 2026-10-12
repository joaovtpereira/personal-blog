import type { useFormatter } from "next-intl";

/** Utilitários de formatação usados por várias telas. */

type DateFormatter = Pick<ReturnType<typeof useFormatter>, "dateTime">;

/** "08 OUT 2026" no idioma do formatador (next-intl `useFormatter`). */
export function formatShortDate(format: DateFormatter, iso: string): string {
  return format
    .dateTime(new Date(iso), { day: "2-digit", month: "short", year: "numeric" })
    .replace(/\./g, "")
    .replace(/\s+(de|del)\s+/gi, " ")
    .toUpperCase();
}

/** 3 → "03" (contadores e numeração em mono). */
export const pad2 = (value: number): string => String(value).padStart(2, "0");
