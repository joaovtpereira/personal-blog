import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/main/i18n/routing";
import { AppStudyProgressProvider } from "@/main/providers/AppStudyProgressProvider";
import { BottomNav } from "@/presentation/components/BottomNav";
import { InlineScript } from "@/presentation/components/InlineScript";
import { SiteFooter } from "@/presentation/components/SiteFooter";
import { SiteHeader } from "@/presentation/components/SiteHeader";
import { themeInitScript } from "@/presentation/components/ThemeToggle/theme-script";
import "@/presentation/styles/globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], weight: ["400", "500"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const HTML_LANG = { pt: "pt-BR", es: "es", en: "en" } as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { languages: Object.fromEntries(routing.locales.map((l) => [HTML_LANG[l], `/${l}`])) },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={HTML_LANG[locale]}
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={themeInitScript} />
      </head>
      <body id="top">
        <NextIntlClientProvider>
          <AppStudyProgressProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
            <BottomNav />
          </AppStudyProgressProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
