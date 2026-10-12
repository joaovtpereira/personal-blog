import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/domain/entities";

export const toLocale = (value: string): Locale =>
  (LOCALES as readonly string[]).includes(value) ? (value as Locale) : DEFAULT_LOCALE;
