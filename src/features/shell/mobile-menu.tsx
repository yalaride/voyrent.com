"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, MenuIcon, SearchIcon, XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import type { AppLocale } from "@/domain/geo/locales";
import type { HeaderNavModel, NavLinkItem } from "@/features/shell/mega-menus";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function MobileMenu({ locale, nav }: { locale: AppLocale; nav: HeaderNavModel }) {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const [panel, setPanel] = useState<"rent" | "brands" | null>(null);
  const side = locale === "ar" ? "right" : "left";
  const categories = nav.columns[0];
  const viewAll = categories?.links[0];
  const categoryLinks = categories?.links.slice(1) ?? [];

  return (
    <Sheet
      key={pathname}
      onOpenChange={(open) => {
        if (!open) setPanel(null);
      }}
    >
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 self-center text-white hover:bg-white/10 hover:text-white group-data-[transparent=false]:text-text-primary group-data-[transparent=false]:hover:bg-primary/10 group-data-[transparent=false]:hover:text-primary lg:hidden"
          aria-label={t("openMenu")}
        >
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={side}
        showCloseButton={false}
        className="w-[88vw] max-w-[400px] gap-0 overflow-hidden bg-white p-0 text-[#373737] data-[side=left]:w-[88vw] data-[side=left]:max-w-[400px] data-[side=right]:w-[88vw] data-[side=right]:max-w-[400px] data-[side=left]:sm:max-w-[400px] data-[side=right]:sm:max-w-[400px]"
      >
        <SheetTitle className="sr-only">{t("menu")}</SheetTitle>
        <div className="relative flex h-full flex-col">
          <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-[#eee] px-4">
            <Link href="/" prefetch={false} dir="ltr" className="text-xl font-bold tracking-tight text-text-primary">
              <span>Voy</span>
              <span className="text-primary">Rent</span>
            </Link>
            <SheetClose asChild>
              <button type="button" className="grid size-10 place-items-center text-[#373737]" aria-label={t("closeMenu")}>
                <XIcon className="size-5" />
              </button>
            </SheetClose>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <DrawerRow label={nav.rentLabel} onClick={() => setPanel("rent")} />
            <DrawerRow label={nav.brandsLabel} onClick={() => setPanel("brands")} />
            <Link
              href="/dealer-plans"
              prefetch={false}
              className="flex items-center border-b border-[#eee] px-5 py-[22px] text-[15px] text-[#4d4d4d]"
            >
              {nav.dealersLabel}
            </Link>
          </div>

          {panel ? (
            <div className="absolute inset-0 z-10 flex flex-col bg-white">
              <button
                type="button"
                className="flex h-[73px] shrink-0 items-center gap-3 bg-[#eeeeee] px-4 text-lg font-medium text-[#373737]"
                onClick={() => setPanel(null)}
              >
                <ChevronLeftIcon className="size-5 rtl:rotate-180" aria-hidden="true" />
                {panel === "rent" ? nav.rentLabel : nav.brandsLabel}
                <span className="sr-only">{t("back")}</span>
              </button>
              <div className="min-h-0 flex-1 overflow-y-auto pb-8">
                {panel === "rent" ? (
                  <RentPanel
                    viewAll={viewAll}
                    sections={[
                      { title: categories?.title ?? "", links: categoryLinks },
                      nav.dealers,
                      ...(nav.columns.slice(1).map((column) => ({
                        title: column.title,
                        links: column.links,
                      })) ?? []),
                      ...nav.columns.flatMap((column) =>
                        column.extra ? [column.extra] : [],
                      ),
                    ]}
                  />
                ) : (
                  <BrandPanel nav={nav} />
                )}
              </div>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DrawerRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between border-b border-[#eee] px-5 py-[22px] text-start text-[15px] text-[#4d4d4d]"
      onClick={onClick}
    >
      {label}
      <ChevronRightIcon className="size-4 text-[#9a9a9a] rtl:rotate-180" aria-hidden="true" />
    </button>
  );
}

function RentPanel({
  viewAll,
  sections,
}: {
  viewAll?: NavLinkItem;
  sections: { title: string; links: NavLinkItem[] }[];
}) {
  return (
    <>
      {viewAll ? (
        <Link
          href={viewAll.href}
          prefetch={false}
          className="flex items-center justify-between border-b border-[#eee] px-5 py-3 text-[13px] text-[#4d4d4d]"
        >
          {viewAll.label}
          <ChevronRightIcon className="size-3.5 text-[#9a9a9a] rtl:rotate-180" aria-hidden="true" />
        </Link>
      ) : null}
      {sections.map((section) =>
        section.links.length === 0 ? null : (
          <section key={section.title}>
            <p className="px-5 pt-5 pb-1 text-[15px] font-medium text-primary">{section.title}</p>
            <ul>
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="block px-5 py-2.5 text-[13px] text-[#4d4d4d]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ),
      )}
    </>
  );
}

function BrandPanel({ nav }: { nav: HeaderNavModel }) {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const brands = needle
    ? nav.brands.filter((brand) => brand.name.toLowerCase().includes(needle))
    : nav.brands;

  return (
    <>
      <label className="relative block border-b border-[#eee]">
        <SearchIcon
          className="pointer-events-none absolute start-5 top-1/2 size-4 -translate-y-1/2 text-[#9a9a9a]"
          aria-hidden="true"
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={nav.searchPlaceholder}
          className="h-12 w-full bg-white ps-11 pe-4 text-[13px] text-[#373737] outline-none placeholder:text-[#9a9a9a]"
        />
      </label>
      {brands.length === 0 ? (
        <p className="px-5 py-6 text-[13px] text-[#9a9a9a]">{nav.emptyBrands}</p>
      ) : (
        <ul>
          {brands.map((brand) => (
            <li key={brand.href} className="border-b border-[#eee]">
              <Link
                href={brand.href}
                prefetch={false}
                className="flex items-center gap-3 px-5 py-3 text-[13px] text-[#4d4d4d]"
              >
                {brand.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={brand.logo} alt="" className="size-5 object-contain" />
                ) : (
                  <span className="grid size-5 place-items-center text-[11px] font-semibold text-[#9a9a9a]">
                    {brand.name.slice(0, 1)}
                  </span>
                )}
                <span>
                  {brand.name}
                  {brand.countLabel ? <span className="text-[#9a9a9a]"> ({brand.countLabel})</span> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
