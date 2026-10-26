const HUB_SLUG_BY_COUNTRY: Record<string, string> = {
  sa: "saudi-arabia",
  ma: "morocco",
  es: "spain",
  fr: "france",
  pt: "portugal",
  gb: "uk",
  us: "united-states",
};

const COUNTRY_BY_HUB_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(HUB_SLUG_BY_COUNTRY).map(([code, slug]) => [slug, code]),
);

/** The UAE homepage is `/`. Every other country uses `/{slug}/car-rental` on the same host. */
export function countryHubPath(country: string): string {
  const slug = HUB_SLUG_BY_COUNTRY[country];
  return slug ? `/${slug}/car-rental` : "/";
}

export function countryCodeFromHub(slug: string): string | undefined {
  return COUNTRY_BY_HUB_SLUG[slug];
}

export function countryHubSlugs(): string[][] {
  return Object.values(HUB_SLUG_BY_COUNTRY).map((slug) => [slug, "car-rental"]);
}
