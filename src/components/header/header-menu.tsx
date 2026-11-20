"use client";

import { hasFlag } from "country-flag-icons";
import * as Flags from "country-flag-icons/react/3x2";
import { ChevronDownIcon, Settings2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition, type ComponentType } from "react";

import type { CurrencyCode } from "@/domain/currency/currencies";
import type { AppLocale } from "@/domain/geo/locales";
import { getCountry } from "@/domain/geo/markets";
import { cityRentPath } from "@/domain/routing/rent-paths";
import { CurrencySwitcher } from "@/features/shell/currency-switcher";
import { LocaleSwitcher } from "@/features/shell/locale-switcher";
import type { MarketGroup } from "@/features/shell/market-switcher";
import { setDisplayCurrency } from "@/features/preferences/set-currency";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function HeaderMenu({
  locale,
  currency,
  groups,
  active,
}: {
  locale: AppLocale;
  currency: CurrencyCode;
  groups: MarketGroup[];
  active?: {
    country: string;
    city: string;
    placeName: string;
    scope: "city" | "country";
  };
}) {
  const t = useTranslations("Header");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);

  // Draft state (applied ONLY when clicking Save)
  const [draftLocale, setDraftLocale] = useState<AppLocale>(locale);
  const [draftCurrency, setDraftCurrency] = useState<CurrencyCode>(currency);
  const [draftRegion, setDraftRegion] = useState({
    country: active?.country ?? "",
    city: active?.city ?? "",
    placeName: active?.placeName ?? t("chooseCity"),
  });

  useEffect(() => {
    if (!regionOpen) {
      return;
    }
    document.getElementById("region-selected")?.scrollIntoView({ block: "nearest" });
  }, [regionOpen, draftRegion.city, draftRegion.country]);

  function capitalOf(country: MarketGroup) {
    const slug = getCountry(country.code)?.capital;
    return country.cities.find((city) => city.slug === slug) ?? country.cities[0];
  }

  const countryCode =
    (draftRegion.country || active?.country || locale?.split("-")[0]?.toUpperCase())?.toUpperCase();
  const FlagIcon =
    countryCode && hasFlag(countryCode)
      ? (
          Flags as Record<
            string,
            ComponentType<{ className?: string; title?: string }>
          >
        )[countryCode]
      : null;

  const handleSave = () => {
    startTransition(async () => {
      if (draftCurrency !== currency) {
        await setDisplayCurrency(draftCurrency);
      }

      setDialogOpen(false);

      const regionChanged =
        draftRegion.city !== "" && draftRegion.city !== (active?.city ?? "");
      const currentPath = `${pathname}${window.location.search}`;
      const nextPath = regionChanged
        ? cityRentPath(draftRegion.city)
        : currentPath;

      if (nextPath !== currentPath || draftLocale !== locale) {
        router.push(nextPath, { locale: draftLocale });
      } else {
        router.refresh();
      }
    });
  };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        if (open) {
          setDraftLocale(locale);
          setDraftCurrency(currency);
          setDraftRegion({
            country: active?.country ?? "",
            city: active?.city ?? "",
            placeName: active?.placeName ?? t("chooseCity"),
          });
        } else {
          setRegionOpen(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 gap-1 border-none bg-transparent px-0 text-white hover:bg-white/10 hover:text-white group-data-[transparent=false]:text-text-primary group-data-[transparent=false]:hover:bg-primary/10 group-data-[transparent=false]:hover:text-primary lg:h-8 lg:gap-2 lg:px-2"
          aria-label={`${currency} - ${active?.placeName ?? t("menu")}`}
        >
          <span className="text-sm font-semibold tracking-wide">
            {currency}
          </span>
          <span className="text-xs opacity-80">•</span>
          {FlagIcon ? (
            <FlagIcon
              className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover shadow-xs"
              title={draftRegion.placeName}
            />
          ) : (
            <Settings2Icon className="size-4" />
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm rounded-3xl border-border-subtle bg-white p-6 shadow-2xl dark:bg-background-primary [&>button]:left-auto [&>button]:right-4 [&>button]:text-primary">
        <DialogHeader className="pb-2 text-center sm:text-center">
          <DialogTitle className="text-center text-lg font-semibold text-text-primary">
            {t("displaySettings")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t("displaySettings")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-1">
          {/* 1. Region */}
          <div
            role="button"
            tabIndex={0}
            aria-expanded={regionOpen}
            onClick={() => setRegionOpen((open) => !open)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setRegionOpen((open) => !open);
              }
            }}
            className={`relative cursor-pointer rounded-xl border bg-white px-3 py-3 transition-colors dark:bg-background-primary ${
              regionOpen
                ? "z-30 border-primary ring-1 ring-primary"
                : "z-10 border-border-default hover:border-primary"
            }`}
          >
            <span className="pointer-events-none absolute -top-2.5 start-3 bg-white px-1.5 text-xs font-medium text-text-secondary dark:bg-background-primary">
              {t("region")}
            </span>

            {/* Field Value & Arrow */}
            <div className="flex w-full items-center justify-between text-start text-sm font-medium text-text-primary">
              <span>{draftRegion.placeName}</span>
              <ChevronDownIcon
                className={`size-4 text-text-secondary transition-transform duration-200 ${
                  regionOpen ? "rotate-180 text-primary" : ""
                }`}
              />
            </div>

            {/* Floating List */}
            {regionOpen && (
              <>
                {/* Backdrop to close when clicking outside */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRegionOpen(false);
                  }}
                />

                {/* Floating list */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute start-0 top-[calc(100%+6px)] z-50 max-h-56 w-full overflow-y-auto rounded-xl border border-border-default bg-white p-2 shadow-2xl dark:bg-background-primary"
                >
                  {groups.map((country) => {
                    return (
                    <section key={country.code} className="mb-2 last:mb-0">
                      <button
                        type="button"
                        className="flex w-full cursor-pointer rounded-md px-2 py-1.5 text-start text-sm font-semibold text-text-primary transition-colors hover:bg-primary/10 hover:text-primary"
                        onClick={(event) => {
                          event.stopPropagation();
                          const capital = capitalOf(country);
                          if (!capital) {
                            return;
                          }
                          setDraftRegion({
                            country: country.code,
                            city: capital.slug,
                            placeName: capital.name,
                          });
                          setRegionOpen(false);
                        }}
                      >
                        {country.name}
                      </button>

                      <div className="grid gap-0.5 ps-3">
                        {country.cities.map((city) => {
                          const selected =
                            draftRegion.country === country.code &&
                            draftRegion.city === city.slug;

                          return (
                          <button
                            key={city.slug}
                            id={selected ? "region-selected" : undefined}
                            type="button"
                            aria-current={selected ? "true" : undefined}
                            className={`flex w-full cursor-pointer rounded-md px-2 py-1 text-start text-sm transition-colors hover:bg-primary/10 hover:text-primary ${
                              selected
                                ? "bg-primary/10 font-semibold text-primary"
                                : "text-text-secondary"
                            }`}
                            onClick={(event) => {
                              event.stopPropagation();
                              setDraftRegion({
                                country: country.code,
                                city: city.slug,
                                placeName: city.name,
                              });
                              setRegionOpen(false);
                            }}
                          >
                            {city.name}
                          </button>
                          );
                        })}
                      </div>
                    </section>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* 2. Language */}
          <LocaleSwitcher
            locale={draftLocale}
            label={t("language")}
            onChange={(next) => setDraftLocale(next)}
          />

          {/* 3. Currency */}
          <CurrencySwitcher
            value={draftCurrency}
            label={t("currency")}
            onChange={(next) => setDraftCurrency(next)}
          />

          {/* Save Button */}
          <Button
            type="button"
            disabled={isPending}
            onClick={handleSave}
            className="mt-2 w-full cursor-pointer rounded-full bg-primary py-3 text-base font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {t("save")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
