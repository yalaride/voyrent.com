import type { CurrencyCode } from "@/domain/currency/currencies";
import { type AppLocale, isLocale } from "@/domain/geo/locales";

export type LocalizedName = Record<AppLocale, string>;

export type CityRecord = {
  slug: string;
  premium: boolean;
  names: LocalizedName;
};

export type CountryRecord = {
  code: string;
  currency: CurrencyCode;
  names: LocalizedName;
  cities: readonly CityRecord[];
};

export type Market = {
  country: string;
  countryNames: LocalizedName;
  currency: CurrencyCode;
  city: string;
  cityNames: LocalizedName;
  premium: boolean;
};

const city = (
  slug: string,
  premium: boolean,
  en: string,
  es: string,
  ar: string,
  fr: string,
  pt: string,
): CityRecord => ({
  slug,
  premium,
  names: { en, es, ar, fr, pt },
});

export const COUNTRIES: readonly CountryRecord[] = [
  {
    code: "ae",
    currency: "AED",
    names: {
      en: "United Arab Emirates",
      es: "Emiratos Árabes Unidos",
      ar: "الإمارات العربية المتحدة",
      fr: "Émirats arabes unis",
      pt: "Emirados Árabes Unidos",
    },
    cities: [
      city("dubai", true, "Dubai", "Dubái", "دبي", "Dubaï", "Dubai"),
      city("abu-dhabi", true, "Abu Dhabi", "Abu Dabi", "أبوظبي", "Abou Dabi", "Abu Dhabi"),
      city("sharjah", false, "Sharjah", "Sharjah", "الشارقة", "Charjah", "Sharjah"),
      city("ajman", false, "Ajman", "Ajmán", "عجمان", "Ajman", "Ajman"),
      city(
        "ras-al-khaimah",
        false,
        "Ras Al Khaimah",
        "Ras al Jaima",
        "رأس الخيمة",
        "Ras el Khaïmah",
        "Ras Al Khaimah",
      ),
    ],
  },
  {
    code: "sa",
    currency: "SAR",
    names: {
      en: "Saudi Arabia",
      es: "Arabia Saudí",
      ar: "المملكة العربية السعودية",
      fr: "Arabie saoudite",
      pt: "Arábia Saudita",
    },
    cities: [
      city("riyadh", false, "Riyadh", "Riad", "الرياض", "Riyad", "Riade"),
      city("jeddah", false, "Jeddah", "Yeda", "جدة", "Djeddah", "Jeddah"),
      city("dammam", false, "Dammam", "Dammam", "الدمام", "Dammam", "Dammam"),
    ],
  },
  {
    code: "ma",
    currency: "MAD",
    names: {
      en: "Morocco",
      es: "Marruecos",
      ar: "المغرب",
      fr: "Maroc",
      pt: "Marrocos",
    },
    cities: [
      city("casablanca", false, "Casablanca", "Casablanca", "الدار البيضاء", "Casablanca", "Casablanca"),
      city("marrakech", false, "Marrakech", "Marrakech", "مراكش", "Marrakech", "Marraquexe"),
      city("rabat", false, "Rabat", "Rabat", "الرباط", "Rabat", "Rabat"),
    ],
  },
  {
    code: "es",
    currency: "EUR",
    names: {
      en: "Spain",
      es: "España",
      ar: "إسبانيا",
      fr: "Espagne",
      pt: "Espanha",
    },
    cities: [
      city("madrid", false, "Madrid", "Madrid", "مدريد", "Madrid", "Madrid"),
      city("barcelona", true, "Barcelona", "Barcelona", "برشلونة", "Barcelone", "Barcelona"),
      city("malaga", false, "Malaga", "Málaga", "مالقة", "Malaga", "Málaga"),
    ],
  },
  {
    code: "fr",
    currency: "EUR",
    names: {
      en: "France",
      es: "Francia",
      ar: "فرنسا",
      fr: "France",
      pt: "França",
    },
    cities: [
      city("paris", true, "Paris", "París", "باريس", "Paris", "Paris"),
      city("nice", true, "Nice", "Niza", "نيس", "Nice", "Nice"),
      city("lyon", false, "Lyon", "Lyon", "ليون", "Lyon", "Lião"),
    ],
  },
  {
    code: "pt",
    currency: "EUR",
    names: {
      en: "Portugal",
      es: "Portugal",
      ar: "البرتغال",
      fr: "Portugal",
      pt: "Portugal",
    },
    cities: [
      city("lisbon", false, "Lisbon", "Lisboa", "لشبونة", "Lisbonne", "Lisboa"),
      city("porto", false, "Porto", "Oporto", "بورتو", "Porto", "Porto"),
    ],
  },
  {
    code: "gb",
    currency: "GBP",
    names: {
      en: "United Kingdom",
      es: "Reino Unido",
      ar: "المملكة المتحدة",
      fr: "Royaume-Uni",
      pt: "Reino Unido",
    },
    cities: [
      city("london", true, "London", "Londres", "لندن", "Londres", "Londres"),
      city("manchester", false, "Manchester", "Mánchester", "مانشستر", "Manchester", "Manchester"),
    ],
  },
  {
    code: "us",
    currency: "USD",
    names: {
      en: "United States",
      es: "Estados Unidos",
      ar: "الولايات المتحدة",
      fr: "États-Unis",
      pt: "Estados Unidos",
    },
    cities: [
      city("miami", true, "Miami", "Miami", "ميامي", "Miami", "Miami"),
      city("los-angeles", true, "Los Angeles", "Los Ángeles", "لوس أنجلوس", "Los Angeles", "Los Angeles"),
    ],
  },
];

export function localize(names: LocalizedName, locale: string): string {
  return isLocale(locale) ? names[locale] : names.en;
}

export function getCountry(code: string): CountryRecord | undefined {
  return COUNTRIES.find((country) => country.code === code.toLowerCase());
}

export function getMarket(countryCode: string, citySlug: string): Market | undefined {
  const country = getCountry(countryCode);
  const city = country?.cities.find((item) => item.slug === citySlug.toLowerCase());

  if (!country || !city) {
    return undefined;
  }

  return {
    country: country.code,
    countryNames: country.names,
    currency: country.currency,
    city: city.slug,
    cityNames: city.names,
    premium: city.premium,
  };
}

export function listMarkets(): Market[] {
  return COUNTRIES.flatMap((country) =>
    country.cities.map((cityRecord) => ({
      country: country.code,
      countryNames: country.names,
      currency: country.currency,
      city: cityRecord.slug,
      cityNames: cityRecord.names,
      premium: cityRecord.premium,
    })),
  );
}
