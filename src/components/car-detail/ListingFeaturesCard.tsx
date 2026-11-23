"use client";

import * as React from "react";

export type FeatureCategoryData = {
  key: string;
  title: string;
  items: string[];
  expandedFallbackItems: string[];
};

const INITIAL_VISIBLE_COUNT = 3;

export function ListingFeaturesCard({
  featuresTitle,
  categories,
  viewAllFeaturesLabel,
  showLessLabel,
  installedOptionsTitle,
  installedOptions,
  installedOptionsNote,
}: {
  featuresTitle: string;
  categories: FeatureCategoryData[];
  viewAllFeaturesLabel: string;
  showLessLabel: string;
  installedOptionsTitle: string;
  installedOptions: string[];
  installedOptionsNote: string;
}) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <section className="order-5 flex flex-col gap-6 rounded-[var(--radius-24)] border border-border-default bg-background-primary p-4 sm:gap-8 sm:p-8">
      <h2 className="text-[20px] font-semibold leading-[1.26] tracking-[-0.02em] text-text-primary sm:text-[24px]">
        {featuresTitle}
      </h2>

      <hr className="border-t border-border-subtle" />

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {categories.map((category) => {
            const visibleItems = expanded
              ? category.items.length > INITIAL_VISIBLE_COUNT
                ? category.items
                : Array.from(
                    new Set([
                      ...category.items,
                      ...category.expandedFallbackItems,
                    ]),
                  )
              : category.items.slice(0, INITIAL_VISIBLE_COUNT);

            return (
              <div
                key={category.key}
                className="flex flex-col gap-[var(--spacing-space-12)]"
              >
                <h3 className="text-[18px] font-semibold leading-[1.4] text-text-primary">
                  {category.title}
                </h3>
                <ul className="list-disc space-y-1.5 ps-5 text-[15px] font-normal leading-[1.5] text-text-secondary">
                  {visibleItems.map((item, idx) => (
                    <li key={`${category.key}-${idx}`}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div>
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            className="cursor-pointer text-[15px] font-medium text-link no-underline transition-opacity hover:opacity-80"
          >
            {expanded ? showLessLabel : viewAllFeaturesLabel}
          </button>
        </div>
      </div>

      <hr className="border-t border-border-subtle" />

      <div className="flex flex-col gap-[var(--spacing-space-16)]">
        <h2 className="text-[20px] font-semibold leading-[1.26] tracking-[-0.02em] text-text-primary sm:text-[24px]">
          {installedOptionsTitle}
        </h2>

        <ul className="space-y-2.5 text-[15px] font-normal leading-[1.5] text-text-secondary">
          {installedOptions.map((option, idx) => (
            <li key={idx}>{option}</li>
          ))}
        </ul>

        <p className="pt-2 text-xs text-text-secondary">
          {installedOptionsNote}
        </p>
      </div>
    </section>
  );
}
