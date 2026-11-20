import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { CompanyEmptyState } from "@/components/company/CompanyEmptyState";
import {
  CompanyHeader,
  type CompanyProfile,
} from "@/components/company/CompanyHeader";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import {
  BODY_TYPES,
  type BodyType,
  type MakeOption,
  type ModelOption,
  type SearchSort,
  type VehicleListing,
  type VehicleSearchQuery,
} from "@/domain/catalog/types";
import { convertMinor, formatMoney } from "@/domain/currency/format";
import type { AppLocale } from "@/domain/geo/locales";
import { listMarkets, localize, type Market } from "@/domain/geo/markets";
import { catalogPath, listingPath } from "@/domain/routing/rent-paths";
import {
  ListingCard,
  type ListingCardModel,
} from "@/features/catalog/listing-card";
import { FilterSidebar } from "@/features/search/filter-sidebar";
import { SearchToolbar } from "@/features/search/search-toolbar";
import { slugify } from "@/lib/slugify";
import { searchCatalog } from "@/server/catalog/catalog";
import { getDisplayCurrency } from "@/server/preferences/currency";

const PAGE_SIZE = 12;
const MAX_PAGE = 50;
const CATALOG_FETCH_LIMIT = 24;
const ALLOWED_SORTS: readonly SearchSort[] = [
  "recommended",
  "price_asc",
  "price_desc",
];

type DealerSearchParams = {
  page?: string;
  sort?: string;
  make?: string;
  model?: string;
  bodyType?: string;
  deposit?: string;
  term?: string;
  pickup?: string;
  seats?: string;
  q?: string;
};

type ListingWithExtras = VehicleListing & {
  year?: number;
  trim?: string;
  images?: unknown;
  supplierSlug?: string;
  supplierLogo?: string | null;
  supplierPhone?: string;
  supplierWhatsapp?: string;
  isPremium?: boolean;
  premium?: boolean;
  tier?: "premium" | "featured" | "standard";
};

function parseSort(raw?: string): SearchSort {
  return ALLOWED_SORTS.includes(raw as SearchSort)
    ? (raw as SearchSort)
    : "recommended";
}

function parsePage(raw?: string): number {
  const parsed = Number.parseInt(raw ?? "1", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.min(parsed, MAX_PAGE);
}

function parseBodyType(raw?: string): BodyType | undefined {
  return BODY_TYPES.includes(raw as BodyType) ? (raw as BodyType) : undefined;
}

function parseSeats(raw?: string): number | undefined {
  const n = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

// Must match ListingDetail's companySlug logic exactly
function getSupplierSlug(item: VehicleListing): string {
  const ext = item as ListingWithExtras;
  return (
    ext.supplierSlug?.trim().toLowerCase() ||
    slugify(item.supplier) ||
    slugify(String(item.id))
  );
}

function formatSlugAsName(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function resolveMarketByCity(city: string): Market | undefined {
  const normalized = city.trim().toLowerCase();
  if (!normalized) return undefined;
  return listMarkets().find((market) => market.city === normalized);
}

async function loadCityListings(
  market: Market,
  locale: AppLocale,
): Promise<VehicleListing[]> {
  const firstPage = await searchCatalog({
    country: market.country,
    city: market.city,
    locale,
    sort: "recommended",
    page: 1,
    limit: CATALOG_FETCH_LIMIT,
  });

  const items = [...firstPage.items];
  const totalPages = Math.min(firstPage.page, 10);

  if (totalPages > 1) {
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        searchCatalog({
          country: market.country,
          city: market.city,
          locale,
          sort: "recommended",
          page: i + 2,
          limit: CATALOG_FETCH_LIMIT,
        }),
      ),
    );
    for (const pageResult of rest) {
      items.push(...pageResult.items);
    }
  }

  return items;
}

async function getCompanyData(
  companySlug: string,
  market: Market,
  locale: AppLocale,
): Promise<{ company: CompanyProfile; listings: VehicleListing[] } | null> {
  if (!companySlug || !market.city) return null;

  const allCityListings = await loadCityListings(market, locale);
  const dealerListings = allCityListings.filter(
    (item) => getSupplierSlug(item) === companySlug,
  );

  const supplierName = dealerListings[0]?.supplier?.trim();

  return {
    company: {
      slug: companySlug,
      name: supplierName || formatSlugAsName(companySlug),
    },
    listings: dealerListings,
  };
}

function filterAndSortListings(
  listings: VehicleListing[],
  companySlug: string,
  query: VehicleSearchQuery,
): VehicleListing[] {
  const qLower = query.q?.trim().toLowerCase() ?? "";

  const filtered = listings.filter((item) => {
    if (getSupplierSlug(item) !== companySlug) return false;
    if (query.bodyType && item.bodyType !== query.bodyType) return false;
    if (query.make && item.makeSlug !== query.make) return false;
    if (query.model && item.modelSlug !== query.model) return false;
    if (query.deposit === "none" && item.depositRequired) return false;
    if (query.pickup === "airport" && !item.airportDelivery) return false;
    if (query.seats && item.seats !== query.seats) return false;
    if (qLower) {
      const haystack =
        `${item.make} ${item.model} ${item.supplier} ${item.searchText}`.toLowerCase();
      if (!haystack.includes(qLower)) return false;
    }
    return true;
  });

  if (query.sort === "price_asc") {
    return [...filtered].sort((a, b) => a.dailyPriceMinor - b.dailyPriceMinor);
  }
  if (query.sort === "price_desc") {
    return [...filtered].sort((a, b) => b.dailyPriceMinor - a.dailyPriceMinor);
  }
  return filtered;
}

function buildFilterOptions(listings: VehicleListing[]): {
  makes: MakeOption[];
  models: ModelOption[];
} {
  const makeMap = new Map<string, MakeOption>();
  const modelMap = new Map<string, ModelOption>();

  for (const item of listings) {
    if (!makeMap.has(item.makeSlug)) {
      makeMap.set(item.makeSlug, {
        slug: item.makeSlug,
        name: item.make,
      });
    }

    const modelKey = `${item.makeSlug}:${item.modelSlug}`;
    if (item.modelSlug && !modelMap.has(modelKey)) {
      modelMap.set(modelKey, {
        slug: item.modelSlug,
        name: item.model,
        makeSlug: item.makeSlug,
        makeName: item.make,
      });
    }
  }

  return {
    makes: Array.from(makeMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
    models: Array.from(modelMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale; city: string; companySlug: string }>;
}): Promise<Metadata> {
  const { locale, city, companySlug } = await params;
  const normalizedCity = city.trim().toLowerCase();
  const normalizedSlug = companySlug.trim().toLowerCase();

  const market = resolveMarketByCity(normalizedCity);
  const [data, metaT] = await Promise.all([
    market ? getCompanyData(normalizedSlug, market, locale) : null,
    getTranslations({ locale, namespace: "Meta" }),
  ]);

  if (!market || !data) return {};

  const cityName = localize(market.cityNames, locale);
  return {
    title: metaT("companyTitle", {
      company: data.company.name,
      city: cityName,
    }),
    alternates: {
      canonical: `/${locale}/company/${market.city}/${data.company.slug}`,
    },
  };
}

export default async function CompanyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: AppLocale; city: string; companySlug: string }>;
  searchParams: Promise<DealerSearchParams>;
}) {
  const [{ locale, city, companySlug }, resolvedSearch, t, bodyT, filterT] =
    await Promise.all([
      params,
      searchParams,
      getTranslations("Listings"),
      getTranslations("BodyTypes"),
      getTranslations("FilterSidebar"),
    ]);

  const normalizedCity = city.trim().toLowerCase();
  const normalizedSlug = companySlug.trim().toLowerCase();

  if (!normalizedCity || !normalizedSlug) {
    notFound();
  }

  if (city !== normalizedCity || companySlug !== normalizedSlug) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(resolvedSearch)) {
      if (typeof value === "string" && value.length > 0) {
        qs.set(key, value);
      }
    }
    const querySuffix = qs.toString() ? `?${qs.toString()}` : "";
    redirect(
      `/${locale}/company/${normalizedCity}/${normalizedSlug}${querySuffix}`,
    );
  }

  const market = resolveMarketByCity(normalizedCity);
  if (!market) {
    notFound();
  }

  const [data, displayCurrency] = await Promise.all([
    getCompanyData(normalizedSlug, market, locale),
    getDisplayCurrency(market.currency),
  ]);

  if (!data) {
    notFound();
  }

  const { company, listings: allDealerListings } = data;
  const companyBasePath = `/company/${market.city}/${company.slug}`;

  const query: VehicleSearchQuery = {
    country: market.country,
    city: market.city,
    locale,
    make: resolvedSearch.make?.trim().toLowerCase() || undefined,
    model: resolvedSearch.model?.trim().toLowerCase() || undefined,
    bodyType: parseBodyType(resolvedSearch.bodyType),
    deposit: resolvedSearch.deposit === "none" ? "none" : undefined,
    term: resolvedSearch.term === "monthly" ? "monthly" : undefined,
    pickup: resolvedSearch.pickup === "airport" ? "airport" : undefined,
    seats: parseSeats(resolvedSearch.seats),
    q: resolvedSearch.q?.trim() || undefined,
    sort: parseSort(resolvedSearch.sort),
    page: parsePage(resolvedSearch.page),
    limit: PAGE_SIZE,
  };

  const filteredListings = filterAndSortListings(
    allDealerListings,
    company.slug,
    query,
  );

  const totalCars = filteredListings.length;
  const currentPage = query.page ?? 1;
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedListings = filteredListings.slice(start, start + PAGE_SIZE);

  const { makes, models } = buildFilterOptions(allDealerListings);
  const cityName = localize(market.cityNames, locale);

  const cardModels: ListingCardModel[] = paginatedListings.map((item) => {
    const ext = item as ListingWithExtras;

    const dailyMinor = convertMinor(
      item.dailyPriceMinor,
      item.currency,
      displayCurrency,
    );
    const monthlyMinor =
      item.monthlyPriceMinor == null
        ? null
        : convertMinor(item.monthlyPriceMinor, item.currency, displayCurrency);

    const dailyOriginalMinor = Math.round(dailyMinor * 1.35);
    const monthlyOriginalMinor = monthlyMinor
      ? Math.round(monthlyMinor * 1.35)
      : null;

    const isPremium =
      ext.tier === "premium" || Boolean(ext.isPremium) || Boolean(ext.premium);
    const badge = isPremium
      ? "premium"
      : ext.tier === "featured" || item.featured
        ? "featured"
        : "none";

    const validImages = Array.isArray(ext.images)
      ? ext.images.filter(
          (src): src is string =>
            typeof src === "string" && src.trim().length > 0,
        )
      : [];

    const cleanPhone = ext.supplierPhone?.replace(/[^\d+]/g, "") ?? "";
    const cleanWhatsapp = ext.supplierWhatsapp?.replace(/\D/g, "") ?? "";

    return {
      id: item.id,
      href: listingPath({
        city: item.city,
        make: item.make,
        model: item.model,
        id: item.id,
      }),
      title: [ext.year, item.make, item.model, ext.trim]
        .filter(Boolean)
        .join(" "),
      specsLine: [
        bodyT(item.bodyType),
        t("seats", { count: item.seats }),
        t(item.transmission),
      ].join(" · "),
      locationLabel: cityName,
      images: validImages.length > 0 ? validImages : ["/landing-page/hero.png"],
      badge,
      isPremium: badge === "premium",
      premiumLabel: t("premium"),
      featuredLabel: t("featured"),
      dailyDiscount: "-26%",
      dailyOriginalPrice: formatMoney(
        dailyOriginalMinor,
        displayCurrency,
        locale,
      ),
      dailyPrice: formatMoney(dailyMinor, displayCurrency, locale),
      dailyKm: t("kmLimit", { count: 250 }),
      perDayLabel: t("perDay"),
      monthlyDiscount: "-26%",
      monthlyOriginalPrice: monthlyOriginalMinor
        ? formatMoney(monthlyOriginalMinor, displayCurrency, locale)
        : null,
      monthlyPrice: monthlyMinor
        ? formatMoney(monthlyMinor, displayCurrency, locale)
        : null,
      monthlyKm: t("kmLimit", { count: 3000 }),
      perMonthLabel: t("perMonth"),
      features: [
        ...(!item.depositRequired ? [t("noDeposit")] : []),
        t("freeDelivery"),
        t("minDays", { count: 1 }),
        t("insuranceIncluded"),
      ].slice(0, 4),
      phoneHref: cleanPhone ? `tel:${cleanPhone}` : null,
      whatsappHref: cleanWhatsapp ? `https://wa.me/${cleanWhatsapp}` : null,
      dealerName: company.name,
      dealerLogoUrl: ext.supplierLogo ?? null,
      dealerHref: companyBasePath,
      callLabel: t("call"),
      whatsappLabel: t("whatsapp"),
      likeLabel: t("like"),
      likedLabel: t("liked"),
    };
  });

  const hasActiveFilters = Boolean(
    query.make ||
    query.model ||
    query.bodyType ||
    query.deposit ||
    query.term ||
    query.pickup ||
    query.seats ||
    query.q,
  );

  return (
    <main className="w-full bg-background-primary pb-12">
      <SearchToolbar
        country={market.country}
        city={market.city}
        query={query}
        makes={makes}
        models={models}
        basePath={companyBasePath}
        filterDrawerContent={
          <FilterSidebar
            city={market.city}
            query={query}
            makes={makes}
            models={models}
            variant="drawer"
            basePath={companyBasePath}
          />
        }
      />

      <CompanyHeader
        market={market}
        locale={locale}
        company={company}
        totalCars={totalCars}
      />

      <LayoutWrapper className="pt-6 lg:pt-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-6">
          <FilterSidebar
            city={market.city}
            query={query}
            makes={makes}
            models={models}
            hideMobileTrigger
            basePath={companyBasePath}
          />

          <section className="min-w-0 flex-1">
            {cardModels.length === 0 ? (
              <CompanyEmptyState
                title={
                  hasActiveFilters
                    ? t("companyEmptyFilteredTitle", { company: company.name })
                    : t("companyEmptyDefaultTitle", {
                        company: company.name,
                        city: cityName,
                      })
                }
                body={
                  hasActiveFilters
                    ? t("companyEmptyFilteredBody", { company: company.name })
                    : t("companyEmptyDefaultBody", { city: cityName })
                }
                actionLabel={
                  hasActiveFilters
                    ? filterT("clearAllFilters")
                    : t("browseAllCityCars", { city: cityName })
                }
                actionHref={
                  hasActiveFilters ? companyBasePath : catalogPath(market.city)
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-[var(--spacing-space-16)] sm:grid-cols-2 lg:grid-cols-1">
                {cardModels.map((card) => (
                  <ListingCard
                    key={card.id}
                    listing={card}
                    variant="responsive"
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </LayoutWrapper>
    </main>
  );
}
