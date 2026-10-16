import { hasLocale } from "next-intl";
import { SHARE_IMAGE_FILES, shareImageFormatOf } from "@/domain/entities";
import { cachedLessonShareImage, pngResponse } from "@/main/cache/share-image-cache";
import { makeGetStudyLessonRoutes } from "@/main/factories/use-cases/use-cases";
import { atLeastOne, PLACEHOLDER_SLUG } from "@/main/factories/static-params";
import { routing } from "@/main/i18n/routing";

/** /[locale]/estudos/[study]/[lesson]/story.png e /link.png — imagens geradas no build. */
export async function generateStaticParams() {
  const routes = await makeGetStudyLessonRoutes().execute();
  return atLeastOne(
    routes.flatMap((route) =>
      Object.values(SHARE_IMAGE_FILES).map((shareImage) => ({
        locale: route.locale,
        study: route.studySlug,
        lesson: route.lessonSlug,
        shareImage,
      })),
    ),
    { locale: routing.defaultLocale, study: PLACEHOLDER_SLUG, lesson: PLACEHOLDER_SLUG, shareImage: SHARE_IMAGE_FILES.link },
  );
}

export async function GET(_request: Request, { params }: RouteContext<"/[locale]/estudos/[study]/[lesson]/[shareImage]">) {
  const { locale, study, lesson, shareImage } = await params;
  const format = shareImageFormatOf(shareImage);
  if (!format || !hasLocale(routing.locales, locale)) return new Response(null, { status: 404 });

  const png = await cachedLessonShareImage(locale, study, lesson, format);
  return png ? pngResponse(png) : new Response(null, { status: 404 });
}
