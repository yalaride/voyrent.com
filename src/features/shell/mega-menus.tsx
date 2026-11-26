"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { Link } from "@/i18n/navigation";
import { BRAND_LOGOS, formatBrandName } from "@/domain/catalog/brand-logos";
import { cn } from "cn";

export { BRAND_LOGOS };

export type NavLinkBadgeVariant = "hot" | "discount" | "save" | "new";

export type NavLinkItem = {
  label: string;
  href: string;
  badge?: string;
  badgeVariant?: NavLinkBadgeVariant;
};

export type HeaderNavModel = {
  rentLabel: string;
  brandsLabel: string;
  dealersLabel: string;
  columns: {
    title: string;
    links: NavLinkItem[];
    extra?: { title: string; links: NavLinkItem[] };
  }[];
  dealers: { title: string; links: NavLinkItem[] };
  brandsTitle: string;
  searchPlaceholder: string;
  emptyBrands: string;
  brands: { name: string; href: string; countLabel?: string; logo?: string }[];
  viewAllRentLabel?: string;
  viewAllRentHref?: string;
  brandsCountUnit?: string;
  brandsFooterText?: string;
  viewAllBrandsLabel?: string;
  viewAllBrandsHref?: string;
};

function extractBrandSlug(brand: { name: string; href: string }): string {
  const makeMatch = brand.href.match(/[?&]make=([^&]+)/i);
  if (makeMatch?.[1]) {
    return decodeURIComponent(makeMatch[1]).toLowerCase();
  }
  return brand.name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildBrandHref(
  slug: string,
  sampleHref: string | undefined,
  fallbackBaseHref: string,
): string {
  if (sampleHref) {
    if (/[?&]make=[^&]*/i.test(sampleHref)) {
      return sampleHref.replace(
        /([?&]make=)[^&]*/i,
        `$1${encodeURIComponent(slug)}`,
      );
    }
    const cleanSample = sampleHref.split("?")[0] ?? "/";
    return `${cleanSample}?make=${encodeURIComponent(slug)}`;
  }

  const cleanBase = fallbackBaseHref.split("?")[0] || "/";
  return `${cleanBase}?make=${encodeURIComponent(slug)}`;
}

const triggerClass =
  "flex h-full items-center gap-1 text-body-small font-medium text-white/85 transition-colors hover:text-white group-data-[transparent=false]:text-text-primary group-data-[transparent=false]:hover:text-link";

export function DesktopMenus({ nav }: { nav: HeaderNavModel }) {
  const pathname = usePathname();
  const tBrands = useTranslations("Brands");
  const tHeaderNav = useTranslations("HeaderNav");

  const rootRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [open, setOpen] = useState<"rent" | "brands" | null>(null);
  const [query, setQuery] = useState("");
  const [path, setPath] = useState(pathname);
  const [isScrolling, setIsScrolling] = useState(false);

  if (path !== pathname) {
    setPath(pathname);
    setOpen(null);
    setQuery("");
  }

  function show(next: "rent" | "brands" | null) {
    setOpen(next);
    if (next !== "brands") {
      setQuery("");
      setIsScrolling(false);
    }
  }

  function handleBrandsScroll() {
    setIsScrolling(true);
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    scrollTimerRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 800);
  }

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (open) {
      root.setAttribute("data-mega-menu-open", "true");
    } else {
      root.removeAttribute("data-mega-menu-open");
    }
    return () => {
      root.removeAttribute("data-mega-menu-open");
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = () => {
      setOpen(null);
      setQuery("");
      setIsScrolling(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

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

  const extraSection =
    nav.columns.length < 4
      ? nav.columns.find((column) => column.extra)?.extra
      : undefined;

  const rentColumns: HeaderNavModel["columns"] =
    nav.columns.length < 4 &&
    (nav.dealers.links.length > 0 || Boolean(extraSection))
      ? [
          ...nav.columns.map((column) => ({
            title: column.title,
            links: column.links,
          })),
          {
            title: extraSection?.title ?? nav.dealers.title,
            links: [...nav.dealers.links, ...(extraSection?.links ?? [])],
          },
        ]
      : nav.columns;

  const brandsCountUnit = nav.brandsCountUnit ?? tHeaderNav("brandsCountUnit");

  return (
    <div
      ref={rootRef}
      className="flex h-full items-center gap-4 md:gap-6"
      onMouseLeave={() => show(null)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) show(null);
      }}
    >
      <div className="h-full" onMouseEnter={() => show("rent")}>
        <Link
          href={nav.columns[0]?.links[0]?.href ?? "/"}
          prefetch={false}
          aria-expanded={open === "rent"}
          aria-haspopup="true"
          className={cn(
            triggerClass,
            open === "rent" &&
              "text-primary group-data-[transparent=false]:text-primary",
          )}
        >
          <span>{nav.rentLabel}</span>
          <ChevronDownIcon
            className={cn(
              "size-3.5 opacity-70 transition-transform",
              open === "rent" && "rotate-180",
            )}
            aria-hidden="true"
          />
        </Link>
      </div>

      <div className="h-full" onMouseEnter={() => show("brands")}>
        <button
          type="button"
          aria-expanded={open === "brands"}
          aria-haspopup="true"
          className={cn(
            triggerClass,
            open === "brands" &&
              "text-primary group-data-[transparent=false]:text-primary",
          )}
          onClick={() => show("brands")}
        >
          <span>{nav.brandsLabel}</span>
          <ChevronDownIcon
            className={cn(
              "size-3.5 opacity-70 transition-transform",
              open === "brands" && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
      </div>

      <Link
        href="/dealer-plans"
        prefetch={false}
        className={triggerClass}
        onMouseEnter={() => show(null)}
      >
        {nav.dealersLabel}
      </Link>

      {/* Rent a Car Mega Menu */}
      {open === "rent" ? (
        <div className="absolute inset-x-0 top-full z-50 px-3 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-h-[calc(100dvh-7rem)] w-full max-w-[1160px] flex-col overflow-hidden rounded-[16px] bg-background-primary text-text-primary shadow-[0px_16px_40px_-8px_#121A2924]">
            <div className="flex-1 overflow-y-auto">
              <div
                className={cn(
                  "grid gap-y-4 px-2 py-4 sm:gap-y-5 sm:px-4 sm:py-5",
                  rentColumns.length >= 4
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                    : "grid-cols-1 sm:grid-cols-3",
                )}
              >
                {rentColumns.map((column, index) => (
                  <Fragment key={column.title}>
                    <div
                      className={cn(
                        "px-3 sm:px-4",
                        rentColumns.length >= 4
                          ? cn(
                              index > 0 &&
                                "border-t border-border-default/50 pt-4 sm:border-t-0 sm:pt-0 lg:border-s lg:border-border-default/50",
                              index % 2 === 1 &&
                                "sm:border-s sm:border-border-default/50",
                            )
                          : index > 0 &&
                              "border-t border-border-default/50 pt-4 sm:border-t-0 sm:border-s sm:border-border-default/50 sm:pt-0",
                      )}
                    >
                      <p className="px-3 text-[12px] font-medium leading-[1.1] tracking-[0.06em] text-primary uppercase sm:text-[13px]">
                        {column.title}
                      </p>
                      <ul className="mt-2 flex flex-col gap-0.5">
                        {column.links.map((link) => (
                          <li key={`${link.href}-${link.label}`}>
                            <MenuLink item={link} />
                          </li>
                        ))}
                      </ul>

                      {index === 0 &&
                      nav.columns.length >= 4 &&
                      nav.dealers.links.length > 0 ? (
                        <div className="mt-4 border-t border-border-default/50 pt-3.5">
                          <p className="px-3 text-[12px] font-medium leading-[1.1] tracking-[0.06em] text-text-secondary uppercase sm:text-[13px]">
                            {nav.dealers.title}
                          </p>
                          <ul className="mt-1.5 flex flex-col gap-0.5">
                            {nav.dealers.links.map((link) => (
                              <li key={`${link.href}-${link.label}`}>
                                <MenuLink item={link} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {column.extra ? (
                        <div className="mt-4 border-t border-border-default/50 pt-3.5">
                          <p className="px-3 text-[12px] font-medium leading-[1.1] tracking-[0.06em] text-text-secondary uppercase sm:text-[13px]">
                            {column.extra.title}
                          </p>
                          <ul className="mt-1.5 flex flex-col gap-0.5">
                            {column.extra.links.map((link) => (
                              <li key={`${link.href}-${link.label}`}>
                                <MenuLink item={link} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>

                    {rentColumns.length >= 4 && index === 1 ? (
                      <div
                        aria-hidden="true"
                        className="hidden h-px bg-border-default/50 sm:col-span-2 sm:mx-3 sm:block lg:hidden"
                      />
                    ) : null}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Brands Mega Menu */}
      {open === "brands" ? (
        <div className="absolute inset-x-0 top-full z-50 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-h-[calc(100dvh-7rem)] w-full max-w-[880px] flex-col overflow-hidden rounded-[16px] bg-background-primary text-text-primary shadow-[0px_16px_40px_-8px_#121A2924]">
            <div className="flex shrink-0 flex-col items-stretch justify-between gap-2.5 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:py-3.5">
              <label className="relative flex h-[42px] w-full items-center gap-2 rounded-full border border-border-default/70 bg-background-primary px-4 py-2 transition-colors focus-within:border-primary sm:h-[44px] sm:max-w-[380px]">
                <SearchIcon
                  className="size-4 shrink-0 text-text-secondary"
                  aria-hidden="true"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={nav.searchPlaceholder}
                  className="h-5 w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary"
                />
              </label>

              <span className="text-xs font-medium text-text-secondary">
                {brands.length} {brandsCountUnit}
              </span>
            </div>

            {brands.length === 0 ? (
              <p className="flex h-[200px] items-center justify-center px-6 text-sm text-text-secondary sm:h-[270px]">
                {nav.emptyBrands}
              </p>
            ) : (
              <ul
                onScroll={handleBrandsScroll}
                className={cn(
                  "grid min-h-[180px] max-h-[44dvh] flex-1 content-start grid-cols-1 gap-x-3 gap-y-0.5 overflow-y-auto px-4 pt-0.5 pb-4 min-[420px]:grid-cols-2 sm:h-[270px] sm:max-h-none sm:grid-cols-3 sm:gap-x-4 sm:px-6 sm:pt-1 lg:grid-cols-4",
                  "[scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:transition-colors",
                  isScrolling
                    ? "[scrollbar-color:rgba(15,23,42,0.25)_transparent] [&::-webkit-scrollbar-thumb]:bg-slate-900/25"
                    : "[scrollbar-color:transparent_transparent] [&::-webkit-scrollbar-thumb]:bg-transparent",
                )}
              >
                {brands.map((brand) => (
                  <li key={`${brand.slug}-${brand.href}`}>
                    <Link
                      href={brand.href}
                      prefetch={false}
                      className="group/brand flex min-h-[36px] items-center gap-2.5 rounded-[8px] px-2.5 py-1.5 text-[14px] font-normal text-text-primary transition-colors hover:bg-background-secondary"
                    >
                      <span className="relative flex size-7 shrink-0 items-center justify-center rounded-full border border-border-default/60 bg-white p-1.5">
                        {brand.logo ? (
                          <Image
                            src={brand.logo}
                            alt=""
                            width={16}
                            height={16}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-[10px] font-bold leading-none text-text-secondary">
                            {brand.name.slice(0, 1).toUpperCase()}
                          </span>
                        )}
                      </span>
                      <span className="min-w-0 truncate">
                        {brand.name}
                        {brand.countLabel ? (
                          <span className="text-xs text-text-secondary">
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
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getBadgeClasses(badge: string, variant?: NavLinkBadgeVariant): string {
  const resolved =
    variant ??
    (badge.toLowerCase().includes("hot") || badge.includes("رائج")
      ? "hot"
      : badge.toLowerCase().includes("new") || badge.includes("جديد")
        ? "new"
        : "discount");

  switch (resolved) {
    case "hot":
      return "bg-[#EF4444] text-white";
    case "new":
      return "bg-primary text-white";
    case "save":
    case "discount":
    default:
      return "bg-[#16A34A] text-white";
  }
}

function MenuLink({ item }: { item: NavLinkItem }) {
  return (
    <Link
      href={item.href}
      prefetch={false}
      className="flex min-h-[34px] w-full items-center justify-between gap-3 rounded-[8px] px-3 py-1.5 text-[14px] font-normal leading-[1.4] text-text-primary transition-colors hover:bg-background-secondary sm:text-[15px]"
    >
      <span className="truncate">{item.label}</span>
      {item.badge ? (
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium leading-none",
            getBadgeClasses(item.badge, item.badgeVariant),
          )}
        >
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}
