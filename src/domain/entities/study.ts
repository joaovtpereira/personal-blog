import type { Locale } from "./locale";

export type Study = {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  tags: string[];
  /** Ids das aulas, na ordem da trilha. */
  lessonIds: string[];
  videoLessons: number;
};

export const totalLessons = (study: Study): number => study.lessonIds.length;

export const isTextOnlyStudy = (study: Study): boolean => study.videoLessons === 0;

export const isAllVideoStudy = (study: Study): boolean =>
  study.videoLessons > 0 && study.videoLessons >= totalLessons(study);
