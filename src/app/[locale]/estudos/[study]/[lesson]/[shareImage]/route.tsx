import { hasLocale } from "next-intl";
import { SHARE_IMAGE_FILES, shareImageFormatOf } from "@/domain/entities";
import { makeShareImageResponse } from "@/main/factories/share/share-image-response";
import { makeGetLessonShareCard, makeGetStudyLessonRoutes } from "@/main/factories/use-cases/use-cases";
import { routing } from "@/main/i18n/routing";

/** /[locale]/estudos/[study]/[lesson]/story.png e /link.png — imagens geradas no build. */
export async function generateStaticParams() {
  const routes = await makeGetStudyLessonRoutes().execute();
  return routes.flatMap((route) =>
    Object.values(SHARE_IMAGE_FILES).map((shareImage) => ({
      locale: route.locale,
      study: route.studySlug,
      lesson: route.lessonSlug,
      shareImage,
    })),
  );
}

export async function GET(_request: Request, { params }: RouteContext<"/[locale]/estudos/[study]/[lesson]/[shareImage]">) {
  const { locale, study, lesson, shareImage } = await params;
  const format = shareImageFormatOf(shareImage);
  if (!format || !hasLocale(routing.locales, locale)) return new Response(null, { status: 404 });

  const card = await makeGetLessonShareCard().execute({ locale, studySlug: study, lessonSlug: lesson });
  if (!card) return new Response(null, { status: 404 });
  return makeShareImageResponse(card, format);
}
