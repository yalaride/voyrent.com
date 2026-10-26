import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { isLocale } from "@/domain/geo/locales";
import { getMarket, type Market } from "@/domain/geo/markets";
import { homeMarketForHostname } from "@/domain/routing/hosts";
import { MarketHome } from "@/features/home/market-home";
import { AppShell } from "@/features/shell/app-shell";
import { routing } from "@/i18n/routing";
import { buildRentMetadata, websiteJsonLd } from "@/server/seo/metadata";

async function marketForRequest(): Promise<Market | undefined> {
  const headerStore = await headers();
  const host = (headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "").split(":")[0] ?? "";
  const home = homeMarketForHostname(host);
  return getMarket(home.country, home.city);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const market = await marketForRequest();

  if (!isLocale(locale) || !market) {
    return {};
  }

  return buildRentMetadata({
    locale,
    view: { kind: "city", market },
    path: "/",
    indexable: true,
  });
}

export default function LocaleIndex({ params }: { params: Promise<{ locale: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-background" />}>
      <HomePage params={params} />
    </Suspense>
  );
}

async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale) || !isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const market = await marketForRequest();

  if (!market) {
    notFound();
  }

  return (
    <AppShell locale={locale} market={market}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd(market, locale)) }} />
      <MarketHome market={market} locale={locale} />
    </AppShell>
  );
}
