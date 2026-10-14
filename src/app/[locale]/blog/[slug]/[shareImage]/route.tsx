import { hasLocale } from "next-intl";
import { SHARE_IMAGE_FILES, shareImageFormatOf } from "@/domain/entities";
import { makeShareImageResponse } from "@/main/factories/share/share-image-response";
import { makeGetPostRoutes, makeGetPostShareCard } from "@/main/factories/use-cases/use-cases";
import { routing } from "@/main/i18n/routing";

/** /[locale]/blog/[slug]/story.png e /link.png — imagens geradas no build. */
export async function generateStaticParams() {
  const routes = await makeGetPostRoutes().execute();
  return routes.flatMap((route) =>
    Object.values(SHARE_IMAGE_FILES).map((shareImage) => ({ locale: route.locale, slug: route.slug, shareImage })),
  );
}

export async function GET(_request: Request, { params }: RouteContext<"/[locale]/blog/[slug]/[shareImage]">) {
  const { locale, slug, shareImage } = await params;
  const format = shareImageFormatOf(shareImage);
  if (!format || !hasLocale(routing.locales, locale)) return new Response(null, { status: 404 });

  const card = await makeGetPostShareCard().execute({ locale, slug });
  if (!card) return new Response(null, { status: 404 });
  return makeShareImageResponse(card, format);
}
