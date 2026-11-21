"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { Link } from "@/i18n/navigation";
import { cn } from "cn";

export type NavLinkItem = { label: string; href: string };

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
};

const triggerClass =
  "flex h-full items-center gap-1 text-body-small font-medium text-white/85 transition-colors hover:text-white group-data-[transparent=false]:text-text-primary group-data-[transparent=false]:hover:text-link";

export function DesktopMenus({ nav }: { nav: HeaderNavModel }) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<"rent" | "brands" | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setOpen(null);
  }, [pathname]);

  useEffect(() => {
    if (open !== "brands") setQuery("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const needle = query.trim().toLowerCase();
  const brands = needle
    ? nav.brands.filter((brand) => brand.name.toLowerCase().includes(needle))
    : nav.brands;

  return (
    <div
      ref={rootRef}
      className="flex h-full items-center gap-6"
      onMouseLeave={() => setOpen(null)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(null);
      }}
    >
      <div className="relative h-full" onMouseEnter={() => setOpen("rent")}>
        <Link
          href={nav.columns[0]?.links[0]?.href ?? "/"}
          prefetch={false}
          aria-expanded={open === "rent"}
          aria-haspopup="true"
          className={cn(
            triggerClass,
            open === "rent" && "text-primary group-data-[transparent=false]:text-primary",
          )}
        >
          {nav.rentLabel}
          <ChevronDownIcon
            className={cn("size-3.5 opacity-70 transition-transform", open === "rent" && "rotate-180")}
            aria-hidden="true"
          />
          {open === "rent" ? (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
          ) : null}
        </Link>
      </div>

      <div className="relative h-full" onMouseEnter={() => setOpen("brands")}>
        <button
          type="button"
          aria-expanded={open === "brands"}
          aria-haspopup="true"
          className={cn(
            triggerClass,
            open === "brands" && "text-primary group-data-[transparent=false]:text-primary",
          )}
          onClick={() => setOpen("brands")}
        >
          {nav.brandsLabel}
          <ChevronDownIcon
            className={cn("size-3.5 opacity-70 transition-transform", open === "brands" && "rotate-180")}
            aria-hidden="true"
          />
          {open === "brands" ? (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
          ) : null}
        </button>
      </div>

      <Link
        href="/dealer-plans"
        prefetch={false}
        className={triggerClass}
        onMouseEnter={() => setOpen(null)}
      >
        {nav.dealersLabel}
      </Link>

      {open === "rent" ? (
        <div className="absolute inset-x-0 top-full z-50 px-4 pt-2 sm:px-8">
          <div className="mx-auto grid w-full max-w-[1440px] gap-8 rounded-xl border border-border-default bg-background-primary p-6 text-text-primary shadow-xl sm:grid-cols-3">
            {nav.columns.map((column, index) => (
              <div
                key={column.title}
                className={cn(index > 0 && "sm:border-s sm:border-border-default sm:ps-8")}
              >
                <p className="text-sm font-semibold text-primary">{column.title}</p>
                <ul className="mt-3 grid gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <MenuLink item={link} />
                    </li>
                  ))}
                </ul>
                {index === 0 ? (
                  <div className="mt-5 border-t border-border-default pt-4">
                    <p className="text-sm font-semibold text-primary">{nav.dealers.title}</p>
                    <ul className="mt-3 grid gap-2.5">
                      {nav.dealers.links.map((link) => (
                        <li key={link.href}>
                          <MenuLink item={link} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {column.extra ? (
                  <div className="mt-5 border-t border-border-default pt-4">
                    <p className="text-sm font-semibold text-primary">{column.extra.title}</p>
                    <ul className="mt-3 grid gap-2.5">
                      {column.extra.links.map((link) => (
                        <li key={link.href}>
                          <MenuLink item={link} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {open === "brands" ? (
        <div className="absolute inset-x-0 top-full z-50 px-4 pt-2 sm:px-8">
          <div className="mx-auto w-full max-w-[1440px] rounded-xl border border-border-default bg-background-primary p-6 text-text-primary shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-default pb-3">
              <p className="border-b-2 border-primary pb-2 text-sm font-semibold text-primary">
                {nav.brandsTitle}
              </p>
              <label className="relative ms-auto block w-full max-w-xs">
                <SearchIcon
                  className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary"
                  aria-hidden="true"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={nav.searchPlaceholder}
                  className="h-10 w-full rounded-lg border border-border-default bg-background-primary ps-9 pe-3 text-sm outline-none focus-visible:border-primary"
                />
              </label>
            </div>
            {brands.length === 0 ? (
              <p className="px-1 py-8 text-sm text-text-secondary">{nav.emptyBrands}</p>
            ) : (
              <ul className="mt-4 grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-4">
                {brands.map((brand) => (
                  <li key={brand.href}>
                    <Link
                      href={brand.href}
                      prefetch={false}
                      className="flex items-center gap-2.5 rounded-md px-1 py-2 text-sm text-text-primary transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      {brand.logo ? (
                        // Brand marks are small static SVGs in /public.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={brand.logo} alt="" className="size-5 object-contain" />
                      ) : (
                        <span className="grid size-5 place-items-center rounded-full bg-background-secondary text-[10px] font-semibold text-text-secondary">
                          {brand.name.slice(0, 1)}
                        </span>
                      )}
                      <span className="min-w-0 truncate">
                        {brand.name}
                        {brand.countLabel ? (
                          <span className="text-text-secondary"> ({brand.countLabel})</span>
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

function MenuLink({ item }: { item: NavLinkItem }) {
  return (
    <Link
      href={item.href}
      prefetch={false}
      className="text-sm text-text-primary transition-colors hover:text-primary"
    >
      {item.label}
    </Link>
  );
}
