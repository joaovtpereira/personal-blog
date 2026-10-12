import type { StudyModel } from "@/domain/models";

/** Formato de cada aula, na ordem. true = vídeo, false = texto. */
export const STUDY_FORMATS: Record<string, boolean[]> = {
  s1: [true, true, false, true, false, true, true, false],
  s2: [false, false, false, false, false],
  s3: Array.from({ length: 12 }, () => true),
  s4: [true, false, false, true, false, false],
};

export const lessonSlug = (index: number) => `aula-${String(index + 1).padStart(2, "0")}`;
export const lessonId = (studyId: string, index: number) => `${studyId}-${lessonSlug(index)}`;

const TEXT = {
  pt: { title: "[Nome do estudo]", description: "[Uma linha sobre o que este estudo cobre.]" },
  es: { title: "[Nombre del estudio]", description: "[Una línea sobre lo que cubre este estudio.]" },
  en: { title: "[Study title]", description: "[One line about what this study covers.]" },
};

const SEEDS = [
  { id: "s1", slug: "estudo-1", tags: ["tecnologia"], order: 1 },
  { id: "s2", slug: "estudo-2", tags: ["religião"], order: 2 },
  { id: "s3", slug: "estudo-3", tags: ["filosofia", "história"], order: 3 },
  { id: "s4", slug: "estudo-4", tags: ["filmes"], order: 4 },
];

export const STUDIES_MOCK: StudyModel[] = SEEDS.flatMap((seed) =>
  (["pt", "es", "en"] as const).map((locale) => ({
    ...seed,
    locale,
    ...TEXT[locale],
    lessons: STUDY_FORMATS[seed.id].map((video, i) => ({
      id: lessonId(seed.id, i),
      slug: lessonSlug(i),
      format: video ? ("video" as const) : ("texto" as const),
    })),
  })),
);
