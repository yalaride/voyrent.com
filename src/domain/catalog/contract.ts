import { z } from "zod";

import { BODY_TYPES } from "@/domain/catalog/types";
import { CURRENCY_CODES } from "@/domain/currency/currencies";

const localizedCopy = z.record(z.string(), z.string());

export const vehicleListingSchema = z.object({
  id: z.string(),
  slug: z.string(),
  country: z.string(),
  city: z.string(),
  currency: z.enum(CURRENCY_CODES),
  make: z.string(),
  makeSlug: z.string(),
  model: z.string(),
  modelSlug: z.string(),
  bodyType: z.enum(BODY_TYPES),
  seats: z.number().int(),
  transmission: z.enum(["automatic", "manual"]),
  dailyPriceMinor: z.number().int(),
  monthlyPriceMinor: z.number().int().nullable(),
  depositRequired: z.boolean(),
  airportDelivery: z.boolean(),
  supplier: z.string(),
  featured: z.boolean(),
  searchText: z.string(),
  seo: z
    .object({
      title: localizedCopy.optional(),
      description: localizedCopy.optional(),
    })
    .optional(),
});

export const listingPageSchema = z.object({
  items: z.array(vehicleListingSchema),
  total: z.number().int(),
  page: z.number().int(),
  limit: z.number().int(),
});

export const makeOptionSchema = z.object({
  slug: z.string(),
  name: z.string(),
});

export const modelOptionSchema = z.object({
  slug: z.string(),
  name: z.string(),
  makeSlug: z.string(),
  makeName: z.string(),
});

export const searchSuggestionSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("famous"), slug: z.string(), messageKey: z.string() }),
  z.object({
    kind: z.literal("bodyType"),
    slug: z.enum(BODY_TYPES),
    messageKey: z.enum(BODY_TYPES),
  }),
  z.object({ kind: z.literal("make"), slug: z.string(), label: z.string() }),
  z.object({
    kind: z.literal("model"),
    slug: z.string(),
    makeSlug: z.string(),
    label: z.string(),
  }),
]);

export const suggestionListSchema = z.array(searchSuggestionSchema);
export const makeListSchema = z.array(makeOptionSchema);
export const modelListSchema = z.array(modelOptionSchema);
