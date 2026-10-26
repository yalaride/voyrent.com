import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "@/i18n/routing";

const messageLoaders = {
  en: () => import("../../messages/en.json"),
  es: () => import("../../messages/es.json"),
  ar: () => import("../../messages/ar.json"),
  fr: () => import("../../messages/fr.json"),
  pt: () => import("../../messages/pt.json"),
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const messages = (await messageLoaders[locale]()).default;

  return { locale, messages };
});
