import "server-only";

import { listingsForMarket, allListings } from "@/domain/catalog/fleet";
import { normalizeSearch } from "@/domain/catalog/text";
import type { ListingPage, MakeOption, ModelOption, VehicleListing, VehicleSearchQuery } from "@/domain/catalog/types";

function matches(listing: VehicleListing, query: VehicleSearchQuery): boolean {
  if (query.make && listing.makeSlug !== query.make) return false;
  if (query.model && listing.modelSlug !== query.model) return false;
  if (query.bodyType && listing.bodyType !== query.bodyType) return false;
  if (query.deposit === "none" && listing.depositRequired) return false;
  if (query.term === "monthly" && listing.monthlyPriceMinor == null) return false;
  if (query.pickup === "airport" && !listing.airportDelivery) return false;
  if (query.seats && listing.seats < query.seats) return false;

  if (query.q) {
    const haystack = listing.searchText;
    const tokens = normalizeSearch(query.q).split(/\s+/).filter(Boolean);
    if (!tokens.every((token) => haystack.includes(token))) return false;
  }

  return true;
}

function compare(left: VehicleListing, right: VehicleListing, query: VehicleSearchQuery): number {
  if (query.sort === "price_desc") {
    return right.dailyPriceMinor - left.dailyPriceMinor || left.id.localeCompare(right.id);
  }

  if (query.sort === "price_asc") {
    return left.dailyPriceMinor - right.dailyPriceMinor || left.id.localeCompare(right.id);
  }

  if (left.featured !== right.featured) {
    return left.featured ? -1 : 1;
  }

  return left.dailyPriceMinor - right.dailyPriceMinor || left.id.localeCompare(right.id);
}

export function searchListings(query: VehicleSearchQuery): ListingPage {
  const matched = listingsForMarket(query.country, query.city)
    .filter((listing) => matches(listing, query))
    .sort((left, right) => compare(left, right, query));

  const start = (query.page - 1) * query.limit;

  return {
    items: matched.slice(start, start + query.limit),
    total: matched.length,
    page: query.page,
    limit: query.limit,
  };
}

export function findListing(country: string, city: string, slug: string): VehicleListing | undefined {
  return listingsForMarket(country, city).find((listing) => listing.slug === slug);
}

export function findListingById(id: string): VehicleListing | undefined {
  return allListings().find((listing) => listing.id === id);
}

export function makeOptions(country: string, city: string): MakeOption[] {
  const seen = new Map<string, MakeOption>();

  for (const listing of listingsForMarket(country, city)) {
    if (!seen.has(listing.makeSlug)) {
      seen.set(listing.makeSlug, { slug: listing.makeSlug, name: listing.make });
    }
  }

  return [...seen.values()].sort((left, right) => left.name.localeCompare(right.name));
}

export function modelOptions(country: string, city: string): ModelOption[] {
  const seen = new Map<string, ModelOption>();

  for (const listing of listingsForMarket(country, city)) {
    const key = `${listing.makeSlug}:${listing.modelSlug}`;
    if (!seen.has(key)) {
      seen.set(key, {
        slug: listing.modelSlug,
        name: listing.model,
        makeSlug: listing.makeSlug,
        makeName: listing.make,
      });
    }
  }

  return [...seen.values()].sort((left, right) =>
    left.makeName.localeCompare(right.makeName) || left.name.localeCompare(right.name),
  );
}
