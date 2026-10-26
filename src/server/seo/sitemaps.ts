import "server-only";

import { DEFAULT_LOCALE, LOCALES, type AppLocale } from "@/domain/geo/locales";
import { indexableStaticPaths, parseRentPath, type RentView } from "@/domain/routing/rent-paths";
import { absoluteUrl, siteOrigin } from "@/server/seo/origins";

export const SITEMAP_IDS = ["rent-locations", "rent-brands", "rent-landings"] as const;

type SitemapId = (typeof SITEMAP_IDS)[number];

type Entry = {
  path: string;
  priority: number;
};

function isSitemapId(id: string): id is SitemapId {
  return (SITEMAP_IDS as readonly string[]).includes(id);
}

function includes(id: SitemapId, view: RentView): boolean {
  if (id === "rent-locations") return view.kind === "country" || view.kind === "city";
  if (id === "rent-brands") return view.kind === "make";
  return view.kind === "landing";
}

function priorityFor(view: RentView): number {
  if (view.kind === "city") return 1;
  if (view.kind === "country") return 0.9;
  return 0.7;
}

function localizedPath(locale: AppLocale, path: string): string {
  return locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;
}

export function sitemapIndexXml(): string {
  const origin = siteOrigin();
  const lastmod = new Date().toISOString().slice(0, 10);
  const items = SITEMAP_IDS.map(
    (id) => `  <sitemap>\n    <loc>${origin}/sitemap/${id}.xml</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`,
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
}

export function sitemapUrlsetXml(id: string): string | undefined {
  if (!isSitemapId(id)) return undefined;

  const lastmod = new Date().toISOString().slice(0, 10);
  const pages: Entry[] = [];

  if (id === "rent-locations") {
    pages.push({ path: "/", priority: 1 });
  }

  for (const slug of indexableStaticPaths()) {
    const view = parseRentPath(slug);
    if (!view || !includes(id, view)) continue;
    pages.push({ path: `/${slug.join("/")}`, priority: priorityFor(view) });
  }

  const urls = LOCALES.flatMap((locale) =>
    pages.map((page) => {
      const loc = absoluteUrl(localizedPath(locale, page.path));
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`;
    }),
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
