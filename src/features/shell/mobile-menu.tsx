"use client";

import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { CurrencyCode } from "@/domain/currency/currencies";
import type { AppLocale } from "@/domain/geo/locales";
import { CurrencySwitcher } from "@/features/shell/currency-switcher";
import { LocaleSwitcher } from "@/features/shell/locale-switcher";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function MobileMenu({ locale, currency }: { locale: AppLocale; currency: CurrencyCode }) {
  const t = useTranslations("Header");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label={t("openMenu")}>
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("menu")}</SheetTitle>
        </SheetHeader>
        <div className="grid justify-items-start gap-3 px-4">
          <LocaleSwitcher locale={locale} label={t("language")} />
          <CurrencySwitcher value={currency} label={t("currency")} />
          <Button variant="outline" asChild>
            <Link href="/dealers">{t("dealers")}</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
