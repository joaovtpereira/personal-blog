import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { loadStudyLesson, makeStudyLessonScreen } from "@/main/factories/screens/make-study-lesson-screen";
import { makeGetStudyLessonRoutes } from "@/main/factories/use-cases/use-cases";
import { atLeastOne, PLACEHOLDER_SLUG } from "@/main/factories/static-params";
import { routing } from "@/main/i18n/routing";

/** /estudos/[estudo] abre a primeira aula (o visitante pode continuar de onde parou). */
/**
 * O conteúdo depende do slug: as páginas já publicadas vão prerenderizadas, e as novas esperam a
 * renderização completa (sem tela de carregamento). Ver "instant" nas docs de Partial Prefetching.
 */
export const instant = false;

export async function generateStaticParams() {
  const routes = await makeGetStudyLessonRoutes().execute();
  return atLeastOne(
    [...new Map(routes.map((r) => [`${r.locale}/${r.studySlug}`, { locale: r.locale, study: r.studySlug }])).values()],
    { locale: routing.defaultLocale, study: PLACEHOLDER_SLUG },
  );
}

export async function generateMetadata({ params }: PageProps<"/[locale]/estudos/[study]">): Promise<Metadata> {
  const { locale, study } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const page = await loadStudyLesson(locale, study);
  if (!page) return {};
  const t = await getTranslations({ locale, namespace: "Lesson" });
  return { title: t("metaTitle", { lesson: page.lesson.title, study: page.study.title }), description: page.study.description };
}

export default async function StudyPage({ params }: PageProps<"/[locale]/estudos/[study]">) {
  const { locale, study } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return makeStudyLessonScreen(locale, study);
}
