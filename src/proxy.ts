import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { isLocale, LOCALES, type AppLocale } from "@/domain/geo/locales";
import { getMarket } from "@/domain/geo/markets";
import { hostnameForCountry, isAppHostname, isLocalHostname } from "@/domain/routing/hosts";
import { cityRentPath, parseRentPath } from "@/domain/routing/rent-paths";
import { routing } from "@/i18n/routing";
import { pathCanonical } from "@/server/rent/resolve-rent";

const handleLocale = createMiddleware(routing);

function requestHost(request: NextRequest): string {
  return (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "").split(":")[0] ?? "";
}

function shiftCountryHost(request: NextRequest): NextResponse | undefined {
  const hostname = requestHost(request);
  if (!hostname || !isAppHostname(hostname)) return undefined;

  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0];
  const slug = maybeLocale && (LOCALES as readonly string[]).includes(maybeLocale) ? segments.slice(1) : segments;
  const view = parseRentPath(slug);
  if (!view) return undefined;

  const targetHost = hostnameForCountry(view.market.country, hostname);
  if (targetHost === hostname) return undefined;

  const destination = new URL(pathname + request.nextUrl.search, browsingOrigin(request, targetHost));
  return new NextResponse(null, {
    status: 308,
    headers: {
      Location: destination.toString(),
    },
  });
}

function browsingOrigin(request: NextRequest, targetHost: string): string {
  if (isLocalHostname(requestHost(request))) {
    const port = request.nextUrl.port ? `:${request.nextUrl.port}` : "";
    // `localhost` is the dev server's own host, so Next collapses a redirect
    // to it into a same-host path. `ae.localhost` stays a real host change.
    const host = targetHost === "localhost" ? "ae.localhost" : targetHost;
    return `${request.nextUrl.protocol}//${host}${port}`;
  }

  return `https://${targetHost}`;
}

function legacyMarketRedirect(request: NextRequest): NextResponse | undefined {
  const match = request.nextUrl.pathname.match(/^\/(?:(en|es|ar|fr|pt)\/)?([a-z]{2})\/([a-z0-9-]+)\/?$/);
  if (!match?.[2] || !match[3]) return undefined;

  const market = getMarket(match[2], match[3]);
  if (!market) return undefined;

  const host = requestHost(request);
  const locale = match[1];
  const path = locale && locale !== "en" ? `/${locale}${cityRentPath(market.city)}` : cityRentPath(market.city);
  const origin = browsingOrigin(request, hostnameForCountry(market.country, host));
  const destination = new URL(path, origin);
  destination.search = request.nextUrl.search;
  return NextResponse.redirect(destination, 308);
}

/**
 * Locale prefix, then country-host shift for markets that live on another domain.
 * API routes and static files are excluded by the matcher.
 */
export default function proxy(request: NextRequest) {
  return shiftCountryHost(request) ?? legacyMarketRedirect(request) ?? canonicalQueryRedirect(request) ?? handleLocale(request);
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
