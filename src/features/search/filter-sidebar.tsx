"use client";

import * as React from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";

import {
  BODY_TYPES,
  type BodyType,
  type MakeOption,
  type ModelOption,
  type VehicleSearchQuery,
} from "@/domain/catalog/types";
import { catalogPath } from "@/domain/routing/rent-paths";
import { useRouter } from "@/i18n/navigation";

/**
 * Optional backend-driven facets.
 * Sections backed by these fields remain hidden until the backend returns data for them.
 */
export interface BackendFilterFacets {
  bodyTypeCounts?: Partial<Record<BodyType, number>>;
  years?: Array<{ value: number; count?: number }>;
  doors?: Array<{ value: number; count?: number }>;
  areas?: Array<{ slug: string; label: string; count?: number }>;
  fuelTypes?: Array<{ slug: string; label: string; count?: number }>;
  paymentModes?: Array<{ slug: string; label: string; count?: number }>;
  features?: Array<{ slug: string; label: string; count?: number }>;
  transmissions?: Array<{
    slug: "automatic" | "manual";
    label: string;
    count?: number;
  }>;
  colors?: Array<{ slug: string; label: string; hex: string; count?: number }>;
  priceRange?: { min: number; max: number };
}

interface FilterSidebarProps {
  city: string;
  query: VehicleSearchQuery;
  makes: MakeOption[];
  models: ModelOption[];
  facets?: BackendFilterFacets;
}

function AccordionCard({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="rounded-[var(--radius-16)] border border-border-subtle bg-background-primary p-[var(--spacing-space-12)]">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between gap-2 text-start text-sm font-semibold text-text-primary"
        aria-expanded={open}
      >
        <span>{title}</span>
        {open ? (
          <ChevronUp className="size-4 shrink-0 text-text-secondary" />
        ) : (
          <ChevronDown className="size-4 shrink-0 text-text-secondary" />
        )}
      </button>
      {open ? (
        <div className="mt-[var(--spacing-space-10)] border-t border-border-subtle pt-[var(--spacing-space-10)]">
          {children}
        </div>
      ) : null}
    </div>
  );
}

interface CustomFilterSelectProps {
  value: string;
  allLabel: string;
  ariaLabel: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}

function CustomFilterSelect({
  value,
  allLabel,
  ariaLabel,
  options,
  onChange,
}: CustomFilterSelectProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label ?? allLabel;

  const allOptions = [{ value: "", label: allLabel }, ...options];

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-[var(--radius-8)] border bg-background-primary px-2.5 text-start text-sm text-text-primary transition-colors focus:outline-none ${
          open
            ? "border-primary"
            : "border-border-default hover:border-primary/60"
        }`}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-text-secondary transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          className="filter-scrollbar absolute start-0 top-full z-50 mt-[var(--spacing-space-6)] max-h-56 w-full overflow-y-auto rounded-[var(--radius-12)] border border-border-subtle bg-popover p-[var(--spacing-space-6)] text-popover-foreground shadow-[var(--shadow-large)]"
        >
          {allOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value || "__all"}
                role="option"
                aria-selected={isSelected}
              >
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-[var(--radius-8)] px-[var(--spacing-space-10)] py-[var(--spacing-space-8)] text-start text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "text-text-primary hover:bg-background-secondary hover:text-text-primary"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected ? <Check className="size-4 shrink-0" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function FilterSidebar({
  city,
  query,
  makes,
  models,
  facets,
}: FilterSidebarProps) {
  const router = useRouter();
  const bodyLabels = useTranslations("BodyTypes");
  const t = useTranslations("FilterSidebar");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  function pushQuery(patch: Partial<VehicleSearchQuery>) {
    router.push(
      catalogPath(city, {
        ...query,
        ...patch,
        page: 1,
      }),
    );
  }

  function clearAll() {
    router.push(catalogPath(city, {}));
  }

  const activeCount = [
    query.bodyType,
    query.make,
    query.model,
    query.deposit,
    query.term,
    query.pickup,
    query.seats,
    query.q,
  ].filter(Boolean).length;

  const filteredModels = query.make
    ? models.filter((m) => m.makeSlug === query.make)
    : models;

  const seatOptions = [2, 4, 5, 7, 8];

  const filterTitleText =
    activeCount > 0
      ? t("filterWithCount", { count: activeCount })
      : t("filter");

  const sidebarContent = (
    <div className="flex flex-col gap-[var(--spacing-space-12)] rounded-[var(--radius-16)] bg-background-secondary p-[var(--spacing-space-16)]">
      {/* Header */}
      <div className="flex h-6 w-full items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">
          {filterTitleText}
        </h2>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={clearAll}
            className="h-6 cursor-pointer text-[13px] font-medium leading-[1.1] text-link underline decoration-solid underline-offset-auto transition-opacity hover:opacity-80"
          >
            {t("clearAllFilters")}
          </button>
        ) : null}
      </div>

      {/* 1. Car Type */}
      <AccordionCard title={t("carType")} defaultOpen>
        <div className="filter-scrollbar max-h-44 space-y-2.5 overflow-y-auto pe-2">
          {BODY_TYPES.map((type) => {
            const checked = query.bodyType === type;
            const count = facets?.bodyTypeCounts?.[type];
            return (
              <label
                key={type}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-text-primary"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    pushQuery({ bodyType: checked ? undefined : type })
                  }
                  className="size-4 shrink-0 cursor-pointer rounded-[var(--radius-4)] border-border-default accent-primary"
                />
                <span className="truncate">
                  {bodyLabels(type)}
                  {typeof count === "number" ? (
                    <span className="ms-1 text-text-secondary">({count})</span>
                  ) : null}
                </span>
              </label>
            );
          })}
        </div>
      </AccordionCard>

      {/* 2. Brand & Model */}
      {makes.length > 0 ? (
        <AccordionCard
          title={t("brandAndModel")}
          defaultOpen={Boolean(query.make || query.model)}
        >
          <div className="space-y-2.5">
            <CustomFilterSelect
              value={query.make ?? ""}
              allLabel={t("allBrands")}
              ariaLabel={t("brand")}
              options={makes.map((make) => ({
                value: make.slug,
                label: make.name,
              }))}
              onChange={(val) =>
                pushQuery({
                  make: val || undefined,
                  model: undefined,
                })
              }
            />

            {filteredModels.length > 0 ? (
              <CustomFilterSelect
                value={query.model ?? ""}
                allLabel={t("allModels")}
                ariaLabel={t("model")}
                options={filteredModels.map((model) => ({
                  value: model.slug,
                  label: model.name,
                }))}
                onChange={(val) => pushQuery({ model: val || undefined })}
              />
            ) : null}
          </div>
        </AccordionCard>
      ) : null}

      {/* 3. Rental Term */}
      <AccordionCard
        title={t("rentalTerm")}
        defaultOpen={query.term === "monthly"}
      >
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => pushQuery({ term: undefined })}
            className={`h-8 cursor-pointer rounded-[var(--radius-999)] border text-xs font-medium transition-colors ${
              !query.term
                ? "border-primary bg-primary/10 text-primary"
                : "border-border-subtle bg-background-primary text-text-secondary hover:border-border-default hover:text-text-primary"
            }`}
          >
            {t("daily")}
          </button>
          <button
            type="button"
            onClick={() =>
              pushQuery({
                term: query.term === "monthly" ? undefined : "monthly",
              })
            }
            className={`h-8 cursor-pointer rounded-[var(--radius-999)] border text-xs font-medium transition-colors ${
              query.term === "monthly"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border-subtle bg-background-primary text-text-secondary hover:border-border-default hover:text-text-primary"
            }`}
          >
            {t("monthly")}
          </button>
        </div>
      </AccordionCard>

      {/* 4. Car Rental Options */}
      <AccordionCard
        title={t("carRentalOptions")}
        defaultOpen={query.deposit === "none"}
      >
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => pushQuery({ deposit: undefined })}
            className={`h-8 cursor-pointer rounded-[var(--radius-999)] border px-2 text-xs font-medium transition-colors ${
              !query.deposit
                ? "border-primary bg-primary/10 text-primary"
                : "border-border-subtle bg-background-primary text-text-secondary hover:border-border-default hover:text-text-primary"
            }`}
          >
            {t("allOptions")}
          </button>
          <button
            type="button"
            onClick={() =>
              pushQuery({
                deposit: query.deposit === "none" ? undefined : "none",
              })
            }
            className={`h-8 cursor-pointer rounded-[var(--radius-999)] border px-2 text-xs font-medium transition-colors ${
              query.deposit === "none"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border-subtle bg-background-primary text-text-secondary hover:border-border-default hover:text-text-primary"
            }`}
          >
            {t("withoutDeposit")}
          </button>
        </div>
      </AccordionCard>

      {/* 5. Number of Seats */}
      <AccordionCard
        title={t("numberOfSeats")}
        defaultOpen={Boolean(query.seats)}
      >
        <div className="flex flex-wrap gap-2">
          {seatOptions.map((count) => {
            const active = query.seats === count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => pushQuery({ seats: active ? undefined : count })}
                className={`h-8 cursor-pointer rounded-[var(--radius-999)] border px-3 text-xs font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border-subtle bg-background-primary text-text-secondary hover:border-border-default hover:text-text-primary"
                }`}
              >
                {t("seatsCount", { count })}
              </button>
            );
          })}
        </div>
      </AccordionCard>

      {/* 6. Delivery Options */}
      <AccordionCard
        title={t("deliveryOptions")}
        defaultOpen={query.pickup === "airport"}
      >
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-text-primary">
          <input
            type="checkbox"
            checked={query.pickup === "airport"}
            onChange={() =>
              pushQuery({
                pickup: query.pickup === "airport" ? undefined : "airport",
              })
            }
            className="size-4 shrink-0 cursor-pointer rounded-[var(--radius-4)] border-border-default accent-primary"
          />
          <span>{t("airportDelivery")}</span>
        </label>
      </AccordionCard>

      {/* Backend-Gated Sections */}
      {facets?.years && facets.years.length > 0 ? (
        <AccordionCard title={t("modelYear")}>
          <div className="space-y-1.5 text-sm text-text-secondary">
            {facets.years.map((item) => (
              <div key={item.value} className="flex justify-between">
                <span>{item.value}</span>
                {typeof item.count === "number" ? (
                  <span>({item.count})</span>
                ) : null}
              </div>
            ))}
          </div>
        </AccordionCard>
      ) : null}

      {facets?.transmissions && facets.transmissions.length > 0 ? (
        <AccordionCard title={t("transmission")}>
          <div className="space-y-1.5 text-sm text-text-secondary">
            {facets.transmissions.map((item) => (
              <div key={item.slug} className="flex justify-between">
                <span>{item.label}</span>
                {typeof item.count === "number" ? (
                  <span>({item.count})</span>
                ) : null}
              </div>
            ))}
          </div>
        </AccordionCard>
      ) : null}

      {facets?.fuelTypes && facets.fuelTypes.length > 0 ? (
        <AccordionCard title={t("fuelType")}>
          <div className="space-y-1.5 text-sm text-text-secondary">
            {facets.fuelTypes.map((item) => (
              <div key={item.slug} className="flex justify-between">
                <span>{item.label}</span>
                {typeof item.count === "number" ? (
                  <span>({item.count})</span>
                ) : null}
              </div>
            ))}
          </div>
        </AccordionCard>
      ) : null}

      {facets?.areas && facets.areas.length > 0 ? (
        <AccordionCard title={t("locationAndArea")}>
          <div className="space-y-1.5 text-sm text-text-secondary">
            {facets.areas.map((item) => (
              <div key={item.slug} className="flex justify-between">
                <span>{item.label}</span>
                {typeof item.count === "number" ? (
                  <span>({item.count})</span>
                ) : null}
              </div>
            ))}
          </div>
        </AccordionCard>
      ) : null}

      {facets?.features && facets.features.length > 0 ? (
        <AccordionCard title={t("carFeatures")}>
          <div className="space-y-1.5 text-sm text-text-secondary">
            {facets.features.map((item) => (
              <div key={item.slug} className="flex justify-between">
                <span>{item.label}</span>
                {typeof item.count === "number" ? (
                  <span>({item.count})</span>
                ) : null}
              </div>
            ))}
          </div>
        </AccordionCard>
      ) : null}

      {facets?.colors && facets.colors.length > 0 ? (
        <AccordionCard title={t("exteriorCarColor")}>
          <div className="space-y-2 text-sm text-text-secondary">
            {facets.colors.map((item) => (
              <div
                key={item.slug}
                className="flex items-center justify-between gap-2"
              >
                <span>
                  {item.label}{" "}
                  {typeof item.count === "number" ? `(${item.count})` : ""}
                </span>
                <span
                  className="size-3.5 rounded-[var(--radius-999)] border border-border-default"
                  style={{ backgroundColor: item.hex }}
                />
              </div>
            ))}
          </div>
        </AccordionCard>
      ) : null}
    </div>
  );

  return (
    <>
      {/* Mobile / Tablet Filter Trigger */}
      <div className="flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-12)] border border-border-default bg-background-primary px-4 text-sm font-medium text-text-primary shadow-[var(--shadow-small)]"
        >
          <SlidersHorizontal className="size-4" />
          <span>{filterTitleText}</span>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:w-[302px] lg:shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 flex h-full w-full max-w-xs flex-col overflow-y-auto bg-background-secondary p-[var(--spacing-space-16)] shadow-[var(--shadow-large)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-base font-semibold text-text-primary">
                {t("filtersHeading")}
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label={t("closeFilters")}
                className="rounded-[var(--radius-8)] p-1.5 text-text-secondary hover:bg-border-subtle"
              >
                <X className="size-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      ) : null}
    </>
  );
}
