import type { ReactNode } from "react";
import { Suspense } from "react";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { isLocale } from "@/domain/geo/locales";
import { AppShell } from "@/features/shell/app-shell";
import { routing } from "@/i18n/routing";

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

  return <AppShell locale={locale}>{children}</AppShell>;
}
