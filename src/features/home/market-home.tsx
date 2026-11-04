import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { BODY_TYPES } from "@/domain/catalog/types";
import type { AppLocale } from "@/domain/geo/locales";
import { getCountry, localize, type Market } from "@/domain/geo/markets";
import { catalogPath, cityRentPath } from "@/domain/routing/rent-paths";
import { ListingSection } from "@/features/catalog/listing-section";
import { ListingSkeleton } from "@/features/catalog/listing-skeleton";
import { FamousSearches } from "@/features/search/famous-searches";
import { SearchPanel } from "@/features/search/search-panel";
import { Link } from "@/i18n/navigation";

export async function MarketHome({
  market,
  locale,
  scope = "city",
}: {
  market: Market;
  locale: AppLocale;
  scope?: "city" | "country";
}) {
  const [t, body] = await Promise.all([getTranslations(), getTranslations("BodyTypes")]);
  const cityName = localize(market.cityNames, locale);
  const countryName = localize(market.countryNames, locale);
  const place = scope === "country" ? countryName : cityName;
  const country = getCountry(market.country);

  return (
    <>
      <section className="bg-bg-section text-text-inverse">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-20 md:pt-16">
          <p className="text-sm font-medium text-primary">{t("Hero.eyebrow")}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-balance text-text-inverse md:text-6xl">
            {t("Hero.title", { city: place })}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-text-inverse/70 md:text-lg">
            {t("Hero.subtitle", { country: countryName })}
          </p>
        </div>
      </section>
      <div className="mx-auto -mt-10 max-w-6xl px-4">
        <div className="rounded-2xl border border-border-default bg-bg-primary p-3 shadow-sm md:p-4">
          <SearchPanel country={market.country} city={market.city} />
        </div>
        <FamousSearches city={market.city} />
      </div>
      <div className="mx-auto mt-12 grid max-w-6xl gap-12 px-4">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">{body("title")}</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {BODY_TYPES.map((type) => (
              <li key={type}>
                <Link
                  href={catalogPath(market.city, { bodyType: type })}
                  className="flex h-full items-end rounded-2xl border border-border-default bg-bg-primary px-3 py-4 text-sm font-medium text-text-primary hover:border-text-primary"
                >
                  {body(type)}
                </Link>
              </li>
            ))}
          </ul>
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
            heading={t("Listings.featured", { city: place })}
          />
        </Suspense>
        {country && country.cities.length > 1 ? (
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              {t("Cities.title", { country: countryName })}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {country.cities
                .filter((city) => scope === "country" || city.slug !== market.city)
                .map((city) => (
                  <li key={city.slug}>
                    <Link
                      href={cityRentPath(city.slug)}
                      className="block rounded-2xl border border-border-default bg-bg-primary px-4 py-4 hover:border-text-primary"
                    >
                      <span className="font-medium text-text-primary">
                        {localize(city.names, locale)}
                      </span>
                      <span className="mt-1 block text-sm text-text-secondary">{countryName}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ) : null}
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
                className="rounded-2xl border border-border-default bg-bg-primary p-5"
              >
                <h3 className="font-semibold text-text-primary">{t(title)}</h3>
                <p className="mt-2 text-sm text-text-secondary">{t(bodyKey)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
