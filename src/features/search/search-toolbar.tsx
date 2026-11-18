"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  searchQueryKey,
  type VehicleSearchQuery,
} from "@/domain/catalog/params";
import type {
  MakeOption,
  ModelOption,
  SearchSort,
} from "@/domain/catalog/types";
import { catalogPath } from "@/domain/routing/rent-paths";
import { useRouter } from "@/i18n/navigation";
import { FilterSidebar } from "@/features/search/filter-sidebar";
import { SearchPanel } from "@/features/search/search-panel";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

interface SearchToolbarProps {
  country: string;
  city: string;
  query: VehicleSearchQuery;
  makes: MakeOption[];
  models: ModelOption[];
  filterDrawerContent?: ReactNode;
}

const SORT_OPTIONS: Array<{
  value: SearchSort;
  labelKey: "sortRecommended" | "sortPriceAsc" | "sortPriceDesc";
}> = [
  { value: "recommended", labelKey: "sortRecommended" },
  { value: "price_asc", labelKey: "sortPriceAsc" },
  { value: "price_desc", labelKey: "sortPriceDesc" },
];

export function SearchToolbar({
  country,
  city,
  query,
  makes,
  models,
  filterDrawerContent,
}: SearchToolbarProps) {
  const router = useRouter();
  const bodyLabels = useTranslations("BodyTypes");
  const t = useTranslations("SearchToolbar");

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSortOpen(false);
        setIsFilterDrawerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!isFilterDrawerOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isFilterDrawerOpen]);

  function pushQuery(patch: Partial<VehicleSearchQuery>) {
    router.push(
      catalogPath(city, {
        ...query,
        ...patch,
        page: 1,
      }),
    );
  }

  function clearAllFilters() {
    pushQuery({
      make: undefined,
      model: undefined,
      bodyType: undefined,
      deposit: undefined,
      term: undefined,
      pickup: undefined,
      seats: undefined,
      q: undefined,
    });
  }

  const filterLabel = t.has("filter") ? t("filter") : "Filter";
  const clearAllFiltersLabel = t.has("clearAllFilters")
    ? t("clearAllFilters")
    : "Clear all filters";
  const closeFiltersLabel = t.has("closeFilters")
    ? t("closeFilters")
    : "Close filters";

  const makeName = query.make
    ? (makes.find((m) => m.slug === query.make)?.name ?? query.make)
    : undefined;
  const modelName = query.model
    ? (models.find((m) => m.slug === query.model)?.name ?? query.model)
    : undefined;

  const chips: Array<{ key: string; label: string; onRemove: () => void }> = [];

  if (makeName) {
    chips.push({
      key: "make",
      label: makeName,
      onRemove: () => pushQuery({ make: undefined, model: undefined }),
    });
  }
  if (modelName) {
    chips.push({
      key: "model",
      label: modelName,
      onRemove: () => pushQuery({ model: undefined }),
    });
  }
  if (query.bodyType) {
    chips.push({
      key: "bodyType",
      label: bodyLabels(query.bodyType),
      onRemove: () => pushQuery({ bodyType: undefined }),
    });
  }
  if (query.deposit === "none") {
    chips.push({
      key: "deposit",
      label: t("zeroDeposit"),
      onRemove: () => pushQuery({ deposit: undefined }),
    });
  }
  if (query.term === "monthly") {
    chips.push({
      key: "term",
      label: t("monthly"),
      onRemove: () => pushQuery({ term: undefined }),
    });
  }
  if (query.pickup === "airport") {
    chips.push({
      key: "pickup",
      label: t("airportDelivery"),
      onRemove: () => pushQuery({ pickup: undefined }),
    });
  }
  if (query.seats) {
    chips.push({
      key: "seats",
      label: t("seatsCount", { count: query.seats }),
      onRemove: () => pushQuery({ seats: undefined }),
    });
  }
  if (query.q) {
    chips.push({
      key: "q",
      label: query.q,
      onRemove: () => pushQuery({ q: undefined }),
    });
  }

  const currentSort = query.sort ?? "recommended";
  const selectedSortOption =
    SORT_OPTIONS.find((opt) => opt.value === currentSort) ?? SORT_OPTIONS[0];

  return (
    <>
      <div className="w-full">
        {/* 1. Dark Navy Top Bar */}
        <div className="w-full bg-background-section text-text-inverse">
          <LayoutWrapper className="py-[var(--spacing-space-20)]">
            <div className="flex flex-col gap-[var(--spacing-space-12)] lg:min-h-[var(--spacing-dim-48)] lg:flex-row lg:items-center lg:justify-between lg:gap-[var(--spacing-space-20)]">
              {/* Mobile: full-width input | Tablet: input + Filter button | Desktop: wider input + dark chips */}
              <div className="flex flex-1 items-center justify-between gap-[var(--spacing-space-16)] lg:flex-wrap lg:justify-start lg:gap-[var(--spacing-space-20)]">
                <div className="w-full sm:max-w-[440px] sm:flex-1 lg:w-[440px] lg:max-w-none lg:flex-none xl:w-[500px] [&>*]:w-full [&>*]:max-w-none">
                  <SearchPanel
                    key={searchQueryKey(query)}
                    variant="toolbar"
                    country={country}
                    city={city}
                    initialQuery={query.q ?? ""}
                    currentQuery={query}
                  />
                </div>

                {/* Tablet-only Filter button in dark bar */}
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="hidden h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-text-inverse/40 px-4 text-sm font-medium text-text-inverse transition-colors hover:bg-text-inverse/10 sm:inline-flex lg:hidden"
                >
                  <SlidersHorizontal className="size-4 shrink-0" />
                  <span>{filterLabel}</span>
                </button>

                {/* Desktop-only active filter chips inside dark bar */}
                {chips.length > 0 ? (
                  <div className="hidden flex-wrap items-center gap-[var(--spacing-space-12)] lg:flex">
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="inline-flex h-6 cursor-pointer items-center align-middle text-[16px] font-medium leading-[1.5] text-text-inverse whitespace-nowrap transition-opacity hover:opacity-80"
                    >
                      {t("clearFilter")}
                    </button>
                    {chips.map((chip) => (
                      <button
                        key={chip.key}
                        type="button"
                        onClick={chip.onRemove}
                        aria-label={t("removeFilter", { label: chip.label })}
                        className="inline-flex h-8 cursor-pointer items-center gap-[var(--spacing-space-6)] rounded-[var(--radius-999)] bg-text-inverse/15 py-[var(--spacing-space-6)] pe-[var(--spacing-space-10)] ps-[14px] text-sm font-medium leading-5 text-text-inverse transition-colors hover:bg-text-inverse/25"
                      >
                        <span>{chip.label}</span>
                        <X className="size-3.5 shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Desktop-only Sort Dropdown */}
              <div
                ref={sortDropdownRef}
                className="relative ms-auto hidden h-8 shrink-0 items-center justify-end gap-[var(--spacing-space-12)] rounded-[var(--radius-8)] ps-[var(--spacing-space-16)] lg:flex"
              >
                <span
                  id="search-sort-label"
                  className="text-[16px] font-medium leading-[1.5] text-text-inverse whitespace-nowrap"
                >
                  {t("sortBy")}
                </span>

                <button
                  type="button"
                  aria-labelledby="search-sort-label"
                  aria-haspopup="listbox"
                  aria-expanded={isSortOpen}
                  onClick={() => setIsSortOpen((prev) => !prev)}
                  className="flex cursor-pointer items-center gap-[var(--spacing-space-8)] rounded-[var(--radius-8)] px-[var(--spacing-space-8)] py-[var(--spacing-space-4)] text-[16px] font-medium leading-[1.5] text-text-inverse transition-colors hover:bg-text-inverse/10 focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span>{t(selectedSortOption.labelKey)}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-text-inverse transition-transform duration-200 ${
                      isSortOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isSortOpen ? (
                  <ul
                    role="listbox"
                    aria-labelledby="search-sort-label"
                    className="absolute end-0 top-full z-50 mt-[var(--spacing-space-8)] min-w-[210px] overflow-hidden rounded-[var(--radius-12)] border border-border-subtle bg-popover p-[var(--spacing-space-6)] text-popover-foreground shadow-[var(--shadow-large)]"
                  >
                    {SORT_OPTIONS.map((option) => {
                      const isSelected = option.value === currentSort;
                      return (
                        <li
                          key={option.value}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              pushQuery({ sort: option.value });
                              setIsSortOpen(false);
                            }}
                            className={`flex w-full cursor-pointer items-center justify-between gap-[var(--spacing-space-12)] rounded-[var(--radius-8)] px-[var(--spacing-space-12)] py-[var(--spacing-space-8)] text-start text-sm font-medium transition-colors ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "text-text-primary hover:bg-background-secondary hover:text-text-primary"
                            }`}
                          >
                            <span>{t(option.labelKey)}</span>
                            {isSelected ? (
                              <Check className="size-4 shrink-0" />
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            </div>
          </LayoutWrapper>
        </div>

        {/* 2. Mobile & Tablet White Filter Strip */}
        <div
          className={`w-full border-b border-border-subtle bg-background-primary text-text-primary lg:hidden ${
            chips.length === 0 ? "sm:hidden" : ""
          }`}
        >
          <LayoutWrapper className="py-3">
            {/* Mobile (< sm): Outlined Filter button + Clear all filters + Chips */}
            <div className="flex flex-col gap-3 sm:hidden">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border-default bg-background-primary px-4 text-sm font-medium text-text-primary transition-colors hover:bg-background-secondary"
                >
                  <SlidersHorizontal className="size-4 shrink-0" />
                  <span>{filterLabel}</span>
                </button>

                {chips.length > 0 ? (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="cursor-pointer text-sm font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                  >
                    {clearAllFiltersLabel}
                  </button>
                ) : null}
              </div>

              {chips.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  {chips.map((chip) => (
                    <button
                      key={chip.key}
                      type="button"
                      onClick={chip.onRemove}
                      aria-label={t("removeFilter", { label: chip.label })}
                      className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[var(--radius-999)] bg-background-secondary px-3 text-sm font-medium text-text-primary transition-colors hover:bg-border-subtle"
                    >
                      <span>{chip.label}</span>
                      <X className="size-3.5 shrink-0 text-text-secondary" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Tablet (sm to lg): Clear Filter button + Light-grey Chips */}
            {chips.length > 0 ? (
              <div className="hidden flex-wrap items-center gap-2.5 sm:flex lg:hidden">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="cursor-pointer text-sm font-medium text-text-primary whitespace-nowrap transition-colors hover:text-primary"
                >
                  {t("clearFilter")}
                </button>
                {chips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.onRemove}
                    aria-label={t("removeFilter", { label: chip.label })}
                    className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[var(--radius-999)] bg-background-secondary px-3.5 text-sm font-medium text-text-primary transition-colors hover:bg-border-subtle"
                  >
                    <span>{chip.label}</span>
                    <X className="size-3.5 shrink-0 text-text-secondary" />
                  </button>
                ))}
              </div>
            ) : null}
          </LayoutWrapper>
        </div>
      </div>

      {/* 3. Mobile & Tablet Filter Drawer */}
      {isFilterDrawerOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={filterLabel}
          className="fixed inset-0 z-50 flex lg:hidden"
        >
          <button
            type="button"
            aria-label={closeFiltersLabel}
            onClick={() => setIsFilterDrawerOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          <div className="relative z-10 flex h-full w-[min(360px,90vw)] flex-col bg-background-primary shadow-[var(--shadow-large)]">
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
              <span className="text-base font-semibold text-text-primary">
                {filterLabel}
              </span>
              <button
                type="button"
                aria-label={closeFiltersLabel}
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex size-8 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-background-secondary hover:text-text-primary"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 [&>*]:w-full [&>*]:max-w-none">
              {filterDrawerContent ?? (
                <FilterSidebar
                  city={city}
                  query={query}
                  makes={makes}
                  models={models}
                  variant="drawer"
                />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
