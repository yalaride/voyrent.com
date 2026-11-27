import { Suspense } from "react";
import { UserRoundIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/domain/geo/locales";
import { getMarket, localize, type Market } from "@/domain/geo/markets";
import { HeaderShell } from "@/features/shell/header-shell";
import { HeaderNav, loadHeaderNav } from "@/features/shell/header-nav";
import { HeaderMenu } from "@/components/header/header-menu";
import { MobileMenu } from "@/features/shell/mobile-menu";
import { Link } from "@/i18n/navigation";
import { getDisplayCurrency } from "@/server/preferences/currency";
import { site } from "@/lib/config/site";
import { readStoredMarket } from "@/server/preferences/market";
import { listMarketReference } from "@/server/reference/repository";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

async function Preferences({
  locale,
  pageMarket,
  scope,
  groups,
}: {
  locale: AppLocale;
  pageMarket?: Market;
  scope: "city" | "country";
  groups: {
    code: string;
    name: string;
    cities: { slug: string; name: string }[];
  }[];
}) {
  const t = await getTranslations({ locale, namespace: "Header" });
  const chosen = await readStoredMarket();
  const market =
    chosen ?? pageMarket ?? getMarket(site.defaultCountry, site.defaultCity);
  const active = market
    ? {
        country: market.country,
        city: market.city,
        placeName:
          !chosen && scope === "country"
            ? localize(market.countryNames, locale)
            : localize(market.cityNames, locale),
        scope: chosen ? ("city" as const) : scope,
      }
    : undefined;
  const currency = await getDisplayCurrency(market?.currency ?? "AED");

  return (
    <div className="ms-auto flex h-6 shrink-0 items-center justify-end gap-3 self-center text-body font-medium leading-[1.5] lg:h-auto">
      <div className="flex h-full items-center gap-3">
        <div data-header-preferences className="flex items-center">
          <HeaderMenu
            key={`${locale}-${currency}-${active?.country ?? ""}-${active?.city ?? ""}`}
            locale={locale}
            currency={currency}
            groups={groups}
            active={active}
          />
        </div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="size-6 border-none bg-transparent p-0 text-body font-medium leading-[1.5] text-text-inverse transition-colors hover:bg-white/10 hover:text-text-inverse group-data-[transparent=false]:text-text-primary group-data-[transparent=false]:hover:bg-primary/10 group-data-[transparent=false]:hover:text-primary in-data-[mega-menu-open=true]:text-text-primary in-data-[mega-menu-open=true]:hover:bg-primary/10 in-data-[mega-menu-open=true]:hover:text-primary lg:h-9 lg:w-auto lg:gap-2 lg:px-2"
          aria-label={`${currency} - ${active?.placeName ?? t("menu")}`}
        >
          <Link
            href="/auth/signin"
            className="flex items-center justify-center"
          >
            <UserRoundIcon className="size-6 shrink-0" aria-hidden="true" />
            <span className="hidden whitespace-nowrap text-body font-medium leading-[1.5] lg:inline">
              {t("signIn")}
            </span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

async function MobileEntry({
  locale,
  pageMarket,
}: {
  locale: AppLocale;
  pageMarket?: Market;
}) {
  const nav = await loadHeaderNav(locale, pageMarket);
  return <MobileMenu locale={locale} nav={nav} />;
}

export async function SiteHeader({
  locale,
  market,
  scope = "city",
  sticky = false,
}: {
  locale: AppLocale;
  market?: Market;
  scope?: "city" | "country";
  sticky?: boolean;
}) {
  const t = await getTranslations({ locale, namespace: "Header" });
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
    <HeaderShell sticky={sticky}>
      <div className="relative flex h-20 w-full items-stretch justify-between gap-4">
        {/* Left: Brand Logo (28px mobile, 36px tablet & desktop) + Desktop Nav */}
        <div className="flex min-w-0 items-stretch gap-3 lg:gap-8">
          <Link
            href={homeHref}
            prefetch={false}
            dir="ltr"
            className="flex shrink-0 items-center self-center text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-text-inverse transition-opacity hover:opacity-90 group-data-[transparent=false]:text-text-primary in-data-[mega-menu-open=true]:text-text-primary sm:text-[36px]"
          >
            <span>Voy</span>
            <span className="text-primary">Rent</span>
          </Link>

          <nav className="hidden h-full self-stretch lg:flex">
            <Suspense
              fallback={
                <div className="flex items-center gap-6 text-body font-medium leading-[1.5] text-text-inverse/85 group-data-[transparent=false]:text-text-primary in-data-[mega-menu-open=true]:text-text-primary">
                  <span>{t("rentCar")}</span>
                  <span>{t("carBrands")}</span>
                  <span>{t("dealers")}</span>
                </div>
              }
            >
              <HeaderNav locale={locale} pageMarket={market} />
            </Suspense>
          </nav>
        </div>

        {/* Right: Country/Currency + Profile Icon + Mobile/Tablet Toggle Icon */}
        <div className="ms-auto flex shrink-0 items-center gap-3 self-center">
          <Suspense
            fallback={<Skeleton className="h-8 w-28 shrink-0 bg-white/20" />}
          >
            <Preferences
              locale={locale}
              pageMarket={market}
              scope={scope}
              groups={groups}
            />
          </Suspense>

          <Suspense
            fallback={<span className="size-6 self-center lg:hidden" />}
          >
            <MobileEntry locale={locale} pageMarket={market} />
          </Suspense>
        </div>
      </div>
    </HeaderShell>
  );
}
