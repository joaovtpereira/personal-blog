import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { makeContactScreen } from "@/main/factories/screens/make-contact-screen";
import { routing } from "@/main/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/contato">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contato">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return makeContactScreen();
}
