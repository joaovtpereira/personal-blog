import { lessonShareCard, postShareCard, type Locale, type ShareCard } from "@/domain/entities";
import type { GetLessonShareCard, GetPostShareCard, GetPostPage, GetStudyLesson } from "@/domain/use-cases";

/** Monta o cartão de compartilhamento a partir da página do post. */
export class PostShareCardLoader implements GetPostShareCard {
  constructor(
    private readonly getPostPage: GetPostPage,
    private readonly pathOf: (slug: string) => string,
  ) {}

  async execute({ locale, slug }: { locale: Locale; slug: string }): Promise<ShareCard | null> {
    const page = await this.getPostPage.execute({ locale, slug });
    return page ? postShareCard(page, this.pathOf(slug)) : null;
  }
}

export class LessonShareCardLoader implements GetLessonShareCard {
  constructor(
    private readonly getStudyLesson: GetStudyLesson,
    private readonly pathOf: (studySlug: string, lessonSlug: string) => string,
  ) {}

  async execute(params: { locale: Locale; studySlug: string; lessonSlug: string }): Promise<ShareCard | null> {
    const page = await this.getStudyLesson.execute(params);
    return page && lessonShareCard(page, this.pathOf(params.studySlug, params.lessonSlug));
  }
}
