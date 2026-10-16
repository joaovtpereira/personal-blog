import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { loadCollection, makeCollectionScreen } from "@/main/factories/screens/make-collection-screen";
import { makeGetCollectionRoutes } from "@/main/factories/use-cases/use-cases";
import { atLeastOne, PLACEHOLDER_SLUG } from "@/main/factories/static-params";
import { routing } from "@/main/i18n/routing";

/** Só gera as que são coleção de fato (2+ itens publicados); as demais respondem 404. */
/**
 * O conteúdo depende do slug: as páginas já publicadas vão prerenderizadas, e as novas esperam a
 * renderização completa (sem tela de carregamento). Ver "instant" nas docs de Partial Prefetching.
 */
export const instant = false;

export async function generateStaticParams() {
  const routes = await makeGetCollectionRoutes().execute();
  const valid = await Promise.all(routes.map(async (route) => ((await loadCollection(route.locale, route.slug)) ? route : null)));
  return atLeastOne(
    valid.filter((route) => route !== null).map((route) => ({ locale: route.locale, slug: route.slug })),
    { locale: routing.defaultLocale, slug: PLACEHOLDER_SLUG },
  );
}

export async function generateMetadata({ params }: PageProps<"/[locale]/colecoes/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const collection = await loadCollection(locale, slug);
  if (!collection) return {};
  const t = await getTranslations({ locale, namespace: "Collection" });
  return {
    title: t("metaTitle", { name: collection.name }),
    description: t("metaDescription", { description: collection.description }),
  };
}

export default async function CollectionPage({ params }: PageProps<"/[locale]/colecoes/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return makeCollectionScreen(locale, slug);
}
