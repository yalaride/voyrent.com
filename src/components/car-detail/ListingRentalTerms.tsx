"use client";

import { InfoTooltip } from "@/components/car-detail/InfoTooltip";

export type RentalTermItem = {
  key: string;
  label: string;
  tooltip: string;
};

export function ListingRentalTerms({
  title,
  items,
}: {
  title: string;
  items: RentalTermItem[];
}) {
  return (
    <div className="flex flex-col gap-[var(--spacing-space-12)]">
      <h3 className="text-[16px] font-semibold leading-[1.4] text-text-primary">
        {title}
      </h3>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[14px] leading-[1.4] text-text-secondary sm:grid-cols-4 sm:text-[15px] lg:grid-cols-2">
        {items.map((item, idx) => (
          <div
            key={item.key}
            className="inline-flex min-w-0 items-center gap-1.5 text-start"
          >
            <span className="truncate">{item.label}</span>
            <InfoTooltip
              content={item.tooltip}
              label={item.label}
              align={idx % 2 === 0 ? "start" : "end"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
