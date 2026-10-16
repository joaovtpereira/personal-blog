import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Locale } from "@/domain/entities";
import { makeBlogScreen } from "@/main/factories/screens/make-blog-screen";
import { routing } from "@/main/i18n/routing";
import { hasActiveFilters, parseBlogQuery } from "@/presentation/utils/blog-query";

export async function generateMetadata({ params, searchParams }: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const { locale } = await params;
  const query = parseBlogQuery(await searchParams);
  const t = await getTranslations({ locale, namespace: "Blog" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    // Combinações de filtro/busca/página não entram no índice; a listagem principal sim.
    robots: hasActiveFilters(query) || query.page > 1 ? { index: false, follow: true } : undefined,
  };
}

/**
 * Os filtros vêm da URL (dado da requisição). A listagem sem filtros vai no HTML estático como
 * fallback; com filtros na URL, a versão filtrada substitui logo em seguida (streaming).
 */
export default async function BlogPage({ params, searchParams }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <Suspense fallback={await makeBlogScreen(locale, parseBlogQuery({}))}>
      <FilteredBlog locale={locale} searchParams={searchParams} />
    </Suspense>
  );
}

async function FilteredBlog({ locale, searchParams }: { locale: Locale; searchParams: PageProps<"/[locale]/blog">["searchParams"] }) {
  return makeBlogScreen(locale, parseBlogQuery(await searchParams));
}
