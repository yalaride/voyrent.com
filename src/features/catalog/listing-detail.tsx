import { getTranslations } from "next-intl/server";

import type { VehicleListing } from "@/domain/catalog/types";
import { convertMinor, formatMoney } from "@/domain/currency/format";
import type { AppLocale } from "@/domain/geo/locales";
import { localize, type Market } from "@/domain/geo/markets";
import { catalogPath } from "@/domain/routing/rent-paths";
import { Link } from "@/i18n/navigation";
import { getDisplayCurrency } from "@/server/preferences/currency";

export async function ListingDetail({
  market,
  locale,
  listing,
}: {
  market: Market;
  locale: AppLocale;
  listing: VehicleListing;
}) {
  const [t, body, currency] = await Promise.all([
    getTranslations("Listings"),
    getTranslations("BodyTypes"),
    getDisplayCurrency(market.currency),
  ]);
  const cityName = localize(market.cityNames, locale);
  const daily = formatMoney(
    convertMinor(listing.dailyPriceMinor, listing.currency, currency),
    currency,
    locale,
  );
  const monthly =
    listing.monthlyPriceMinor == null
      ? null
      : formatMoney(convertMinor(listing.monthlyPriceMinor, listing.currency, currency), currency, locale);

  return (
    <article className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1.4fr_0.8fr]">
      <div>
        <p className="text-sm text-text-secondary">
          <Link href={catalogPath(market.city, { make: listing.makeSlug })} className="text-link hover:underline">
            {t("back")}
          </Link>
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-text-primary">
          {listing.make} {listing.model}
        </h1>
        <p className="mt-2 text-text-secondary">
          {body(listing.bodyType)} · {cityName}
        </p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border-default bg-background-primary p-4">
            <dt className="text-sm text-text-secondary">{t("supplier")}</dt>
            <dd className="mt-1 font-medium text-text-primary">{listing.supplier}</dd>
          </div>
          <div className="rounded-2xl border border-border-default bg-background-primary p-4">
            <dt className="text-sm text-text-secondary">{body("title")}</dt>
            <dd className="mt-1 font-medium text-text-primary">{body(listing.bodyType)}</dd>
          </div>
          <div className="rounded-2xl border border-border-default bg-background-primary p-4">
            <dt className="text-sm text-text-secondary">{t(listing.transmission)}</dt>
            <dd className="mt-1 font-medium text-text-primary">{t("seats", { count: listing.seats })}</dd>
          </div>
        </dl>
      </div>
      <aside className="h-fit rounded-2xl border border-border-default bg-background-primary p-5 shadow-small">
        <p className="text-3xl font-semibold tracking-tight text-text-primary">
          {daily} <span className="text-base font-normal text-text-secondary">{t("perDay")}</span>
        </p>
        {monthly ? (
          <p className="mt-1 text-sm text-text-secondary">
            {monthly} {t("perMonth")}
          </p>
        ) : null}
        {currency !== listing.currency ? (
          <p className="mt-2 text-sm text-text-secondary">
            {t("supplierPrice", {
              price: formatMoney(listing.dailyPriceMinor, listing.currency, locale),
            })}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {!listing.depositRequired ? (
            <span className="rounded-full bg-background-secondary px-2 py-0.5 text-xs text-text-primary">
              {t("noDeposit")}
            </span>
          ) : null}
          {listing.airportDelivery ? (
            <span className="rounded-full bg-background-secondary px-2 py-0.5 text-xs text-text-primary">
              {t("airport")}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          disabled
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-text-inverse opacity-60"
        >
          {t("request")}
        </button>
        <p className="mt-3 text-sm text-text-secondary">{t("requestNote")}</p>
      </aside>
    </article>
  );
}
