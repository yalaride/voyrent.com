import { getLocale, getTranslations } from "next-intl/server";

import { isLocale, type AppLocale } from "@/domain/geo/locales";
import { AppShell } from "@/features/shell/app-shell";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getPreferredMarket } from "@/server/preferences/market";

export default async function LocaleNotFound() {
  const requested = await getLocale().catch(() => routing.defaultLocale);
  const locale: AppLocale = isLocale(requested) ? requested : routing.defaultLocale;
  const market = await getPreferredMarket();
  const t = await getTranslations("Errors");

  return (
    <AppShell locale={locale} market={market}>
      <div className="mx-auto max-w-lg px-4 py-24">
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          {t("notFoundTitle")}
        </h1>
        <p className="mt-3 text-text-secondary">{t("notFoundBody")}</p>
        <Link href="/" className="mt-6 inline-flex text-sm font-medium text-link underline">
          {t("home")}
        </Link>
      </div>
    </AppShell>
  );
}
