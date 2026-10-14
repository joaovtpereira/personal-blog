import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { lessonShareCard } from "@/domain/entities";
import { loadStudyLesson, makeStudyLessonScreen } from "@/main/factories/screens/make-study-lesson-screen";
import { shareMetadata } from "@/main/factories/share/share-target";
import { makeGetStudyLessonRoutes } from "@/main/factories/use-cases/use-cases";
import { routing } from "@/main/i18n/routing";
import { ROUTES } from "@/main/routes";

export async function generateStaticParams() {
  const routes = await makeGetStudyLessonRoutes().execute();
  return routes.map((r) => ({ locale: r.locale, study: r.studySlug, lesson: r.lessonSlug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/estudos/[study]/[lesson]">): Promise<Metadata> {
  const { locale, study, lesson } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const page = await loadStudyLesson(locale, study, lesson);
  if (!page) return {};
  const t = await getTranslations({ locale, namespace: "Lesson" });
  const share = shareMetadata(lessonShareCard(page, ROUTES.lesson(study, page.lesson.slug)));
  return {
    title: t("metaTitle", { lesson: page.lesson.title, study: page.study.title }),
    description: page.study.description,
    openGraph: { type: "article", ...share.openGraph },
    twitter: share.twitter,
  };
}

export default async function LessonPage({ params }: PageProps<"/[locale]/estudos/[study]/[lesson]">) {
  const { locale, study, lesson } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return makeStudyLessonScreen(locale, study, lesson);
}
