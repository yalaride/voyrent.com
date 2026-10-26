import type { MetadataRoute } from "next";

import { LOCALES, type AppLocale, DEFAULT_LOCALE } from "@/domain/geo/locales";
import { indexableStaticPaths, parseRentPath } from "@/domain/routing/rent-paths";
import { absoluteUrl } from "@/server/seo/origins";

function localizedPath(locale: AppLocale, path: string): string {
  return locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const home = LOCALES.map((locale) => ({
    url: absoluteUrl("ae", localizedPath(locale, "/")),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  const pages = indexableStaticPaths().flatMap((slug) => {
    const view = parseRentPath(slug);
    if (!view) return [];
    const path = `/${slug.join("/")}`;

    return LOCALES.map((locale) => ({
      url: absoluteUrl(view.market.country, localizedPath(locale, path)),
      changeFrequency: "daily" as const,
      priority: view.kind === "city" ? 1 : 0.7,
    }));
  });

  return [...home, ...pages];
}
