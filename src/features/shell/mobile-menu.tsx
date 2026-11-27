"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MenuIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { BRAND_LOGOS, formatBrandName } from "@/domain/catalog/brand-logos";
import type { AppLocale } from "@/domain/geo/locales";
import {
  buildBrandHref,
  extractBrandSlug,
  type HeaderNavModel,
  type NavLinkItem,
} from "@/features/shell/mega-menus";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileMenu({
  locale,
  nav,
}: {
  locale: AppLocale;
  nav: HeaderNavModel;
}) {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const [panel, setPanel] = useState<"rent" | "brands" | null>(null);
  const side = locale === "ar" ? "right" : "left";
  const categories = nav.columns[0];
  const viewAll = categories?.links[0];
  const categoryLinks = categories?.links.slice(1) ?? [];
  const profileLabel = t.has("myProfile" as never)
    ? t("myProfile" as never)
    : "My Profile";

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
          className="size-6 self-center p-0 text-text-inverse transition-colors hover:bg-white/10 hover:text-text-inverse group-data-[transparent=false]:text-text-primary group-data-[transparent=false]:hover:bg-primary/10 group-data-[transparent=false]:hover:text-primary lg:hidden"
          aria-label={t("openMenu")}
        >
          <MenuIcon className="size-6" strokeWidth={2} aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={side}
        showCloseButton={false}
        className="inset-x-0 w-full! max-w-none! gap-0 overflow-hidden border-0 bg-background-primary p-0 text-text-primary sm:w-full sm:max-w-none md:max-w-none data-[side=left]:w-full data-[side=left]:max-w-none data-[side=left]:border-0 data-[side=left]:sm:max-w-none data-[side=right]:w-full data-[side=right]:max-w-none data-[side=right]:border-0 data-[side=right]:sm:max-w-none"
      >
        <SheetTitle className="sr-only">{t("menu")}</SheetTitle>
        <div className="relative flex h-full flex-col">
          <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-border-subtle px-4">
            <Link
              href="/"
              prefetch={false}
              dir="ltr"
              className="text-[36px] font-semibold leading-[1.2] tracking-[-0.02em] text-text-primary"
            >
              <span>Voy</span>
              <span className="text-primary">Rent</span>
            </Link>
            <SheetClose asChild>
              <button
                type="button"
                className="grid size-10 shrink-0 place-items-center rounded-full border border-border-default text-text-primary transition-colors hover:bg-primary/10 hover:text-primary"
                aria-label={t("closeMenu")}
              >
                <XIcon className="size-5" aria-hidden="true" />
              </button>
            </SheetClose>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4">
            <DrawerRow label={nav.rentLabel} onClick={() => setPanel("rent")} />
            <DrawerRow
              label={nav.brandsLabel}
              onClick={() => setPanel("brands")}
            />
            <DrawerLink href="/dealer-plans" label={nav.dealersLabel} />
            <DrawerLink href="/auth/signin" label={profileLabel} />
          </div>

          {panel ? (
            <div className="absolute inset-0 z-10 flex flex-col bg-background-primary">
              <button
                type="button"
                className="flex h-[68px] shrink-0 items-center gap-3 border-b border-border-subtle bg-background-secondary px-4 text-body-large font-medium leading-[1.4] text-text-primary"
                onClick={() => setPanel(null)}
              >
                <ChevronLeftIcon
                  className="size-5 rtl:rotate-180"
                  aria-hidden="true"
                />
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

const drawerRowClass =
  "flex min-h-[57px] w-full items-center justify-between border-b border-border-subtle p-4 text-start text-body-large font-medium leading-[1.4] text-text-primary transition-colors hover:bg-primary/10 hover:text-primary active:bg-primary/10 active:text-primary";

function DrawerRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className={drawerRowClass} onClick={onClick}>
      <span>{label}</span>
      <ChevronRightIcon
        className="size-3 shrink-0 text-text-secondary rtl:rotate-180"
        aria-hidden="true"
      />
    </button>
  );
}

function DrawerLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} prefetch={false} className={drawerRowClass}>
      <span>{label}</span>
      <ChevronRightIcon
        className="size-3 shrink-0 text-text-secondary rtl:rotate-180"
        aria-hidden="true"
      />
    </Link>
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
          className="flex items-center justify-between border-b border-border-subtle px-5 py-3 text-body-small font-medium text-text-primary transition-colors hover:bg-primary/10 hover:text-primary"
        >
          {viewAll.label}
          <ChevronRightIcon
            className="size-3 shrink-0 text-text-secondary rtl:rotate-180"
            aria-hidden="true"
          />
        </Link>
      ) : null}
      {sections.map((section) =>
        section.links.length === 0 ? null : (
          <section key={section.title}>
            <p className="px-5 pt-5 pb-1 text-[15px] font-medium text-primary">
              {section.title}
            </p>
            <ul>
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="block px-5 py-2.5 text-body-small text-text-primary transition-colors hover:bg-primary/10 hover:text-primary"
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
  const tBrands = useTranslations("Brands");
  const [query, setQuery] = useState("");

  const baseRentHref =
    nav.viewAllRentHref ?? nav.columns[0]?.links[0]?.href?.split("?")[0] ?? "/";

  const allBrands = useMemo(() => {
    const seen = new Set<string>();
    const result: {
      slug: string;
      name: string;
      href: string;
      countLabel?: string;
      logo?: string;
    }[] = [];

    const getBrandName = (slug: string, fallback?: string) => {
      const key = slug.toLowerCase();
      if (tBrands.has(key as never)) {
        return tBrands(key as never);
      }
      return fallback || formatBrandName(key);
    };

    const sampleHref = nav.brands[0]?.href;

    for (const brand of nav.brands) {
      const slug = extractBrandSlug(brand);
      if (seen.has(slug)) continue;
      seen.add(slug);
      result.push({
        slug,
        name: getBrandName(slug, brand.name),
        href: brand.href,
        countLabel: brand.countLabel,
        logo: brand.logo ?? BRAND_LOGOS[slug],
      });
    }

    for (const [slug, logo] of Object.entries(BRAND_LOGOS)) {
      const normalized = slug.toLowerCase();
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      result.push({
        slug: normalized,
        name: getBrandName(normalized),
        href: buildBrandHref(normalized, sampleHref, baseRentHref),
        logo,
      });
    }

    return result;
  }, [nav.brands, baseRentHref, tBrands]);

  const needle = query.trim().toLowerCase();
  const brands = needle
    ? allBrands.filter(
        (brand) =>
          brand.name.toLowerCase().includes(needle) ||
          brand.slug.includes(needle),
      )
    : allBrands;

  return (
    <>
      <label className="relative block border-b border-border-subtle">
        <SearchIcon
          className="pointer-events-none absolute start-5 top-1/2 size-4 -translate-y-1/2 text-text-secondary"
          aria-hidden="true"
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={nav.searchPlaceholder}
          className="h-12 w-full bg-background-primary ps-11 pe-4 text-body-small text-text-primary outline-none placeholder:text-text-secondary"
        />
      </label>
      {brands.length === 0 ? (
        <p className="px-5 py-6 text-body-small text-text-secondary">
          {nav.emptyBrands}
        </p>
      ) : (
        <ul>
          {brands.map((brand) => (
            <li
              key={`${brand.slug}-${brand.href}`}
              className="border-b border-border-subtle"
            >
              <Link
                href={brand.href}
                prefetch={false}
                className="flex items-center gap-3 px-5 py-3 text-body-small text-text-primary transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <span className="relative flex size-6 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-background-primary p-1">
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt=""
                      width={16}
                      height={16}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-[11px] font-semibold text-text-secondary">
                      {brand.name.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                </span>
                <span>
                  {brand.name}
                  {brand.countLabel ? (
                    <span className="text-text-secondary">
                      {" "}
                      ({brand.countLabel})
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
