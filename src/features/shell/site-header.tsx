import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import type { CurrencyCode } from "@/domain/currency/currencies";
import type { AppLocale } from "@/domain/geo/locales";
import { localize, type Market } from "@/domain/geo/markets";
import { CurrencySwitcher } from "@/features/shell/currency-switcher";
import { LocaleSwitcher } from "@/features/shell/locale-switcher";
import { MarketSwitcher } from "@/features/shell/market-switcher";
import { MobileMenu } from "@/features/shell/mobile-menu";
import { Link } from "@/i18n/navigation";
import { getDisplayCurrency } from "@/server/preferences/currency";
import { listMarketReference } from "@/server/reference/repository";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

async function Preferences({
  locale,
  fallback,
}: {
  locale: AppLocale;
  fallback: CurrencyCode;
}) {
  const t = await getTranslations("Header");
  const currency = await getDisplayCurrency(fallback);

  return (
    <>
      <div className="hidden items-center gap-1 md:flex">
        <LocaleSwitcher locale={locale} label={t("language")} />
        <CurrencySwitcher value={currency} label={t("currency")} />
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dealers">{t("dealers")}</Link>
        </Button>
      </div>
      <MobileMenu locale={locale} currency={currency} />
    </>
  );
}

export async function SiteHeader({
  locale,
  market,
  scope = "city",
}: {
  locale: AppLocale;
  market?: Market;
  scope?: "city" | "country";
}) {
  const t = await getTranslations("Header");
  const countries = await listMarketReference();
  const groups = countries.map((country) => ({
    code: country.code,
    name: localize(country.names, locale),
    cities: country.cities.map((city) => ({
      slug: city.slug,
      name: localize(city.names, locale),
    })),
  }));
  const homeHref = "/";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link href={homeHref} className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-foreground text-sm text-background">G</span>
          <span>GleeCars</span>
        </Link>
        <MarketSwitcher
          label={t("chooseCity")}
          groups={groups}
          active={
            market
              ? {
                  country: market.country,
                  city: market.city,
                  placeName: scope === "country" ? localize(market.countryNames, locale) : localize(market.cityNames, locale),
                  scope,
                }
              : undefined
          }
        />
        <div className="ms-auto flex items-center gap-1">
          <Suspense fallback={<Skeleton className="h-8 w-28" />}>
            <Preferences locale={locale} fallback={market?.currency ?? "AED"} />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
