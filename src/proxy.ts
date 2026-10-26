import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { isLocale, type AppLocale } from "@/domain/geo/locales";
import { getMarket } from "@/domain/geo/markets";
import { cityRentPath } from "@/domain/routing/rent-paths";
import { routing } from "@/i18n/routing";
import { pathCanonical } from "@/server/rent/resolve-rent";

const handleLocale = createMiddleware(routing);

function legacyMarketRedirect(request: NextRequest): NextResponse | undefined {
  const match = request.nextUrl.pathname.match(/^\/(?:(en|es|ar|fr|pt)\/)?([a-z]{2})\/([a-z0-9-]+)\/?$/);
  if (!match?.[2] || !match[3]) return undefined;

  const market = getMarket(match[2], match[3]);
  if (!market) return undefined;

  const locale = match[1];
  const path = locale && locale !== "en" ? `/${locale}${cityRentPath(market.city)}` : cityRentPath(market.city);
  const destination = new URL(path, request.nextUrl.origin);
  destination.search = request.nextUrl.search;
  return NextResponse.redirect(destination, 308);
}

/**
 * Locale prefix, then legacy market paths and canonical query redirects.
 * API routes and static files are excluded by the matcher.
 */
export default function proxy(request: NextRequest) {
  return legacyMarketRedirect(request) ?? canonicalQueryRedirect(request) ?? handleLocale(request);
}

function canonicalQueryRedirect(request: NextRequest): NextResponse | undefined {
  const { locale, slug } = splitLocale(request.nextUrl.pathname);
  if (slug.length === 0) return undefined;

  const raw = Object.fromEntries(request.nextUrl.searchParams.entries());
  const target = pathCanonical(slug, raw, locale);
  if (!target) return undefined;

  const prefixed = locale === "en" ? target : `/${locale}${target}`;
  const destination = new URL(prefixed, request.nextUrl.origin);
  return NextResponse.redirect(destination, 308);
}

function splitLocale(pathname: string): { locale: AppLocale; slug: string[] } {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first && isLocale(first)) {
    return { locale: first, slug: segments.slice(1) };
  }

  return { locale: "en", slug: segments };
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
