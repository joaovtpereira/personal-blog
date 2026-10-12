import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { loadPostPage, makePostScreen } from "@/main/factories/screens/make-post-screen";
import { makeGetPostRoutes } from "@/main/factories/use-cases/use-cases";
import { routing } from "@/main/i18n/routing";

export async function generateStaticParams() {
  const routes = await makeGetPostRoutes().execute();
  return routes.map((route) => ({ locale: route.locale, slug: route.slug }));
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
  return {
    title: t("metaTitle", { title: post.title, kind: tp(`kind.${post.kind}`) }),
    description: page.detail.lead ?? post.excerpt,
    openGraph: { type: "article", publishedTime: post.publishedAt, tags: post.tags },
  };
}

export default async function PostPage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return makePostScreen(locale, slug);
}
