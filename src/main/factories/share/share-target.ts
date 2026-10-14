import { SHARE_IMAGE_FILES, SHARE_IMAGE_SIZES, type ShareCard, type ShareTarget } from "@/domain/entities";
import { SITE_URL, absoluteUrl } from "@/main/config/site";

const localized = (card: ShareCard) => `/${card.locale}${card.path}`;

/** Caminho das imagens geradas para o cartão (rotas /story.png e /link.png ao lado da página). */
export const shareImagePath = (card: ShareCard, format: keyof typeof SHARE_IMAGE_FILES) =>
  `${localized(card)}/${SHARE_IMAGE_FILES[format]}`;

const fileSlug = (card: ShareCard) =>
  card.path
    .split("/")
    .filter(Boolean)
    .slice(1)
    .join("-");

/** Tudo que o painel de compartilhar precisa, com o endereço público do site. */
export function makeShareTarget(card: ShareCard): ShareTarget {
  return {
    kind: card.kind,
    title: card.title,
    url: absoluteUrl(localized(card)),
    host: SITE_URL.host,
    summary: card.summary,
    storyImage: shareImagePath(card, "story"),
    linkImage: shareImagePath(card, "link"),
    imageFileName: `jvp-${fileSlug(card)}-story.png`,
  };
}

/** Open Graph / Twitter: a prévia do link aponta para a imagem gerada (link.png). */
export function shareMetadata(card: ShareCard) {
  const image = { url: shareImagePath(card, "link"), ...SHARE_IMAGE_SIZES.link, alt: card.title };
  return {
    openGraph: { url: localized(card), images: [image] },
    twitter: { card: "summary_large_image" as const, images: [image.url] },
  };
}
