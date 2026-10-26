import "server-only";

import {
  listingPageSchema,
  makeListSchema,
  modelListSchema,
  suggestionListSchema,
  vehicleListingSchema,
} from "@/domain/catalog/contract";
import type { VehicleSearchQuery } from "@/domain/catalog/types";
import { catalogQuery, fetchUpstream, rejectContract } from "@/server/catalog/upstream";

export async function searchRemoteCatalog(query: VehicleSearchQuery) {
  const parsed = listingPageSchema.safeParse(await fetchUpstream(catalogQuery("/v1/catalog/search", query)));
  if (!parsed.success) rejectContract(parsed.error);
  return parsed.data;
}

export async function getRemoteListing(country: string, city: string, slug: string) {
  const payload = await fetchUpstream(
    `/v1/catalog/listings/${encodeURIComponent(slug)}?country=${encodeURIComponent(country)}&city=${encodeURIComponent(city)}`,
  );

  if (payload == null) {
    return undefined;
  }

  const parsed = vehicleListingSchema.safeParse(payload);
  if (!parsed.success) rejectContract(parsed.error);
  return parsed.data;
}

export async function getRemoteListingById(id: string) {
  const payload = await fetchUpstream(`/v1/catalog/listings/${encodeURIComponent(id)}`);
  if (payload == null) return undefined;
  const parsed = vehicleListingSchema.safeParse(payload);
  if (!parsed.success) rejectContract(parsed.error);
  return parsed.data;
}

export async function listRemoteMakes(country: string, city: string) {
  const parsed = makeListSchema.safeParse(
    await fetchUpstream(`/v1/catalog/makes?country=${encodeURIComponent(country)}&city=${encodeURIComponent(city)}`),
  );
  if (!parsed.success) rejectContract(parsed.error);
  return parsed.data;
}

export async function listRemoteModels(country: string, city: string) {
  const parsed = modelListSchema.safeParse(
    await fetchUpstream(`/v1/catalog/models?country=${encodeURIComponent(country)}&city=${encodeURIComponent(city)}`),
  );
  if (!parsed.success) rejectContract(parsed.error);
  return parsed.data;
}

export async function listRemoteSuggestions(country: string, city: string, q: string) {
  const parsed = suggestionListSchema.safeParse(
    await fetchUpstream(
      `/v1/catalog/suggestions?country=${encodeURIComponent(country)}&city=${encodeURIComponent(city)}&q=${encodeURIComponent(q)}`,
    ),
  );
  if (!parsed.success) rejectContract(parsed.error);
  return parsed.data;
}
