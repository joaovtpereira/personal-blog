import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { makeResumeScreen } from "@/main/factories/screens/make-resume-screen";
import { routing } from "@/main/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/curriculo">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Resume" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function ResumePage({ params }: PageProps<"/[locale]/curriculo">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return makeResumeScreen(locale);
}
