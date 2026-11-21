import { getTranslations } from "next-intl/server";

import { BRAND_LOGOS } from "@/features/catalog/brand-slider";
import { listingsForMarket } from "@/domain/catalog/fleet";
import type { AppLocale } from "@/domain/geo/locales";
import { getMarket, localize, type Market } from "@/domain/geo/markets";
import { landingSegment, makeRentPath } from "@/domain/routing/rent-paths";
import { DesktopMenus, type HeaderNavModel } from "@/features/shell/mega-menus";
import { site } from "@/lib/config/site";
import { listMakes } from "@/server/catalog/catalog";
import { readStoredMarket } from "@/server/preferences/market";

export async function loadHeaderNav(
  locale: AppLocale,
  pageMarket?: Market,
): Promise<HeaderNavModel> {
  const t = await getTranslations({ locale, namespace: "Header" });
  const chosen = await readStoredMarket();
  const market =
    chosen ?? pageMarket ?? getMarket(site.defaultCountry, site.defaultCity);
  const city = market?.city ?? site.defaultCity;
  const country = market?.country ?? site.defaultCountry;
  const cityName = market ? localize(market.cityNames, locale) : city;
  const makes = market ? await listMakes(country, city) : [];
  const counts = new Map<string, number>();

  if (market) {
    for (const listing of listingsForMarket(country, city)) {
      counts.set(listing.makeSlug, (counts.get(listing.makeSlug) ?? 0) + 1);
    }
  }

  const labels = {
    viewAll: t("nav.viewAll"),
    luxury: t("nav.luxury", { city: cityName }),
    sports: t("nav.sports", { city: cityName }),
    noDeposit: t("nav.noDeposit"),
    economy: t("nav.economy"),
    suv: t("nav.suv"),
    sedan: t("nav.sedan"),
    convertible: t("nav.convertible"),
    van: t("nav.van"),
    monthly: t("nav.monthly"),
    sevenSeater: t("nav.sevenSeater"),
    listCars: t("nav.listCars"),
  };
  const item = (id: keyof typeof labels, href: string) => ({
    label: labels[id],
    href,
  });

  return {
    rentLabel: t("rentCar"),
    brandsLabel: t("carBrands"),
    dealersLabel: t("dealers"),
    columns: [
      {
        title: t("nav.categories"),
        links: [
          item("viewAll", `/rent-a-car-${city}`),
          item("luxury", `/${landingSegment("luxury", city)}`),
          item("sports", `/${landingSegment("sports", city)}`),
          item("noDeposit", `/${landingSegment("no-deposit", city)}`),
          item("economy", `/${landingSegment("economy", city)}`),
        ],
      },
      {
        title: t("nav.bodyTypes"),
        links: [
          item("suv", `/${landingSegment("suv", city)}`),
          item("sedan", `/${landingSegment("sedan", city)}`),
          item("convertible", `/${landingSegment("convertible", city)}`),
          item("van", `/${landingSegment("van", city)}`),
        ],
      },
      {
        title: t("nav.period"),
        links: [item("monthly", `/${landingSegment("monthly", city)}`)],
        extra: {
          title: t("nav.trending"),
          links: [item("sevenSeater", `/${landingSegment("seven-seater", city)}`)],
        },
      },
    ],
    dealers: {
      title: t("nav.forDealers"),
      links: [item("listCars", "/dealer-plans")],
    },
    brandsTitle: t("nav.rentalBrands"),
    searchPlaceholder: t("nav.searchBrand"),
    emptyBrands: t("nav.noBrands"),
    brands: makes.map((make) => {
      const count = counts.get(make.slug) ?? 0;
      return {
        name: make.name,
        href: makeRentPath(make.slug, city),
        countLabel:
          count === 1 ? t("nav.oneCar") : count > 1 ? t("nav.manyCars", { count }) : undefined,
        logo: BRAND_LOGOS[make.slug],
      };
    }),
  };
}

export async function HeaderNav({
  locale,
  pageMarket,
}: {
  locale: AppLocale;
  pageMarket?: Market;
}) {
  const nav = await loadHeaderNav(locale, pageMarket);
  return <DesktopMenus nav={nav} />;
}
