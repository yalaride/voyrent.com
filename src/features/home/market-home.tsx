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
} from "@/components/landing-slider/cities-section";
import { DealerBanner } from "@/components/banner/Dealer-Banner";
import { BlogSection } from "@/components/blog/Blog-Section";
import LandingFaqSection from "@/components/faqs/Landing-Section-faqs";
import { AppDownloadCta } from "@/components/cta/App-Download-CTA";

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
      <section className="relative z-20 flex h-[627px] w-full flex-col justify-between overflow-visible bg-background-section px-4 pt-24 pb-8 md:h-[499px] md:justify-center md:pt-0 md:pb-0 lg:h-[620px]">
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
          <h1 className="text-h2 lg:text-title w-full max-w-[361px] font-semibold leading-[1.16] tracking-[-0.02em] text-text-inverse drop-shadow-sm md:max-w-[363px] lg:max-w-[637px] lg:font-semibold lg:leading-[1.1]">
            {t.rich("Hero.title", {
              city: place,
              place,
              line: (chunks) => <span className="block">{chunks}</span>,
            })}
          </h1>

          <div className="mt-auto w-full md:mt-8 lg:mt-10">
            <SearchPanel country={market.country} city={market.city} />
          </div>
        </div>
      </section>

      <section className="bg-white">
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
      <div className="mt-10">
        <DealerBanner
          joinHref="/dealers/join"
          pricingHref="/pricing"
          imageSrc="/banner/Dealer-Banner.jpg"
        />
      </div>

      <BlogSection viewAllHref="/blog" />
      <AppDownloadCta
        googlePlayHref="https://play.google.com/store/apps"
        appStoreHref="https://apps.apple.com"
        imageSrc="/cta/Landing-Section-CTA.png"
      />
      <LandingFaqSection />
    </>
  );
}
