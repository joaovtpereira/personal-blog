import { hasLocale } from "next-intl";
import { SHARE_IMAGE_FILES, shareImageFormatOf } from "@/domain/entities";
import { cachedPostShareImage, pngResponse } from "@/main/cache/share-image-cache";
import { makeGetPostRoutes } from "@/main/factories/use-cases/use-cases";
import { atLeastOne, PLACEHOLDER_SLUG } from "@/main/factories/static-params";
import { routing } from "@/main/i18n/routing";

/** /[locale]/blog/[slug]/story.png e /link.png — imagens geradas no build. */
export async function generateStaticParams() {
  const routes = await makeGetPostRoutes().execute();
  return atLeastOne(
    routes.flatMap((route) =>
      Object.values(SHARE_IMAGE_FILES).map((shareImage) => ({ locale: route.locale, slug: route.slug, shareImage })),
    ),
    { locale: routing.defaultLocale, slug: PLACEHOLDER_SLUG, shareImage: SHARE_IMAGE_FILES.link },
  );
}

export async function GET(_request: Request, { params }: RouteContext<"/[locale]/blog/[slug]/[shareImage]">) {
  const { locale, slug, shareImage } = await params;
  const format = shareImageFormatOf(shareImage);
  if (!format || !hasLocale(routing.locales, locale)) return new Response(null, { status: 404 });

  const png = await cachedPostShareImage(locale, slug, format);
  return png ? pngResponse(png) : new Response(null, { status: 404 });
}
