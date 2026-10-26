import { z } from "zod";

import { CURRENCY_CODES } from "@/domain/currency/currencies";
import { LOCALES } from "@/domain/geo/locales";

export const localizedNameSchema = z.object({
  en: z.string(),
  es: z.string(),
  ar: z.string(),
  fr: z.string(),
  pt: z.string(),
});

export const marketReferenceSchema = z.array(
  z.object({
    code: z.string(),
    currency: z.enum(CURRENCY_CODES),
    names: localizedNameSchema,
    cities: z.array(
      z.object({
        slug: z.string(),
        premium: z.boolean(),
        names: localizedNameSchema,
      }),
    ),
  }),
);

export const currencyReferenceSchema = z.array(
  z.object({
    code: z.enum(CURRENCY_CODES),
    unitsPerUsd: z.number().positive(),
  }),
);

export const languageReferenceSchema = z.array(
  z.object({
    code: z.enum(LOCALES),
    name: z.string(),
    direction: z.enum(["ltr", "rtl"]),
  }),
);
