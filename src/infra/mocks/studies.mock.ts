import type { StudyLessonModel, StudyModel } from "@/domain/models";

const lessons = (studyId: string, total: number, videos: number): StudyLessonModel[] =>
  Array.from({ length: total }, (_, i) => ({
    id: `${studyId}-aula-${String(i + 1).padStart(2, "0")}`,
    format: i < videos ? "video" : "texto",
  }));

const TEXT = {
  pt: { title: "[Nome do estudo]", description: "[Uma linha sobre o que este estudo cobre.]" },
  es: { title: "[Nombre del estudio]", description: "[Una línea sobre lo que cubre este estudio.]" },
  en: { title: "[Study title]", description: "[One line about what this study covers.]" },
};

const SEEDS = [
  { id: "s1", slug: "estudo-1", tags: ["tecnologia"], lessons: lessons("s1", 8, 5), order: 1 },
  { id: "s2", slug: "estudo-2", tags: ["religião"], lessons: lessons("s2", 5, 0), order: 2 },
  { id: "s3", slug: "estudo-3", tags: ["filosofia", "história"], lessons: lessons("s3", 12, 12), order: 3 },
  { id: "s4", slug: "estudo-4", tags: ["filmes"], lessons: lessons("s4", 6, 2), order: 4 },
];

export const STUDIES_MOCK: StudyModel[] = SEEDS.flatMap((seed) =>
  (["pt", "es", "en"] as const).map((locale) => ({ ...seed, locale, ...TEXT[locale] })),
);
