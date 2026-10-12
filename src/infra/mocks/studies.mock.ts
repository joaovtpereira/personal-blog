import type { StudyLessonModel, StudyModel } from "@/domain/models";

const lessons = (total: number, done: number, videos: number): StudyLessonModel[] =>
  Array.from({ length: total }, (_, i) => ({
    id: `l${i + 1}`,
    format: i < videos ? "video" : "texto",
    completed: i < done,
  }));

const TITLE = { pt: "[Nome do estudo]", es: "[Nombre del estudio]", en: "[Study title]" };

const SEEDS = [
  { id: "s1", slug: "estudo-1", tags: ["tecnologia"], lessons: lessons(8, 3, 5), updated_at: "2026-10-09T10:00:00Z" },
  { id: "s2", slug: "estudo-2", tags: ["religião"], lessons: lessons(5, 5, 0), updated_at: "2026-10-02T10:00:00Z" },
  { id: "s3", slug: "estudo-3", tags: ["filosofia", "história"], lessons: lessons(12, 7, 12), updated_at: "2026-09-20T10:00:00Z" },
];

export const STUDIES_MOCK: StudyModel[] = SEEDS.flatMap((seed) =>
  (["pt", "es", "en"] as const).map((locale) => ({ ...seed, locale, title: TITLE[locale] })),
);
