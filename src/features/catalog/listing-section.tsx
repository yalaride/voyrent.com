import { getTranslations } from "next-intl/server";

import { catalogPath, listingPath } from "@/domain/routing/rent-paths";
import type {
  VehicleListing,
  VehicleSearchQuery,
} from "@/domain/catalog/types";
import { convertMinor, formatMoney } from "@/domain/currency/format";
import type { AppLocale } from "@/domain/geo/locales";
import { localize, type Market } from "@/domain/geo/markets";
import {
  ListingCard,
  type ListingBadgeType,
  type ListingCardModel,
} from "@/features/catalog/listing-card";
import { searchCatalog } from "@/server/catalog/catalog";
import { getDisplayCurrency } from "@/server/preferences/currency";
import { ListingSlider } from "@/components/mian-slider/listing-slider";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

type ListingWithExtras = VehicleListing & {
  images?: unknown;
  supplierPhone?: string;
  supplierWhatsapp?: string;
  supplierLogo?: string | null;
  isPremium?: boolean;
  premium?: boolean;
  tier?: "premium" | "featured" | "standard";
};

function isExplicitPremium(listing: ListingWithExtras): boolean {
  return (
    listing.tier === "premium" ||
    Boolean(listing.isPremium) ||
    Boolean(listing.premium)
  );
}

function presentListing(
  listing: VehicleListing,
  locale: AppLocale,
  displayCurrency: Market["currency"],
  labels: {
    perDay: string;
    perMonth: string;
    premium: string;
    featured: string;
    freeDelivery: string;
    minDays: string;
    insuranceIncluded: string;
    noDeposit: string;
    call: string;
    whatsapp: string;
    dailyKm: string;
    monthlyKm: string;
    like: string;
    liked: string;
    specsLine: string;
    locationLabel: string;
  },
  forceBadge?: ListingBadgeType,
  onlyFeaturedOrNone = false,
): ListingCardModel {
  const dailyMinor = convertMinor(
    listing.dailyPriceMinor,
    listing.currency,
    displayCurrency,
  );
  const monthlyMinor =
    listing.monthlyPriceMinor == null
      ? null
      : convertMinor(
          listing.monthlyPriceMinor,
          listing.currency,
          displayCurrency,
        );

  const dailyOriginalMinor = Math.round(dailyMinor * 1.35);
  const monthlyOriginalMinor = monthlyMinor
    ? Math.round(monthlyMinor * 1.35)
    : null;

  const listingWithExtras = listing as ListingWithExtras;

  const resolvedBadge: ListingBadgeType =
    forceBadge ??
    (onlyFeaturedOrNone
      ? listingWithExtras.tier === "featured" || listing.featured
        ? "featured"
        : "none"
      : isExplicitPremium(listingWithExtras)
        ? "premium"
        : listingWithExtras.tier === "featured" || listing.featured
          ? "featured"
          : "none");

  const features = [
    ...(!listing.depositRequired ? [labels.noDeposit] : []),
    labels.freeDelivery,
    labels.minDays,
    labels.insuranceIncluded,
  ].slice(0, 4);

  return {
    id: listing.id,
    href: listingPath({
      city: listing.city,
      make: listing.make,
      model: listing.model,
      id: listing.id,
    }),
    title: `${listing.make} ${listing.model}`.trim(),
    specsLine: labels.specsLine,
    locationLabel: labels.locationLabel,
    images:
      Array.isArray(listingWithExtras.images) &&
      listingWithExtras.images.length > 0
        ? listingWithExtras.images.filter(
            (image): image is string => typeof image === "string",
          )
        : ["/landing-page/hero.png"],

    badge: resolvedBadge,
    isPremium: resolvedBadge === "premium",
    premiumLabel: labels.premium,
    featuredLabel: labels.featured,

    dailyDiscount: "-26%",
    dailyOriginalPrice: formatMoney(
      dailyOriginalMinor,
      displayCurrency,
      locale,
    ),
    dailyPrice: formatMoney(dailyMinor, displayCurrency, locale),
    dailyKm: labels.dailyKm,
    perDayLabel: labels.perDay,

    monthlyDiscount: "-26%",
    monthlyOriginalPrice: monthlyOriginalMinor
      ? formatMoney(monthlyOriginalMinor, displayCurrency, locale)
      : null,
    monthlyPrice: monthlyMinor
      ? formatMoney(monthlyMinor, displayCurrency, locale)
      : null,
    monthlyKm: labels.monthlyKm,
    perMonthLabel: labels.perMonth,

    features,

    phoneHref: listingWithExtras.supplierPhone
      ? `tel:${listingWithExtras.supplierPhone}`
      : null,
    whatsappHref: listingWithExtras.supplierWhatsapp
      ? `https://wa.me/${listingWithExtras.supplierWhatsapp}`
      : null,
    dealerName: listing.supplier,
    dealerLogoUrl: listingWithExtras.supplierLogo ?? null,

    callLabel: labels.call,
    whatsappLabel: labels.whatsapp,
    likeLabel: labels.like,
    likedLabel: labels.liked,
  };
}

export async function ListingSection({
  market,
  locale,
  query,
  heading,
  subtitle,
  viewAllHref,
  viewAllLabel,
  allCities = false,
  layout = "slider",
  cardVariant = "vertical",
  sliderVariant = "default",
  showHeader = true,
  autoPlay = false,
  useLayoutWrapper = true,
  forceBadge,
  separateFeatured = false,
}: {
  market: Market;
  locale: AppLocale;
  query: VehicleSearchQuery;
  heading?: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  showPagination?: boolean;
  allCities?: boolean;
  layout?: "slider" | "list" | "grid";
  cardVariant?: "vertical" | "responsive";
  sliderVariant?: "default" | "search";
  showHeader?: boolean;
  autoPlay?: boolean;
  useLayoutWrapper?: boolean;
  forceBadge?: ListingBadgeType;
  separateFeatured?: boolean;
}) {
  const [currency, result, t, bodyT] = await Promise.all([
    getDisplayCurrency(market.currency),
    searchCatalog(query, allCities ? { allCities: true } : undefined),
    getTranslations("Listings"),
    getTranslations("BodyTypes"),
  ]);

  const resolvedHeading = heading ?? t("bestDealsTitle");
  const resolvedSubtitle = subtitle ?? t("bestDealsSubtitle");
  const resolvedViewAllLabel = viewAllLabel ?? t("shopAllDeals");
  const resolvedViewAllHref =
    viewAllHref ?? catalogPath(market.city, { ...query });
  const cityLabel = localize(market.cityNames, locale);

  // Sliders (home page & search top slider) show Premium only
  const effectiveForceBadge: ListingBadgeType | undefined =
    layout === "slider" ? (forceBadge ?? "premium") : forceBadge;

  const sourceItems =
    layout === "slider"
      ? (() => {
          const explicitPremiumItems = result.items.filter((item) =>
            isExplicitPremium(item as ListingWithExtras),
          );
          return explicitPremiumItems.length > 0
            ? explicitPremiumItems
            : result.items;
        })()
      : result.items;

  const cards = sourceItems.map((rawListing) =>
    presentListing(
      rawListing,
      locale,
      currency,
      {
        perDay: t("perDay"),
        perMonth: t("perMonth"),
        premium: t("premium"),
        featured: t.has("featuredBadge") ? t("featuredBadge") : "Featured",
        freeDelivery: t("freeDelivery"),
        minDays: t("minDays", { count: 1 }),
        insuranceIncluded: t("insuranceIncluded"),
        noDeposit: t("noDeposit"),
        call: t("call"),
        whatsapp: t("whatsapp"),
        dailyKm: t("kmLimit", { count: 250 }),
        monthlyKm: t("kmLimit", { count: 3000 }),
        like: t("like"),
        liked: t("liked"),
        specsLine: [
          bodyT(rawListing.bodyType),
          t("seats", { count: rawListing.seats }),
          t(rawListing.transmission),
        ].join(" · "),
        locationLabel: cityLabel,
      },
      effectiveForceBadge,
      separateFeatured,
    ),
  );

  // Filter-sidebar section strictly separates Featured vs Non-Featured (no tag)
  const featuredCards = separateFeatured
    ? cards.filter((c) => c.badge === "featured")
    : [];
  const nonFeaturedCards = separateFeatured
    ? cards.filter((c) => c.badge === "none")
    : cards;

  // Mobile: 1 vertical | Tablet (sm/md): 2 vertical in a row | Laptop/Desktop (lg+): 1 horizontal card per row
  const gridClasses =
    cardVariant === "responsive"
      ? "grid grid-cols-1 gap-[var(--spacing-space-16)] sm:grid-cols-2 lg:grid-cols-1"
      : "grid grid-cols-1 gap-[var(--spacing-space-20)] sm:grid-cols-2 xl:grid-cols-3";

  const content =
    layout === "slider" ? (
      <ListingSlider
        cards={cards}
        heading={resolvedHeading}
        subtitle={resolvedSubtitle}
        viewAllHref={resolvedViewAllHref}
        viewAllLabel={resolvedViewAllLabel}
        emptyTitle={t("emptyTitle")}
        emptyBody={t("emptyBody")}
        variant={sliderVariant}
        showHeader={showHeader}
        autoPlay={autoPlay}
      />
    ) : cards.length === 0 ? (
      <div className="rounded-[var(--radius-16)] border border-dashed border-border-default bg-background-primary px-6 py-12 text-center">
        <h3 className="text-lg font-semibold text-text-primary">
          {t("emptyTitle")}
        </h3>
        <p className="mt-2 text-sm text-text-secondary">{t("emptyBody")}</p>
      </div>
    ) : separateFeatured ? (
      <div className="flex flex-col gap-[var(--spacing-space-24)]">
        {featuredCards.length > 0 ? (
          <div className={gridClasses}>
            {featuredCards.map((card) => (
              <ListingCard
                key={card.id ?? card.href}
                listing={card}
                variant={cardVariant}
              />
            ))}
          </div>
        ) : null}

        {nonFeaturedCards.length > 0 ? (
          <div
            className={`${gridClasses} ${
              featuredCards.length > 0
                ? "border-t border-border-subtle pt-[var(--spacing-space-24)]"
                : ""
            }`}
          >
            {nonFeaturedCards.map((card) => (
              <ListingCard
                key={card.id ?? card.href}
                listing={card}
                variant={cardVariant}
              />
            ))}
          </div>
        ) : null}
      </div>
    ) : (
      <div className={gridClasses}>
        {cards.map((card) => (
          <ListingCard
            key={card.id ?? card.href}
            listing={card}
            variant={cardVariant}
          />
        ))}
      </div>
    );

  if (!useLayoutWrapper) {
    return content;
  }

  return <LayoutWrapper className="mt-10">{content}</LayoutWrapper>;
}

export default ListingSection;
