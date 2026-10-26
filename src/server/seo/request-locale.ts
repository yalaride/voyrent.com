import "server-only";

import { locale as localeParam } from "next/root-params";

import { isLocale, type AppLocale } from "@/domain/geo/locales";

export async function requestLocale(): Promise<AppLocale | undefined> {
  const value = await localeParam();
  return value && isLocale(value) ? value : undefined;
}
