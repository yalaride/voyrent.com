import "server-only";

import { FAMOUS_SEARCHES } from "@/domain/catalog/famous-searches";
import { BODY_KEYWORDS, joinPhrases } from "@/domain/catalog/keywords";
import { normalizeSearch } from "@/domain/catalog/text";
import type { BodyType, Transmission, VehicleListing } from "@/domain/catalog/types";
import { convertMinor } from "@/domain/currency/format";
import { listMarkets } from "@/domain/geo/markets";

type FleetSeed = {
  make: string;
  makeSlug: string;
  model: string;
  modelSlug: string;
  bodyType: BodyType;
  seats: number;
  dailyUsd: number;
  transmission: Transmission;
  depositRequired: boolean;
  airportDelivery: boolean;
  featured: boolean;
  availability: "all" | "premium";
};

const SUPPLIERS = [
  "Palm Route",
  "Creek & Co",
  "Harbor Keys",
  "Atlas Mile",
  "Northline",
  "Sable Drive",
  "Medina Hire",
  "Corniche Cars",
] as const;

const PRICE_FACTOR: Record<string, number> = {
  dubai: 1.15,
  "abu-dhabi": 1.1,
  paris: 1.25,
  london: 1.28,
  miami: 1.05,
  nice: 1.18,
  "los-angeles": 1.12,
  barcelona: 1.08,
  marrakech: 0.85,
  lisbon: 0.9,
};

/**
 * Illustrative supplier offers. Prices are canonical USD per day and are
 * converted into the market currency when the fixture catalog is built.
 * NestJS will replace this list with live supplier inventory.
 */
const FLEET: readonly FleetSeed[] = [
  { make: "Kia", makeSlug: "kia", model: "Picanto", modelSlug: "picanto", bodyType: "economy", seats: 4, dailyUsd: 32, transmission: "automatic", depositRequired: false, airportDelivery: true, featured: true, availability: "all" },
  { make: "Nissan", makeSlug: "nissan", model: "Sunny", modelSlug: "sunny", bodyType: "economy", seats: 5, dailyUsd: 40, transmission: "automatic", depositRequired: false, airportDelivery: true, featured: false, availability: "all" },
  { make: "Toyota", makeSlug: "toyota", model: "Yaris", modelSlug: "yaris", bodyType: "economy", seats: 5, dailyUsd: 45, transmission: "automatic", depositRequired: false, airportDelivery: true, featured: false, availability: "all" },
  { make: "Hyundai", makeSlug: "hyundai", model: "Accent", modelSlug: "accent", bodyType: "economy", seats: 5, dailyUsd: 38, transmission: "manual", depositRequired: true, airportDelivery: false, featured: false, availability: "all" },
  { make: "Toyota", makeSlug: "toyota", model: "Camry", modelSlug: "camry", bodyType: "sedan", seats: 5, dailyUsd: 72, transmission: "automatic", depositRequired: true, airportDelivery: true, featured: true, availability: "all" },
  { make: "Nissan", makeSlug: "nissan", model: "Altima", modelSlug: "altima", bodyType: "sedan", seats: 5, dailyUsd: 68, transmission: "automatic", depositRequired: true, airportDelivery: true, featured: false, availability: "all" },
  { make: "Toyota", makeSlug: "toyota", model: "RAV4", modelSlug: "rav4", bodyType: "suv", seats: 5, dailyUsd: 88, transmission: "automatic", depositRequired: true, airportDelivery: true, featured: true, availability: "all" },
  { make: "Nissan", makeSlug: "nissan", model: "Patrol", modelSlug: "patrol", bodyType: "suv", seats: 7, dailyUsd: 180, transmission: "automatic", depositRequired: true, airportDelivery: true, featured: true, availability: "all" },
  { make: "Kia", makeSlug: "kia", model: "Carnival", modelSlug: "carnival", bodyType: "van", seats: 7, dailyUsd: 110, transmission: "automatic", depositRequired: true, airportDelivery: true, featured: false, availability: "all" },
  { make: "Hyundai", makeSlug: "hyundai", model: "Staria", modelSlug: "staria", bodyType: "van", seats: 8, dailyUsd: 120, transmission: "automatic", depositRequired: true, airportDelivery: false, featured: false, availability: "all" },
  { make: "Ford", makeSlug: "ford", model: "Mustang", modelSlug: "mustang", bodyType: "sports", seats: 4, dailyUsd: 150, transmission: "automatic", depositRequired: true, airportDelivery: true, featured: true, availability: "all" },
  { make: "Mercedes-Benz", makeSlug: "mercedes-benz", model: "S-Class", modelSlug: "s-class", bodyType: "luxury", seats: 5, dailyUsd: 320, transmission: "automatic", depositRequired: true, airportDelivery: true, featured: true, availability: "premium" },
  { make: "Range Rover", makeSlug: "range-rover", model: "Vogue", modelSlug: "vogue", bodyType: "luxury", seats: 5, dailyUsd: 360, transmission: "automatic", depositRequired: true, airportDelivery: true, featured: false, availability: "premium" },
  { make: "Porsche", makeSlug: "porsche", model: "911", modelSlug: "911", bodyType: "sports", seats: 2, dailyUsd: 480, transmission: "automatic", depositRequired: true, airportDelivery: true, featured: true, availability: "premium" },
  { make: "BMW", makeSlug: "bmw", model: "4 Series", modelSlug: "4-series", bodyType: "convertible", seats: 4, dailyUsd: 210, transmission: "automatic", depositRequired: true, airportDelivery: true, featured: false, availability: "premium" },
  { make: "Chevrolet", makeSlug: "chevrolet", model: "Corvette", modelSlug: "corvette", bodyType: "sports", seats: 2, dailyUsd: 340, transmission: "automatic", depositRequired: true, airportDelivery: true, featured: false, availability: "premium" },
];

function supplierFor(citySlug: string, index: number): string {
  const hash = [...citySlug].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return SUPPLIERS[(hash + index) % SUPPLIERS.length] ?? SUPPLIERS[0];
}

function searchTextFor(seed: FleetSeed): string {
  const phrases = [
    seed.make,
    seed.model,
    seed.makeSlug,
    seed.modelSlug,
    seed.bodyType,
    joinPhrases(BODY_KEYWORDS[seed.bodyType]),
  ];

  if (!seed.depositRequired) {
    const match = FAMOUS_SEARCHES.find((item) => item.slug === "no-deposit");
    if (match) phrases.push(joinPhrases(match.keywords));
  }

  if (seed.airportDelivery) {
    const match = FAMOUS_SEARCHES.find((item) => item.slug === "airport");
    if (match) phrases.push(joinPhrases(match.keywords));
  }

  if (seed.seats >= 7) {
    const match = FAMOUS_SEARCHES.find((item) => item.slug === "seven-seater");
    if (match) phrases.push(joinPhrases(match.keywords));
  }

  phrases.push(joinPhrases(FAMOUS_SEARCHES.find((item) => item.slug === "monthly")!.keywords));

  if (seed.bodyType === "economy") {
    phrases.push(joinPhrases(FAMOUS_SEARCHES.find((item) => item.slug === "cheap-daily")!.keywords));
  }

  return normalizeSearch(phrases.join(" "));
}

function buildListings(): VehicleListing[] {
  const listings: VehicleListing[] = [];

  for (const market of listMarkets()) {
    FLEET.forEach((seed, index) => {
      if (seed.availability === "premium" && !market.premium) {
        return;
      }

      const factor = PRICE_FACTOR[market.city] ?? 1;
      const dailyPriceMinor = convertMinor(Math.round(seed.dailyUsd * factor * 100), "USD", market.currency);

      listings.push({
        id: `${market.country}-${market.city}-${seed.makeSlug}-${seed.modelSlug}`,
        slug: `${seed.makeSlug}-${seed.modelSlug}`,
        country: market.country,
        city: market.city,
        currency: market.currency,
        make: seed.make,
        makeSlug: seed.makeSlug,
        model: seed.model,
        modelSlug: seed.modelSlug,
        bodyType: seed.bodyType,
        seats: seed.seats,
        transmission: seed.transmission,
        dailyPriceMinor,
        monthlyPriceMinor: dailyPriceMinor * 22,
        depositRequired: seed.depositRequired,
        airportDelivery: seed.airportDelivery,
        supplier: supplierFor(market.city, index),
        featured: seed.featured,
        searchText: searchTextFor(seed),
      });
    });
  }

  return listings;
}

const LISTINGS = buildListings();

export function allListings(): readonly VehicleListing[] {
  return LISTINGS;
}

export function listingsForMarket(country: string, city: string): VehicleListing[] {
  return LISTINGS.filter(
    (listing) => listing.country === country.toLowerCase() && listing.city === city.toLowerCase(),
  );
}

export function listingsForCountry(country: string): VehicleListing[] {
  return LISTINGS.filter((listing) => listing.country === country.toLowerCase());
}
