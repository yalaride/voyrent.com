import { getTranslations } from "next-intl/server";

import { catalogPath, listingPath } from "@/domain/routing/rent-paths";
import type { VehicleListing, VehicleSearchQuery } from "@/domain/catalog/types";
import { convertMinor, formatMoney } from "@/domain/currency/format";
import type { AppLocale } from "@/domain/geo/locales";
import type { Market } from "@/domain/geo/markets";
import { ListingCard, type ListingCardModel } from "@/features/catalog/listing-card";
import { Link } from "@/i18n/navigation";
import { searchCatalog } from "@/server/catalog/catalog";
import { getDisplayCurrency } from "@/server/preferences/currency";

function presentListing(
  listing: VehicleListing,
  locale: AppLocale,
  displayCurrency: Market["currency"],
  labels: {
    bodyType: string;
    transmission: string;
    seats: string;
    perDay: string;
    perMonth: string;
    noDeposit: string;
    airport: string;
    supplier: string;
    supplierPrice: string;
    view: string;
  },
): ListingCardModel {
  const dailyMinor = convertMinor(listing.dailyPriceMinor, listing.currency, displayCurrency);
  const monthlyMinor =
    listing.monthlyPriceMinor == null
      ? null
      : convertMinor(listing.monthlyPriceMinor, listing.currency, displayCurrency);

  return {
    href: listingPath({
      city: listing.city,
      make: listing.make,
      model: listing.model,
      id: listing.id,
    }),
    make: listing.make,
    model: listing.model,
    bodyType: labels.bodyType,
    transmission: labels.transmission,
    seats: labels.seats,
    supplier: listing.supplier,
    dailyPrice: formatMoney(dailyMinor, displayCurrency, locale),
    monthlyPrice: monthlyMinor == null ? null : formatMoney(monthlyMinor, displayCurrency, locale),
    supplierPrice:
      displayCurrency === listing.currency
        ? null
        : labels.supplierPrice.replace("{price}", formatMoney(listing.dailyPriceMinor, listing.currency, locale)),
    noDeposit: !listing.depositRequired,
    airport: listing.airportDelivery,
    perDay: labels.perDay,
    perMonth: labels.perMonth,
    noDepositLabel: labels.noDeposit,
    airportLabel: labels.airport,
    supplierLabel: labels.supplier,
    viewLabel: labels.view,
  };
}

export async function ListingSection({
  market,
  locale,
  query,
  heading,
  showPagination = false,
  allCities = false,
}: {
  market: Market;
  locale: AppLocale;
  query: VehicleSearchQuery;
  heading?: string;
  showPagination?: boolean;
  allCities?: boolean;
}) {
  const [currency, result, t, body] = await Promise.all([
    getDisplayCurrency(market.currency),
    searchCatalog(query, allCities ? { allCities: true } : undefined),
    getTranslations("Listings"),
    getTranslations("BodyTypes"),
  ]);
  const pages = Math.max(1, Math.ceil(result.total / result.limit));
  const cards = result.items.map((listing) =>
    presentListing(listing, locale, currency, {
      bodyType: body(listing.bodyType),
      transmission: t(listing.transmission),
      seats: t("seats", { count: listing.seats }),
      perDay: t("perDay"),
      perMonth: t("perMonth"),
      noDeposit: t("noDeposit"),
      airport: t("airport"),
      supplier: t("supplier"),
      supplierPrice: t("supplierPrice", { price: "{price}" }),
      view: t("view"),
    }),
  );

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        {heading ? <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2> : <span />}
        <p className="text-sm text-muted-foreground">{t("results", { count: result.total })}</p>
      </div>
      {cards.length === 0 ? (
        <div className="rounded-2xl border border-dashed px-6 py-12">
          <h3 className="text-lg font-semibold">{t("emptyTitle")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t("emptyBody")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((listing) => (
            <ListingCard key={listing.href} listing={listing} />
          ))}
        </div>
      )}
      {showPagination && result.total > result.limit ? (
        <nav className="flex items-center justify-between gap-3 text-sm" aria-label={t("pageStatus", { page: result.page, pages })}>
          {result.page > 1 ? (
            <Link href={catalogPath(market.city, { ...query, page: result.page - 1 })} className="rounded-lg border px-3 py-2">
              {t("previous")}
            </Link>
          ) : (
            <span className="rounded-lg border px-3 py-2 text-muted-foreground">{t("previous")}</span>
          )}
          <p>{t("pageStatus", { page: result.page, pages })}</p>
          {result.page < pages ? (
            <Link href={catalogPath(market.city, { ...query, page: result.page + 1 })} className="rounded-lg border px-3 py-2">
              {t("next")}
            </Link>
          ) : (
            <span className="rounded-lg border px-3 py-2 text-muted-foreground">{t("next")}</span>
          )}
        </nav>
      ) : null}
    </section>
  );
}
