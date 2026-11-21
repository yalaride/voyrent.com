import type { ReactNode } from "react";
import { Suspense } from "react";
import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { isLocale } from "@/domain/geo/locales";
import { marketFromPathname } from "@/domain/routing/market-from-path";
import { AppShell } from "@/features/shell/app-shell";
import { routing } from "@/i18n/routing";
import { getPreferredMarket } from "@/server/preferences/market";

export default function ShellLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-background" />}>
      <ShellDocument params={params}>{children}</ShellDocument>
    </Suspense>
  );
}

async function ShellDocument({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale =
    hasLocale(routing.locales, requested) && isLocale(requested)
      ? requested
      : routing.defaultLocale;

  setRequestLocale(locale);

  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "";
  const market = marketFromPathname(pathname) ?? (await getPreferredMarket());

  return (
    <AppShell locale={locale} market={market}>
      {children}
    </AppShell>
  );
}
