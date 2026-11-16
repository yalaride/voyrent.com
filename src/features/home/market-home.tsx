import { Suspense } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/domain/geo/locales";
import { getCountry, localize, type Market } from "@/domain/geo/markets";
import { cityRentPath } from "@/domain/routing/rent-paths";
import { ListingSection } from "@/features/catalog/listing-section";
import { ListingSkeleton } from "@/features/catalog/listing-skeleton";
import { SearchPanel } from "@/features/search/search-panel";
import { BrandSlider } from "@/features/catalog/brand-slider";
import { BrowseCarsSection } from "@/features/catalog/broswer-car-section";
import { listMakes } from "@/server/catalog/catalog";
import {
  PopularCitiesSlider,
  type PopularCityItem,
} from "@/components/cities-slider/cities-section";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

export async function MarketHome({
  market,
  locale,
  scope = "city",
}: {
  market: Market;
  locale: AppLocale;
  scope?: "city" | "country";
}) {
  const t = await getTranslations({ locale });
  const brands = await listMakes(market.country, market.city);
  const cityName = localize(market.cityNames, locale);
  const countryName = localize(market.countryNames, locale);

  const place = scope === "country" ? countryName : cityName;
  const country = getCountry(market.country);

  const popularCities: PopularCityItem[] =
    country && country.cities.length > 1
      ? country.cities
          .filter((city) => scope === "country" || city.slug !== market.city)
          .map((city) => ({
            slug: city.slug,
            name: localize(city.names, locale),
            href: cityRentPath(city.slug),
          }))
      : [];

  return (
    <>
      <section className="relative z-20 flex h-[627px] w-full flex-col justify-between overflow-visible bg-background-section px-4 pt-20 pb-8 md:h-[499px] md:justify-center md:pt-0 md:pb-0 lg:h-[620px]">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/landing-page/hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hidden object-cover object-center lg:block"
          />
          <Image
            src="/landing-page/hero-tablet.png"
            alt=""
            fill
            sizes="100vw"
            className="hidden object-cover object-center md:block lg:hidden"
          />
          <Image
            src="/landing-page/hero-mobile.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center md:hidden"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-between text-center md:flex-initial md:justify-center">
          <h1 className="w-full max-w-[320px] text-[32px] font-semibold leading-[1.16] tracking-[-0.02em] text-text-inverse drop-shadow-sm [text-wrap:balance] sm:max-w-[420px] sm:text-[38px] md:max-w-[520px] md:text-[48px] lg:max-w-[760px] lg:text-[72px] lg:leading-[1.1]">
            {t("Hero.title", { city: place, place })}
          </h1>

          <div className="mt-auto w-full md:mt-8 lg:mt-10">
            <SearchPanel country={market.country} city={market.city} />
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--Border-Default,#CCD0D8)] bg-white">
        <BrandSlider city={market.city} brands={brands} />
      </section>

      <section className="py-10">
        <BrowseCarsSection city={market.city} />
      </section>

      <Suspense fallback={<ListingSkeleton />}>
        <ListingSection
          market={market}
          locale={locale}
          query={{
            country: market.country,
            city: market.city,
            locale,
            sort: "recommended",
            page: 1,
            limit: 6,
          }}
          allCities={scope === "country"}
          heading={t("Listings.bestDealsTitle")}
          subtitle={t("Listings.bestDealsSubtitle")}
          viewAllLabel={t("Listings.shopAllDeals")}
          viewAllHref={cityRentPath(market.city)}
        />
      </Suspense>

      <PopularCitiesSlider
        countryName={countryName}
        cities={popularCities}
        fallbackSubtitle={countryName}
      />

      <LayoutWrapper className="mt-10">
        <section>
          <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-text-primary">
            {t("Trust.title")}
          </h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {(
              [
                ["Trust.rangeTitle", "Trust.rangeBody"],
                ["Trust.priceTitle", "Trust.priceBody"],
                ["Trust.marketTitle", "Trust.marketBody"],
              ] as const
            ).map(([title, bodyKey]) => (
              <li
                key={title}
                className="rounded-2xl border border-border-default bg-background-primary p-5"
              >
                <h3 className="font-semibold text-text-primary">{t(title)}</h3>
                <p className="mt-2 text-sm text-text-secondary">{t(bodyKey)}</p>
              </li>
            ))}
          </ul>
        </section>
      </LayoutWrapper>
    </>
  );
}
