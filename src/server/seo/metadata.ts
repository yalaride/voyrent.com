import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/domain/geo/locales";
import { LOCALES } from "@/domain/geo/locales";
import { localize, type Market } from "@/domain/geo/markets";
import { makeBySlug } from "@/domain/catalog/directory";
import type { VehicleListing } from "@/domain/catalog/types";
import { catalogPath, type LandingId, type RentView } from "@/domain/routing/rent-paths";
import { DEFAULT_LOCALE } from "@/domain/geo/locales";
import { serverEnv } from "@/lib/config/env";
import { absoluteUrl, siteOrigin } from "@/server/seo/origins";

const REGION: Record<string, string> = {
  ae: "AE",
  sa: "SA",
  ma: "MA",
  es: "ES",
  fr: "FR",
  pt: "PT",
  gb: "GB",
  us: "US",
};

function localePath(locale: AppLocale, path: string): string {
  return locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;
}

function localizedUrl(locale: AppLocale, path: string): string {
  return absoluteUrl(localePath(locale, path));
}

function languageAlternates(country: string, path: string): Record<string, string> {
  const region = REGION[country] ?? country.toUpperCase();
  const languages: Record<string, string> = {
    "x-default": localizedUrl(DEFAULT_LOCALE, path),
  };

  for (const locale of LOCALES) {
    const url = localizedUrl(locale, path);
    languages[locale] = url;
    languages[`${locale}-${region}`] = url;
  }

  return languages;
}

function titled(value: string): string {
  return `${value} · GleeCars`;
}

function robotsFor(indexable: boolean): Metadata["robots"] {
  return indexable
    ? { index: true, follow: true }
    : { index: false, follow: true };
}

function landingLabel(landing: LandingId, search: (key: string) => string, bodies: (key: string) => string): string {
  switch (landing) {
    case "economy":
    case "sedan":
    case "suv":
    case "luxury":
    case "sports":
    case "van":
    case "convertible":
      return bodies(landing);
    case "no-deposit":
      return search("famous.noDeposit");
    case "monthly":
      return search("famous.monthly");
    case "seven-seater":
      return search("famous.sevenSeater");
    case "airport":
      return search("famous.airport");
  }
}

export async function buildRentMetadata(input: {
  locale: AppLocale;
  view: RentView;
  path: string;
  indexable: boolean;
  listing?: VehicleListing;
}): Promise<Metadata> {
  const { market } = input.view;
  const city =
    input.view.kind === "country"
      ? localize(market.countryNames, input.locale)
      : localize(market.cityNames, input.locale);
  const meta = await getTranslations({ locale: input.locale, namespace: "Meta" });
  const search = await getTranslations({ locale: input.locale, namespace: "Search" });
  const bodies = await getTranslations({ locale: input.locale, namespace: "BodyTypes" });
  let title = meta("marketTitle", { city });
  let description = meta("marketDescription", { city });

  if (input.view.kind === "make") {
    const makeName = makeBySlug(input.view.make)?.name ?? input.view.make;
    title = meta("makeTitle", { make: makeName, city });
    description = meta("makeDescription", { make: makeName, city });
  }

  if (input.view.kind === "model") {
    const makeName = makeBySlug(input.view.make)?.name ?? input.view.make;
    const modelName = input.view.model.replaceAll("-", " ");
    title = meta("modelTitle", { make: makeName, model: modelName, city });
    description = meta("modelDescription", { make: makeName, model: modelName, city });
  }

  if (input.view.kind === "landing") {
    const filter = landingLabel(input.view.landing, search, bodies);
    title = meta("filteredTitle", { filter, city });
    description = meta("filteredDescription", { filter, city });
  }

  if (input.listing) {
    const name = `${input.listing.make} ${input.listing.model}`;
    title = input.listing.seo?.title?.[input.locale] ?? meta("listingTitle", { name, city });
    description =
      input.listing.seo?.description?.[input.locale] ?? meta("marketDescription", { city });
  }

  const canonical = absoluteUrl(localePath(input.locale, input.path));
  const ogImage = serverEnv.NEXT_PUBLIC_OG_IMAGE;

  return {
    title: { absolute: titled(title) },
    description,
    alternates: {
      canonical,
      languages: languageAlternates(market.country, input.path),
    },
    robots: robotsFor(input.indexable),
    openGraph: {
      type: input.listing ? "article" : "website",
      url: canonical,
      title: titled(title),
      description,
      siteName: "GleeCars",
      locale: input.locale === "ar" ? "ar_AE" : input.locale === "en" ? "en_US" : input.locale,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: titled(title),
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export function rootVerification(): Metadata["verification"] {
  return {
    google: serverEnv.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: serverEnv.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": serverEnv.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  };
}

export function organizationJsonLd() {
  const origin = siteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GleeCars",
    url: origin,
  };
}

export function websiteJsonLd(market: Market, locale: AppLocale) {
  const path = catalogPath(market.city);
  const url = absoluteUrl(localePath(locale, path));
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GleeCars",
    url: siteOrigin(),
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}?keyword={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function vehicleJsonLd(listing: VehicleListing, locale: AppLocale, pageUrl: string) {
  const price = (listing.dailyPriceMinor / 100).toFixed(0);
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${listing.make} ${listing.model}`,
    brand: { "@type": "Brand", name: listing.make },
    vehicleConfiguration: listing.bodyType,
    vehicleSeatingCapacity: listing.seats,
    url: pageUrl,
    offers: {
      "@type": "Offer",
      priceCurrency: listing.currency,
      price,
      availability: "https://schema.org/InStock",
      url: pageUrl,
    },
  };
}
