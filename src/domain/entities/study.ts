import type { Locale } from "./locale";

export type Study = {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  tags: string[];
  totalLessons: number;
  completedLessons: number;
  videoLessons: number;
};

export const isTextOnlyStudy = (study: Study): boolean => study.videoLessons === 0;

export const isCompletedStudy = (study: Study): boolean =>
  study.totalLessons > 0 && study.completedLessons >= study.totalLessons;

export const studyProgress = (study: Study): number =>
  study.totalLessons === 0 ? 0 : Math.min(1, study.completedLessons / study.totalLessons);
