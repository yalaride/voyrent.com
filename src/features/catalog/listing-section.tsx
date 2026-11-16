import { getTranslations } from "next-intl/server";

import { catalogPath, listingPath } from "@/domain/routing/rent-paths";
import type {
  VehicleListing,
  VehicleSearchQuery,
} from "@/domain/catalog/types";
import { convertMinor, formatMoney } from "@/domain/currency/format";
import type { AppLocale } from "@/domain/geo/locales";
import type { Market } from "@/domain/geo/markets";
import type { ListingCardModel } from "@/features/catalog/listing-card";
import { Link } from "@/i18n/navigation";
import { searchCatalog } from "@/server/catalog/catalog";
import { getDisplayCurrency } from "@/server/preferences/currency";
import { ListingSlider } from "@/components/mian-slider/listing-slider";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

function presentListing(
  listing: VehicleListing,
  locale: AppLocale,
  displayCurrency: Market["currency"],
  labels: {
    perDay: string;
    perMonth: string;
    premium: string;
    freeDelivery: string;
    minDays: string;
    insuranceIncluded: string;
    call: string;
    whatsapp: string;
    dailyKm: string;
    monthlyKm: string;
    like: string;
    liked: string;
  },
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
  const listingImages = (listing as VehicleListing & { images?: unknown })
    .images;
  const listingWithContact = listing as VehicleListing & {
    supplierPhone?: string;
    supplierWhatsapp?: string;
    supplierLogo?: string | null;
  };

  return {
    id: listing.id,
    href: listingPath({
      city: listing.city,
      make: listing.make,
      model: listing.model,
      id: listing.id,
    }),
    title: `${listing.make} ${listing.model}`.trim(),
    images:
      Array.isArray(listingImages) && listingImages.length > 0
        ? listingImages.filter(
            (image): image is string => typeof image === "string",
          )
        : ["/landing-page/hero.png"],
    isPremium: true,
    premiumLabel: labels.premium,

    // Daily
    dailyDiscount: "-26%",
    dailyOriginalPrice: formatMoney(
      dailyOriginalMinor,
      displayCurrency,
      locale,
    ),
    dailyPrice: formatMoney(dailyMinor, displayCurrency, locale),
    dailyKm: labels.dailyKm,
    perDayLabel: labels.perDay,

    // Monthly
    monthlyDiscount: "-26%",
    monthlyOriginalPrice: monthlyOriginalMinor
      ? formatMoney(monthlyOriginalMinor, displayCurrency, locale)
      : null,
    monthlyPrice: monthlyMinor
      ? formatMoney(monthlyMinor, displayCurrency, locale)
      : null,
    monthlyKm: labels.monthlyKm,
    perMonthLabel: labels.perMonth,

    // Checklist Features
    features: [
      labels.freeDelivery,
      labels.minDays,
      listing.supplier,
      labels.insuranceIncluded,
    ],

    phoneHref: listingWithContact.supplierPhone
      ? `tel:${listingWithContact.supplierPhone}`
      : null,
    whatsappHref: listingWithContact.supplierWhatsapp
      ? `https://wa.me/${listingWithContact.supplierWhatsapp}`
      : null,
    dealerName: listing.supplier,
    dealerLogoUrl: listingWithContact.supplierLogo ?? null,

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
  showPagination = false,
  allCities = false,
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
}) {
  const [currency, result, t] = await Promise.all([
    getDisplayCurrency(market.currency),
    searchCatalog(query, allCities ? { allCities: true } : undefined),
    getTranslations("Listings"),
  ]);

  const resolvedHeading = heading ?? t("bestDealsTitle");
  const resolvedSubtitle = subtitle ?? t("bestDealsSubtitle");
  const resolvedViewAllLabel = viewAllLabel ?? t("shopAllDeals");
  const resolvedViewAllHref =
    viewAllHref ?? catalogPath(market.city, { ...query });

  const pages = Math.max(1, Math.ceil(result.total / result.limit));
  const cards = result.items.map((listing) =>
    presentListing(listing, locale, currency, {
      perDay: t("perDay"),
      perMonth: t("perMonth"),
      premium: t("premium"),
      freeDelivery: t("freeDelivery"),
      minDays: t("minDays", { count: 1 }),
      insuranceIncluded: t("insuranceIncluded"),
      call: t("call"),
      whatsapp: t("whatsapp"),
      dailyKm: t("kmLimit", { count: 250 }),
      monthlyKm: t("kmLimit", { count: 3000 }),
      like: t("like"),
      liked: t("liked"),
    }),
  );

  return (
    <LayoutWrapper className="mt-10">
      <ListingSlider
        cards={cards}
        heading={resolvedHeading}
        subtitle={resolvedSubtitle}
        viewAllHref={resolvedViewAllHref}
        viewAllLabel={resolvedViewAllLabel}
        emptyTitle={t("emptyTitle")}
        emptyBody={t("emptyBody")}
      />

      {/* Pagination (Optional) */}
      {showPagination && result.total > result.limit ? (
        <nav
          className="mt-8 flex items-center justify-between gap-3 text-sm text-text-primary"
          aria-label={t("pageStatus", { page: result.page, pages })}
        >
          {result.page > 1 ? (
            <Link
              href={catalogPath(market.city, {
                ...query,
                page: result.page - 1,
              })}
              className="rounded-lg border border-border-default bg-background-primary px-3 py-2"
            >
              {t("previous")}
            </Link>
          ) : (
            <span className="rounded-lg border border-border-default px-3 py-2 text-text-disabled">
              {t("previous")}
            </span>
          )}
          <p>{t("pageStatus", { page: result.page, pages })}</p>
          {result.page < pages ? (
            <Link
              href={catalogPath(market.city, {
                ...query,
                page: result.page + 1,
              })}
              className="rounded-lg border border-border-default bg-background-primary px-3 py-2"
            >
              {t("next")}
            </Link>
          ) : (
            <span className="rounded-lg border border-border-default px-3 py-2 text-text-disabled">
              {t("next")}
            </span>
          )}
        </nav>
      ) : null}
    </LayoutWrapper>
  );
}
export default ListingSlider;
