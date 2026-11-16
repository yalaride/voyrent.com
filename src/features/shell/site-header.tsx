import { Suspense } from "react";
import { UserRoundIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { CurrencyCode } from "@/domain/currency/currencies";
import type { AppLocale } from "@/domain/geo/locales";
import { localize, type Market } from "@/domain/geo/markets";
import { HeaderShell } from "@/features/shell/header-shell";
import { HeaderMenu } from "@/components/header/header-menu";
import { MobileMenu } from "@/features/shell/mobile-menu";
import { Link } from "@/i18n/navigation";
import { getDisplayCurrency } from "@/server/preferences/currency";
import { listMarketReference } from "@/server/reference/repository";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

async function Preferences({
  locale,
  fallback,
  groups,
  active,
}: {
  locale: AppLocale;
  fallback: CurrencyCode;
  groups: {
    code: string;
    name: string;
    cities: { slug: string; name: string }[];
  }[];
  active?: {
    country: string;
    city: string;
    placeName: string;
    scope: "city" | "country";
  };
}) {
  const t = await getTranslations("Header");
  const currency = await getDisplayCurrency(fallback);

  return (
    <div className="ml-auto flex h-[25px] w-[150px] items-center justify-end gap-3 lg:h-auto lg:w-auto">
      <div className="flex h-full items-center gap-3">
        <HeaderMenu
          key={`${locale}-${currency}-${active?.country ?? ""}-${active?.city ?? ""}`}
          locale={locale}
          currency={currency}
          groups={groups}
          active={active}
        />
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="size-6 border-none bg-transparent p-0 text-white transition-colors hover:bg-white/10 hover:text-white group-data-[transparent=false]:text-text-primary group-data-[transparent=false]:hover:bg-primary/10 group-data-[transparent=false]:hover:text-primary lg:h-9 lg:w-auto lg:gap-2 lg:px-2"
          aria-label={`${currency} - ${active?.placeName ?? t("menu")}`}
        >
          <Link href="/auth/signin" className="flex items-center justify-center">
            <UserRoundIcon className="size-4 lg:hidden" aria-hidden="true" />
            <span className="hidden lg:inline">{t("signIn")}</span>
          </Link>
        </Button>
      </div>
      <MobileMenu locale={locale} currency={currency} />
    </div>
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
  const active = market
    ? {
        country: market.country,
        city: market.city,
        placeName:
          scope === "country"
            ? localize(market.countryNames, locale)
            : localize(market.cityNames, locale),
        scope,
      }
    : undefined;

  return (
    <HeaderShell>
      <div className="flex h-20 w-full items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-8">
          <Link
            href={homeHref}
            className="flex h-[34px] w-[117px] items-center text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-90 group-data-[transparent=false]:text-text-primary lg:h-auto lg:w-auto lg:text-2xl"
          >
            <span>Glee</span>
            <span className="text-primary">Cars</span>
          </Link>

          <nav className="hidden items-center gap-6 text-body-small font-medium lg:flex">
            <Link
              href="/"
              className="text-white/85 transition-colors hover:text-white group-data-[transparent=false]:text-text-primary group-data-[transparent=false]:hover:text-link"
            >
              {t("rentCar")}
            </Link>
            <Link
              href="/catalog"
              className="text-white/85 transition-colors hover:text-white group-data-[transparent=false]:text-text-primary group-data-[transparent=false]:hover:text-link"
            >
              {t("carBrands")}
            </Link>
            <Link
              href="/dealers"
              className="text-white/85 transition-colors hover:text-white group-data-[transparent=false]:text-text-primary group-data-[transparent=false]:hover:text-link"
            >
              {t("dealers")}
            </Link>
          </nav>
        </div>

        <Suspense fallback={<Skeleton className="h-8 w-28 bg-white/20" />}>
          <Preferences
            locale={locale}
            fallback={market?.currency ?? "AED"}
            groups={groups}
            active={active}
          />
        </Suspense>
      </div>
    </HeaderShell>
  );
}
