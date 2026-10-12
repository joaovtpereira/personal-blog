"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { LOCALES, type Locale } from "@/domain/entities";
import { usePathname, useRouter } from "@/main/i18n/navigation";

export function useLocaleSwitch() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const change = (next: Locale) => {
    if (next === locale) return;
    startTransition(() => router.replace(pathname, { locale: next, scroll: false }));
  };

  const cycle = () => change(LOCALES[(LOCALES.indexOf(locale) + 1) % LOCALES.length]);

  return { locale, locales: LOCALES, change, cycle, isPending };
}
