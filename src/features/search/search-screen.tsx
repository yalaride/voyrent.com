import { getTranslations } from "next-intl/server";

import { searchQueryKey, type VehicleSearchQuery } from "@/domain/catalog/params";
import type { AppLocale } from "@/domain/geo/locales";
import { localize, type Market } from "@/domain/geo/markets";
import { ListingSection } from "@/features/catalog/listing-section";
import { SearchPanel } from "@/features/search/search-panel";

export async function SearchScreen({
  market,
  locale,
  query,
}: {
  market: Market;
  locale: AppLocale;
  query: VehicleSearchQuery;
}) {
  const t = await getTranslations("Meta");
  const cityName = localize(market.cityNames, locale);
  const cityCatalog =
    !query.make &&
    !query.model &&
    !query.bodyType &&
    !query.q &&
    !query.deposit &&
    !query.term &&
    !query.pickup &&
    !query.seats;

  return (
    <div className="grid gap-8">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        {cityCatalog ? t("marketTitle", { city: cityName }) : t("searchTitle", { city: cityName })}
      </h1>
      <div className="rounded-2xl border bg-card p-3 md:p-4">
        <SearchPanel
          key={searchQueryKey(query)}
          country={market.country}
          city={market.city}
          initialQuery={query.q}
        />
      </div>
      <ListingSection market={market} locale={locale} query={query} showPagination />
    </div>
  );
}
