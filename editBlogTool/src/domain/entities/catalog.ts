/** Conteúdo já publicado no blog que o editor precisa conhecer (coleções, estudos, tags). */
export type ReviewSeries = { id: string; slug: string; name: string; publishedCount: number };

export type PreviousReview = { id: string; slug: string; title: string; series: ReviewSeries | null };

export type StudyOption = { id: string; slug: string; title: string; lessonCount: number };

export type EditorCatalog = {
  previousBookReviews: PreviousReview[];
  gameCollections: ReviewSeries[];
  studies: StudyOption[];
  tags: string[];
};

export const EMPTY_CATALOG: EditorCatalog = { previousBookReviews: [], gameCollections: [], studies: [], tags: [] };
