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
        <p className="text-sm text-muted-foreground">
          <Link href={catalogPath(market.city, { make: listing.makeSlug })} className="hover:underline">
            {t("back")}
          </Link>
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          {listing.make} {listing.model}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {body(listing.bodyType)} · {cityName}
        </p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border p-4">
            <dt className="text-sm text-muted-foreground">{t("supplier")}</dt>
            <dd className="mt-1 font-medium">{listing.supplier}</dd>
          </div>
          <div className="rounded-2xl border p-4">
            <dt className="text-sm text-muted-foreground">{body("title")}</dt>
            <dd className="mt-1 font-medium">{body(listing.bodyType)}</dd>
          </div>
          <div className="rounded-2xl border p-4">
            <dt className="text-sm text-muted-foreground">{t(listing.transmission)}</dt>
            <dd className="mt-1 font-medium">{t("seats", { count: listing.seats })}</dd>
          </div>
        </dl>
      </div>
      <aside className="h-fit rounded-2xl border bg-card p-5">
        <p className="text-3xl font-semibold tracking-tight">
          {daily} <span className="text-base font-normal text-muted-foreground">{t("perDay")}</span>
        </p>
        {monthly ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {monthly} {t("perMonth")}
          </p>
        ) : null}
        {currency !== listing.currency ? (
          <p className="mt-2 text-sm text-muted-foreground">
            {t("supplierPrice", {
              price: formatMoney(listing.dailyPriceMinor, listing.currency, locale),
            })}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {!listing.depositRequired ? (
            <span className="rounded-full bg-accent px-2 py-0.5 text-xs">{t("noDeposit")}</span>
          ) : null}
          {listing.airportDelivery ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{t("airport")}</span>
          ) : null}
        </div>
        <button
          type="button"
          disabled
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground opacity-60"
        >
          {t("request")}
        </button>
        <p className="mt-3 text-sm text-muted-foreground">{t("requestNote")}</p>
      </aside>
    </article>
  );
}
