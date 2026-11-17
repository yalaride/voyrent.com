import type { VehicleSearchQuery } from "@/domain/catalog/params";
import type { AppLocale } from "@/domain/geo/locales";
import type { Market } from "@/domain/geo/markets";
import ListingSection from "@/features/catalog/listing-section";
import { FilterSidebar } from "@/features/search/filter-sidebar";
import { SearchToolbar } from "@/features/search/search-toolbar";
import { listMakes, listModels } from "@/server/catalog/catalog";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

export async function SearchScreen({
  market,
  locale,
  query,
}: {
  market: Market;
  locale: AppLocale;
  query: VehicleSearchQuery;
}) {
  const [makes, models] = await Promise.all([
    listMakes(market.country, market.city),
    listModels(market.country, market.city),
  ]);

  return (
    <div className="min-h-screen bg-background-primary">
      {/* 1. Full-Bleed Dark Search & Filter Bar */}
      <SearchToolbar
        country={market.country}
        city={market.city}
        query={query}
        makes={makes}
        models={models}
      />

      {/* 2. Top Premium Auto-Slider */}
      <section className="w-full bg-border-subtle">
        <LayoutWrapper className="py-[var(--spacing-space-40)]">
          <ListingSection
            market={market}
            locale={locale}
            query={{
              country: market.country,
              city: market.city,
              locale,
              sort: "recommended",
              page: 1,
              limit: 12,
            }}
            layout="slider"
            sliderVariant="search"
            forceBadge="premium"
            showHeader={false}
            autoPlay
            useLayoutWrapper={false}
          />
        </LayoutWrapper>
      </section>

      {/* 3. Main 2-Column: Filter Sidebar + Responsive Cards (1 mobile / 2 tablet / 1 horizontal desktop) */}
      <LayoutWrapper className="py-8">
        <div className="grid grid-cols-1 gap-[var(--spacing-space-24)] lg:grid-cols-[302px_minmax(0,1fr)] lg:items-start">
          <FilterSidebar
            city={market.city}
            query={query}
            makes={makes}
            models={models}
          />

          <div className="min-w-0">
            <ListingSection
              market={market}
              locale={locale}
              query={query}
              layout="list"
              cardVariant="responsive"
              separateFeatured
              showHeader={false}
              useLayoutWrapper={false}
            />
          </div>
        </div>
      </LayoutWrapper>
    </div>
  );
}
