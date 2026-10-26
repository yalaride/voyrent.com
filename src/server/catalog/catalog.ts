import "server-only";

import { makeFromToken } from "@/domain/catalog/directory";
import { findListing, findListingById, makeOptions, modelOptions, searchListings } from "@/domain/catalog/search";
import { suggestSearches } from "@/domain/catalog/suggestions";
import type { ListingPage, SearchSuggestion, VehicleListing, VehicleSearchQuery } from "@/domain/catalog/types";
import { isRemoteCatalog } from "@/lib/config/env";
import {
  getRemoteListing,
  getRemoteListingById,
  listRemoteMakes,
  listRemoteModels,
  listRemoteSuggestions,
  searchRemoteCatalog,
} from "@/server/catalog/remote-catalog";

/**
 * Catalog service used by pages and `/api/v1` handlers.
 * Transport lives in `remote-catalog`. Validation lives in `domain/catalog/contract`.
 * This file only chooses the source.
 */
export async function searchCatalog(
  query: VehicleSearchQuery,
  options?: { allCities?: boolean },
): Promise<ListingPage> {
  if (!isRemoteCatalog) return searchListings(query, options);
  return searchRemoteCatalog(query);
}

export async function getListing(country: string, city: string, slug: string): Promise<VehicleListing | undefined> {
  if (!isRemoteCatalog) return findListing(country, city, slug);
  return getRemoteListing(country, city, slug);
}

export async function getListingById(id: string): Promise<VehicleListing | undefined> {
  if (!isRemoteCatalog) return findListingById(id);
  return getRemoteListingById(id);
}

export async function getListingForPath(input: {
  country: string;
  city: string;
  makeToken: string;
  modelToken: string;
  id?: string;
}): Promise<VehicleListing | undefined> {
  if (input.id) {
    const byId = await getListingById(input.id);
    if (byId && byId.city === input.city) return byId;
  }

  const make = makeFromToken(input.makeToken);
  if (!make) return undefined;
  return getListing(input.country, input.city, `${make.slug}-${input.modelToken.toLowerCase()}`);
}

export async function listMakes(country: string, city: string) {
  if (!isRemoteCatalog) return makeOptions(country, city);
  return listRemoteMakes(country, city);
}

export async function listModels(country: string, city: string) {
  if (!isRemoteCatalog) return modelOptions(country, city);
  return listRemoteModels(country, city);
}

export async function listSuggestions(country: string, city: string, q: string): Promise<SearchSuggestion[]> {
  if (!isRemoteCatalog) {
    return suggestSearches({ q, makes: makeOptions(country, city), models: modelOptions(country, city) });
  }
  return listRemoteSuggestions(country, city, q);
}
