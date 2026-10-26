import type { CurrencyCode } from "@/domain/currency/currencies";
import type { AppLocale } from "@/domain/geo/locales";

export const BODY_TYPES = [
  "economy",
  "sedan",
  "suv",
  "luxury",
  "sports",
  "van",
  "convertible",
] as const;

export type BodyType = (typeof BODY_TYPES)[number];

export const SORTS = ["recommended", "price_asc", "price_desc"] as const;

export type SearchSort = (typeof SORTS)[number];

export type Transmission = "automatic" | "manual";

export type VehicleListing = {
  id: string;
  slug: string;
  country: string;
  city: string;
  currency: CurrencyCode;
  make: string;
  makeSlug: string;
  model: string;
  modelSlug: string;
  bodyType: BodyType;
  seats: number;
  transmission: Transmission;
  dailyPriceMinor: number;
  monthlyPriceMinor: number | null;
  depositRequired: boolean;
  airportDelivery: boolean;
  supplier: string;
  featured: boolean;
  searchText: string;
  /**
   * Optional copy from NestJS. When absent, the SEO templates build the title
   * and description from the listing and the active locale.
   */
  seo?: {
    title?: Partial<Record<AppLocale, string>>;
    description?: Partial<Record<AppLocale, string>>;
  };
};

export type VehicleSearchQuery = {
  country: string;
  city: string;
  locale: AppLocale;
  make?: string;
  model?: string;
  bodyType?: BodyType;
  q?: string;
  deposit?: "none";
  term?: "monthly";
  pickup?: "airport";
  seats?: number;
  sort: SearchSort;
  page: number;
  limit: number;
};

export type ListingPage = {
  items: VehicleListing[];
  total: number;
  page: number;
  limit: number;
};

export type MakeOption = {
  slug: string;
  name: string;
};

export type ModelOption = {
  slug: string;
  name: string;
  makeSlug: string;
  makeName: string;
};

export type SearchSuggestion =
  | {
      kind: "famous";
      slug: string;
      messageKey: string;
    }
  | {
      kind: "bodyType";
      slug: BodyType;
      messageKey: BodyType;
    }
  | {
      kind: "make";
      slug: string;
      label: string;
    }
  | {
      kind: "model";
      slug: string;
      makeSlug: string;
      label: string;
    };

export function isBodyType(value: string): value is BodyType {
  return (BODY_TYPES as readonly string[]).includes(value);
}

export function isSearchSort(value: string): value is SearchSort {
  return (SORTS as readonly string[]).includes(value);
}
