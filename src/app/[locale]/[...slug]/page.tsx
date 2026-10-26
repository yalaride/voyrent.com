import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { makeFromToken } from "@/domain/catalog/directory";
import type { RawSearchParams } from "@/domain/catalog/params";
import { DEFAULT_LOCALE, isLocale, LOCALES } from "@/domain/geo/locales";
import { catalogPath, indexableStaticPaths, listingPath, queryFromView } from "@/domain/routing/rent-paths";
import { ListingDetail } from "@/features/catalog/listing-detail";
import { MarketHome } from "@/features/home/market-home";
import { SearchScreen } from "@/features/search/search-screen";
import { AppShell } from "@/features/shell/app-shell";
import { redirect } from "@/i18n/navigation";
import { getListingForPath } from "@/server/catalog/catalog";
import { isIndexable, pathCanonical, rentView, searchQueryFor } from "@/server/rent/resolve-rent";
import { buildRentMetadata, vehicleJsonLd, websiteJsonLd } from "@/server/seo/metadata";
import { absoluteUrl } from "@/server/seo/origins";
import { Skeleton } from "@/components/ui/skeleton";

type PageParams = { locale: string; slug: string[] };

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => indexableStaticPaths().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<RawSearchParams>;
}): Promise<Metadata> {
  const [{ locale, slug }, raw] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) return {};
  const view = rentView(slug);
  if (!view) return {};
  const query = searchQueryFor(view, raw, locale);
  const listing =
    view.kind === "listing"
      ? await getListingForPath({
          country: view.market.country,
          city: view.market.city,
          makeToken: view.makeToken,
          modelToken: view.modelToken,
          id: typeof raw.id === "string" ? raw.id : undefined,
        })
      : undefined;
  const path =
    view.kind === "listing" && listing
      ? listingPath({ city: listing.city, make: listing.make, model: listing.model, id: listing.id })
      : catalogPath(view.market.city, queryFromView(view));

  return buildRentMetadata({
    locale,
    view,
    path,
    indexable: isIndexable(view, query),
    listing,
  });
}

export default function RentRoute({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<RawSearchParams>;
}) {
  return (
    <Suspense fallback={<Skeleton className="mx-auto mt-8 h-80 max-w-6xl rounded-2xl" />}>
      <RentRouteContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function RentRouteContent({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<RawSearchParams>;
}) {
  const [{ locale, slug }, raw] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const view = rentView(slug);
  if (!view) notFound();

  const canonical = pathCanonical(slug, raw, locale);
  if (canonical) {
    redirect({ href: canonical, locale });
  }

  const query = searchQueryFor(view, raw, locale);

  if (view.kind === "listing") {
    const listing = await getListingForPath({
      country: view.market.country,
      city: view.market.city,
      makeToken: view.makeToken,
      modelToken: view.modelToken,
      id: typeof raw.id === "string" ? raw.id : undefined,
    });
    if (!listing || !makeFromToken(view.makeToken)) notFound();
    const path = listingPath({
      city: listing.city,
      make: listing.make,
      model: listing.model,
      id: listing.id,
    });
    const pageUrl = absoluteUrl(
      listing.country,
      locale === DEFAULT_LOCALE ? path : `/${locale}${path}`,
    );

    return (
      <AppShell locale={locale} market={view.market}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleJsonLd(listing, locale, pageUrl)) }} />
        <ListingDetail market={view.market} locale={locale} listing={listing} />
      </AppShell>
    );
  }

  return (
    <AppShell locale={locale} market={view.market}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd(view.market, locale)) }}
      />
      {view.kind === "city" && isIndexable(view, query) ? (
        <MarketHome market={view.market} locale={locale} />
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-8">
          <SearchScreen market={view.market} locale={locale} query={query} />
        </div>
      )}
    </AppShell>
  );
}
