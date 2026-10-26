import "server-only";

import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const envSchema = z.object({
  APP_ENV: z.enum(["development", "staging", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3010"),
  /**
   * Public origin used for canonical URLs, sitemap, and Open Graph.
   * Replace this when the production domain is connected.
   */
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://www.gleecars.com"),
  NEXT_PUBLIC_GTM_ID: z.preprocess(emptyToUndefined, z.string().regex(/^GTM-[A-Z0-9]+$/).optional()),
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  NEXT_PUBLIC_BING_SITE_VERIFICATION: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  NEXT_PUBLIC_OG_IMAGE: z.preprocess(emptyToUndefined, z.string().url().optional()),
  /**
   * NestJS origin, for example http://localhost:4000.
   * When omitted, catalog and reference calls stay on the in-process fixture.
   */
  API_BASE_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
});

export const serverEnv = envSchema.parse({
  APP_ENV: process.env.APP_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  NEXT_PUBLIC_BING_SITE_VERIFICATION: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
  NEXT_PUBLIC_OG_IMAGE: process.env.NEXT_PUBLIC_OG_IMAGE,
  API_BASE_URL: process.env.API_BASE_URL,
});

export const isRemoteCatalog = Boolean(serverEnv.API_BASE_URL);
