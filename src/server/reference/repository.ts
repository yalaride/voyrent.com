import "server-only";

import { CURRENCY_CODES, CURRENCY_PER_USD } from "@/domain/currency/currencies";
import { LOCALES, LOCALE_NAMES } from "@/domain/geo/locales";
import { COUNTRIES, type Market } from "@/domain/geo/markets";
import { isRemoteCatalog } from "@/lib/config/env";
import {
  fetchRemoteCurrencies,
  fetchRemoteLanguages,
  fetchRemoteMarkets,
} from "@/server/reference/remote-reference";

export async function listMarketReference() {
  if (!isRemoteCatalog) return COUNTRIES;
  return fetchRemoteMarkets();
}

export async function listCurrencyReference() {
  if (!isRemoteCatalog) {
    return CURRENCY_CODES.map((code) => ({
      code,
      unitsPerUsd: CURRENCY_PER_USD[code],
    }));
  }

  return fetchRemoteCurrencies();
}

export async function listLanguageReference() {
  if (!isRemoteCatalog) {
    return LOCALES.map((code) => ({
      code,
      name: LOCALE_NAMES[code],
      direction: code === "ar" ? ("rtl" as const) : ("ltr" as const),
    }));
  }

  return fetchRemoteLanguages();
}

export async function resolveMarket(countryCode: string, citySlug: string): Promise<Market | undefined> {
  const countries = await listMarketReference();
  const country = countries.find((item) => item.code === countryCode.toLowerCase());
  const city = country?.cities.find((item) => item.slug === citySlug.toLowerCase());

  if (!country || !city) return undefined;

  return {
    country: country.code,
    countryNames: country.names,
    currency: country.currency,
    city: city.slug,
    cityNames: city.names,
    premium: city.premium,
  };
}

export async function listResolvedMarkets(): Promise<Market[]> {
  const countries = await listMarketReference();

  return countries.flatMap((country) =>
    country.cities.map((city) => ({
      country: country.code,
      countryNames: country.names,
      currency: country.currency,
      city: city.slug,
      cityNames: city.names,
      premium: city.premium,
    })),
  );
}
