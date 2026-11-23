"use client";

import * as React from "react";

import { InfoTooltip } from "@/components/car-detail/InfoTooltip";

export type PricingPeriodKey = "day" | "week" | "month";

export type PricingPeriodData = {
  key: PricingPeriodKey;
  price: string;
  originalPrice: string | null;
  unit: string;
  includedMileageText: string;
  additionalMileageText: string;
  chauffeurText: string;
};

export function ListingPricingCard({
  title,
  periods,
  includedMileageLabel,
  additionalMileageLabel,
  chauffeurLabel,
  chauffeurTooltip,
}: {
  title: string;
  periods: PricingPeriodData[];
  includedMileageLabel: string;
  additionalMileageLabel: string;
  chauffeurLabel: string;
  chauffeurTooltip: string;
}) {
  const [selectedKey, setSelectedKey] = React.useState<PricingPeriodKey>("day");

  const activePeriod =
    periods.find((period) => period.key === selectedKey) ?? periods[0];

  return (
    <section className="flex flex-col gap-[var(--spacing-space-16)] rounded-[var(--radius-24)] border border-border-default bg-background-primary p-4 sm:gap-[var(--spacing-space-20)] sm:p-8">
      <h2 className="text-[20px] font-semibold leading-[1.26] tracking-[-0.02em] text-text-primary sm:text-[24px]">
        {title}
      </h2>

      <div
        role="tablist"
        aria-label={title}
        className="grid min-h-[86px] grid-cols-3 gap-1.5 rounded-[var(--radius-16)] bg-background-secondary p-[var(--spacing-space-6)] sm:gap-[var(--spacing-space-12)]"
      >
        {periods.map((period) => {
          const isActive = period.key === activePeriod.key;
          return (
            <button
              key={period.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedKey(period.key)}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-[var(--radius-12)] px-2 py-2.5 text-center transition-all sm:px-4 ${
                isActive
                  ? "bg-background-primary shadow-[var(--shadow-small)]"
                  : "bg-transparent hover:bg-background-primary/50"
              }`}
            >
              {period.originalPrice ? (
                <span className="text-xs font-normal text-text-secondary line-through sm:text-sm">
                  {period.originalPrice}
                </span>
              ) : null}
              <div className="flex flex-col items-center justify-center sm:flex-row sm:items-baseline sm:gap-1">
                <span className="text-[18px] font-bold leading-tight text-primary sm:text-[22px]">
                  {period.price}
                </span>
                <span className="text-xs font-normal text-text-secondary sm:text-sm">
                  <span className="hidden sm:inline">/ </span>
                  {period.unit}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-[var(--spacing-space-8)] text-[14px] leading-[1.5] sm:text-[16px]">
        <div className="flex items-center justify-between gap-4">
          <span className="text-text-secondary">{includedMileageLabel}</span>
          <span className="shrink-0 whitespace-nowrap font-medium text-text-primary">
            {activePeriod.includedMileageText}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-text-secondary">{additionalMileageLabel}</span>
          <span className="shrink-0 whitespace-nowrap font-medium text-text-primary">
            {activePeriod.additionalMileageText}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-[var(--spacing-space-6)] text-text-secondary">
            <span>{chauffeurLabel}</span>
            <InfoTooltip
              content={chauffeurTooltip}
              label={chauffeurLabel}
              align="center"
            />
          </span>
          <span className="shrink-0 whitespace-nowrap font-medium text-text-primary">
            {activePeriod.chauffeurText}
          </span>
        </div>
      </div>
    </section>
  );
}
