import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { isLocale } from "@/domain/geo/locales";
import { getMarket } from "@/domain/geo/markets";
import { MarketHome } from "@/features/home/market-home";
import { AppShell } from "@/features/shell/app-shell";
import { routing } from "@/i18n/routing";
import { buildRentMetadata, websiteJsonLd } from "@/server/seo/metadata";
import { requestLocale } from "@/server/seo/request-locale";

function homeMarket() {
  return getMarket("ae", "dubai");
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const market = homeMarket();

  if (!locale || !market) {
    return {};
  }

  return buildRentMetadata({
    locale,
    view: { kind: "city", market },
    path: "/",
    indexable: true,
  });
}

export default function LocaleIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
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
  const market = homeMarket();

  if (!market) {
    notFound();
  }

  return (
    <AppShell locale={locale} market={market}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd(market, locale)),
        }}
      />
      <MarketHome market={market} locale={locale} />
    </AppShell>
  );
}
