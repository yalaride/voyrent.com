import { isBodyType, type VehicleSearchQuery } from "@/domain/catalog/types";

export type { VehicleSearchQuery };
import type { AppLocale } from "@/domain/geo/locales";
import { getMarket, type Market } from "@/domain/geo/markets";

export type RawSearchParams = Record<string, string | string[] | undefined>;

function read(raw: RawSearchParams, key: string): string | undefined {
  const value = raw[key];
  const first = Array.isArray(value) ? value[0] : value;

  if (!first) {
    return undefined;
  }

  const trimmed = first.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function positiveInt(value: string | undefined): number | undefined {
  if (!value || !/^\d+$/.test(value)) {
    return undefined;
  }

  const parsed = Number(value);
  return parsed > 0 ? parsed : undefined;
}

export function parseVehicleSearch(
  raw: RawSearchParams,
  market: Market,
  locale: AppLocale,
  options?: { limit?: number },
): VehicleSearchQuery {
  const make = read(raw, "make")?.toLowerCase();
  const model = read(raw, "model")?.toLowerCase();
  const bodyTypeValue = (read(raw, "bodyType") ?? read(raw, "body"))?.toLowerCase();
  const sortValue = read(raw, "order") ?? read(raw, "sort");
  const deposit = read(raw, "deposit");
  const term = read(raw, "term");
  const pickup = read(raw, "pickup");
  const seats = positiveInt(read(raw, "seats"));
  const page = positiveInt(read(raw, "page")) ?? 1;
  const requestedLimit = positiveInt(read(raw, "limit")) ?? options?.limit ?? 12;
  const keyword = read(raw, "keyword") ?? read(raw, "q");
  const sort = sortValue === "price_low" || sortValue === "price_asc"
    ? "price_asc"
    : sortValue === "price_high" || sortValue === "price_desc"
      ? "price_desc"
      : "recommended";

  return {
    country: market.country,
    city: market.city,
    locale,
    make,
    model,
    bodyType: bodyTypeValue && isBodyType(bodyTypeValue) ? bodyTypeValue : undefined,
    q: keyword?.slice(0, 80),
    deposit: deposit === "none" ? "none" : undefined,
    term: term === "monthly" ? "monthly" : undefined,
    pickup: pickup === "airport" ? "airport" : undefined,
    seats,
    sort,
    page,
    limit: Math.min(requestedLimit, 48),
  };
}

export function parseMarketSearch(
  raw: RawSearchParams,
  locale: AppLocale,
): { market: Market; query: VehicleSearchQuery } | undefined {
  const country = read(raw, "country");
  const city = read(raw, "city");

  if (!country || !city) {
    return undefined;
  }

  const market = getMarket(country, city);

  if (!market) {
    return undefined;
  }

  return { market, query: parseVehicleSearch(raw, market, locale) };
}

export function searchQueryKey(query: VehicleSearchQuery): string {
  return [
    query.make ?? "",
    query.model ?? "",
    query.bodyType ?? "",
    query.q ?? "",
    query.deposit ?? "",
    query.term ?? "",
    query.pickup ?? "",
    query.seats ?? "",
    query.sort,
    query.page,
  ].join("|");
}
