import { makeBySlug, makeFromToken, makePrefix, pathToken } from "@/domain/catalog/directory";
import type { BodyType, VehicleSearchQuery } from "@/domain/catalog/types";
import { listMarkets, type Market } from "@/domain/geo/markets";

export const LANDING_IDS = [
  "economy",
  "sedan",
  "suv",
  "luxury",
  "sports",
  "van",
  "convertible",
  "no-deposit",
  "monthly",
  "seven-seater",
  "airport",
] as const;

export type LandingId = (typeof LANDING_IDS)[number];

export type RentView =
  | { kind: "city"; market: Market }
  | { kind: "make"; market: Market; make: string }
  | { kind: "model"; market: Market; make: string; model: string }
  | { kind: "landing"; market: Market; landing: LandingId }
  | { kind: "listing"; market: Market; makeToken: string; modelToken: string };

const CITIES = [...listMarkets()].sort((left, right) => right.city.length - left.city.length);

function marketByCity(city: string): Market | undefined {
  return CITIES.find((market) => market.city === city);
}

export function landingSegment(landing: LandingId, city: string): string {
  switch (landing) {
    case "economy":
      return `rent-cheap-economy-cars-${city}`;
    case "sedan":
      return `rent-sedan-cars-in-${city}`;
    case "suv":
      return `rent-4x4-suvs-in-${city}`;
    case "luxury":
      return `rent-luxury-car-rental-${city}`;
    case "sports":
      return `rent-sports-cars-in-${city}`;
    case "convertible":
      return `rent-convertible-cars-${city}`;
    case "van":
      return `van-rental-${city}`;
    case "no-deposit":
      return `rent-a-car-${city}-without-deposit`;
    case "monthly":
      return `rent-a-car-monthly-${city}-deals`;
    case "seven-seater":
      return `7-seater-car-rental-${city}`;
    case "airport":
      return `rent-a-car-${city}-airport-delivery`;
  }
}

export function cityRentPath(city: string): string {
  return `/rent-a-car-${city}`;
}

export function makeRentPath(make: string, city: string): string {
  return `/rent-${make}-car-${city}`;
}

export function modelRentPath(make: string, model: string, city: string): string {
  return `/rent-${make}-${model}-${city}`;
}

export function listingPath(input: {
  city: string;
  make: string;
  model: string;
  id: string;
}): string {
  const params = new URLSearchParams({ id: input.id });
  return `/details/index/search-car-rentals-${input.city}/${pathToken(input.make)}/${pathToken(input.model)}?${params}`;
}

function landingQuery(landing: LandingId): Partial<VehicleSearchQuery> {
  switch (landing) {
    case "economy":
    case "sedan":
    case "suv":
    case "luxury":
    case "sports":
    case "van":
    case "convertible":
      return { bodyType: landing };
    case "no-deposit":
      return { deposit: "none" };
    case "monthly":
      return { term: "monthly" };
    case "seven-seater":
      return { seats: 7 };
    case "airport":
      return { pickup: "airport" };
  }
}

function parseSegment(segment: string): RentView | undefined {
  for (const market of CITIES) {
    for (const landing of LANDING_IDS) {
      if (segment === landingSegment(landing, market.city)) {
        return { kind: "landing", market, landing };
      }
    }

    if (segment === `rent-a-car-${market.city}`) {
      return { kind: "city", market };
    }
  }

  for (const market of CITIES) {
    const suffix = `-${market.city}`;
    if (!segment.endsWith(suffix) || !segment.startsWith("rent-")) {
      continue;
    }

    const rest = segment.slice("rent-".length, -suffix.length);
    const make = makePrefix(rest);
    if (!make) {
      continue;
    }

    const after = rest.slice(make.slug.length);
    if (after === "-car") {
      return { kind: "make", market, make: make.slug };
    }

    if (after.startsWith("-") && after !== "-car") {
      return { kind: "model", market, make: make.slug, model: after.slice(1) };
    }
  }

  return undefined;
}

export function parseRentPath(slug: string[]): RentView | undefined {
  if (slug.length === 1 && slug[0]) {
    return parseSegment(slug[0]);
  }

  if (
    slug.length === 5 &&
    slug[0] === "details" &&
    slug[1] === "index" &&
    slug[2]?.startsWith("search-car-rentals-")
  ) {
    const city = slug[2].slice("search-car-rentals-".length);
    const market = marketByCity(city);
    const makeToken = slug[3];
    const modelToken = slug[4];

    if (!market || !makeToken || !modelToken || !makeFromToken(makeToken)) {
      return undefined;
    }

    return { kind: "listing", market, makeToken, modelToken };
  }

  return undefined;
}

export function queryFromView(view: RentView): Partial<VehicleSearchQuery> {
  switch (view.kind) {
    case "city":
      return {};
    case "make":
      return { make: view.make };
    case "model":
      return { make: view.make, model: view.model };
    case "landing":
      return landingQuery(view.landing);
    case "listing":
      return {};
  }
}

export function catalogPath(city: string, query: Partial<VehicleSearchQuery> = {}): string {
  let path = cityRentPath(city);
  const params = new URLSearchParams();
  const encoded = new Set<string>();

  if (query.make && query.model) {
    path = modelRentPath(query.make, query.model, city);
    encoded.add("make");
    encoded.add("model");
  } else if (query.make) {
    path = makeRentPath(query.make, city);
    encoded.add("make");
  } else if (query.bodyType) {
    path = `/${landingSegment(query.bodyType, city)}`;
    encoded.add("body");
  } else if (query.deposit === "none") {
    path = `/${landingSegment("no-deposit", city)}`;
    encoded.add("deposit");
  } else if (query.term === "monthly") {
    path = `/${landingSegment("monthly", city)}`;
    encoded.add("term");
  } else if (query.seats && query.seats >= 7) {
    path = `/${landingSegment("seven-seater", city)}`;
    encoded.add("seats");
  } else if (query.pickup === "airport") {
    path = `/${landingSegment("airport", city)}`;
    encoded.add("pickup");
  }

  if (query.bodyType && !encoded.has("body")) params.set("body", query.bodyType);
  if (query.deposit === "none" && !encoded.has("deposit")) params.set("deposit", "none");
  if (query.term === "monthly" && !encoded.has("term")) params.set("term", "monthly");
  if (query.pickup === "airport" && !encoded.has("pickup")) params.set("pickup", "airport");
  if (query.seats && query.seats >= 7 && !encoded.has("seats")) params.set("seats", String(query.seats));
  if (query.q) params.set("keyword", query.q);
  if (query.page && query.page > 1) params.set("page", String(query.page));
  if (query.sort === "price_asc") params.set("order", "price_low");
  if (query.sort === "price_desc") params.set("order", "price_high");

  const search = params.toString();
  return search ? `${path}?${search}` : path;
}

export function indexableStaticPaths(): string[][] {
  const paths: string[][] = [];

  for (const market of listMarkets()) {
    paths.push([`rent-a-car-${market.city}`]);

    for (const landing of LANDING_IDS) {
      paths.push([landingSegment(landing, market.city)]);
    }

    for (const make of ["kia", "nissan", "toyota", "hyundai", "ford", "bmw", "mercedes-benz", "porsche", "range-rover", "chevrolet"] as const) {
      if (make === "bmw" || make === "mercedes-benz" || make === "porsche" || make === "range-rover" || make === "chevrolet") {
        if (!market.premium) continue;
      }
      paths.push([`rent-${make}-car-${market.city}`]);
    }
  }

  return paths;
}

export function makeToken(slug: string): string {
  return pathToken(makeBySlug(slug)?.name ?? slug);
}

export type { BodyType };
