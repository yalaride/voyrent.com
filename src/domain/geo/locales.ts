export const LOCALES = ["en", "es", "ar", "fr", "pt"] as const;

export type AppLocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";

export const RTL_LOCALES = new Set<AppLocale>(["ar"]);

export const LOCALE_NAMES: Record<AppLocale, string> = {
  en: "English",
  es: "Español",
  ar: "العربية",
  fr: "Français",
  pt: "Português",
};

export function isLocale(value: string): value is AppLocale {
  return (LOCALES as readonly string[]).includes(value);
}

export function textDirection(locale: AppLocale): "rtl" | "ltr" {
  return RTL_LOCALES.has(locale) ? "rtl" : "ltr";
}
