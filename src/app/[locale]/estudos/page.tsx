import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { makeStudiesScreen } from "@/main/factories/screens/make-studies-screen";
import { routing } from "@/main/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/estudos">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Studies" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function StudiesPage({ params }: PageProps<"/[locale]/estudos">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return makeStudiesScreen(locale);
}
