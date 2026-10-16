import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { postShareCard } from "@/domain/entities";
import { loadPostPage, makePostScreen } from "@/main/factories/screens/make-post-screen";
import { shareMetadata } from "@/main/factories/share/share-target";
import { makeGetPostRoutes } from "@/main/factories/use-cases/use-cases";
import { atLeastOne, PLACEHOLDER_SLUG } from "@/main/factories/static-params";
import { routing } from "@/main/i18n/routing";
import { ROUTES } from "@/main/routes";

/**
 * O conteúdo depende do slug: as páginas já publicadas vão prerenderizadas, e as novas esperam a
 * renderização completa (sem tela de carregamento). Ver "instant" nas docs de Partial Prefetching.
 */
export const instant = false;

export async function generateStaticParams() {
  const routes = await makeGetPostRoutes().execute();
  return atLeastOne(
    routes.map((route) => ({ locale: route.locale, slug: route.slug })),
    { locale: routing.defaultLocale, slug: PLACEHOLDER_SLUG },
  );
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const page = await loadPostPage(locale, slug);
  if (!page) return {};
  const { post } = page.detail;
  const [t, tp] = await Promise.all([
    getTranslations({ locale, namespace: "PostPage" }),
    getTranslations({ locale, namespace: "Post" }),
  ]);
  const share = shareMetadata(postShareCard(page, ROUTES.post(slug)));
  return {
    title: t("metaTitle", { title: post.title, kind: tp(`kind.${post.kind}`) }),
    description: page.detail.lead ?? post.excerpt,
    openGraph: { type: "article", publishedTime: post.publishedAt, tags: post.tags, ...share.openGraph },
    twitter: share.twitter,
  };
}

export default async function PostPage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return makePostScreen(locale, slug);
}
