import { getTranslations } from "next-intl/server";

import { searchQueryKey, type VehicleSearchQuery } from "@/domain/catalog/params";
import type { AppLocale } from "@/domain/geo/locales";
import { localize, type Market } from "@/domain/geo/markets";
import { ListingSection } from "@/features/catalog/listing-section";
import { SearchPanel } from "@/features/search/search-panel";
import { listMakes, listModels } from "@/server/catalog/catalog";

export async function SearchScreen({
  market,
  locale,
  query,
}: {
  market: Market;
  locale: AppLocale;
  query: VehicleSearchQuery;
}) {
  const [makes, models, t] = await Promise.all([
    listMakes(market.country, market.city),
    listModels(market.country, market.city),
    getTranslations("Meta"),
  ]);

  return (
    <div className="grid gap-8">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        {t("searchTitle", { city: localize(market.cityNames, locale) })}
      </h1>
      <div className="rounded-2xl border bg-card p-3 md:p-4">
        <SearchPanel
          key={searchQueryKey(query)}
          country={market.country}
          city={market.city}
          makes={makes}
          models={models}
          initial={query}
        />
      </div>
      <ListingSection market={market} locale={locale} query={query} showPagination />
    </div>
  );
}
