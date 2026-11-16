import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/domain/geo/locales";
import type { Market } from "@/domain/geo/markets";
import { SiteFooter } from "@/features/shell/site-footer";
import { SiteHeader } from "@/features/shell/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export async function AppShell({
  locale,
  market,
  scope = "city",
  children,
}: {
  locale: AppLocale;
  market?: Market;
  scope?: "city" | "country";
  children: React.ReactNode;
}) {
  const t = await getTranslations("Header");

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-background-primary focus:px-3 focus:py-2 focus:text-text-primary"
      >
        {t("skip")}
      </a>
      <SiteHeader locale={locale} market={market} scope={scope} />
      <main id="content" className="flex-1">
        <Suspense
          fallback={
            <div className="grid gap-4 py-10">
              <Skeleton className="h-10 w-72" />
              <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
          }
        >
          {children}
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
