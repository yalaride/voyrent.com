"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { catalogPath } from "@/domain/routing/rent-paths";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

type CatalogFilterParams = Parameters<typeof catalogPath>[1];

type BodyTypeKey =
  | "suv"
  | "sports"
  | "crossover"
  | "sedan"
  | "luxury"
  | "pickup"
  | "monthly"
  | "minivan"
  | "electric"
  | "fourByFour";

interface BrowseCategory {
  id: string;
  key: BodyTypeKey;
  count: number;
  image: string;
  query: NonNullable<CatalogFilterParams>;
}

const CATEGORIES: BrowseCategory[] = [
  {
    id: "suv",
    key: "suv",
    count: 488,
    image: "/car-types/SUV.svg",
    query: { bodyType: "suv" },
  },
  {
    id: "sports",
    key: "sports",
    count: 608,
    image: "/car-types/Sports.svg",
    query: { bodyType: "sports" },
  },
  {
    id: "crossover",
    key: "crossover",
    count: 285,
    image: "/car-types/CrossOver.svg",
    query: { bodyType: "crossover" },
  },
  {
    id: "sedan",
    key: "sedan",
    count: 1406,
    image: "/car-types/Sedan.svg",
    query: { bodyType: "sedan" },
  },
  {
    id: "luxury",
    key: "luxury",
    count: 853,
    image: "/car-types/Luxary.svg",
    query: { bodyType: "luxury" },
  },
  {
    id: "pickup",
    key: "pickup",
    count: 683,
    image: "/car-types/Pickup.svg",
    query: { bodyType: "pickup" },
  },
  {
    id: "monthly",
    key: "monthly",
    count: 297,
    image: "/car-types/Monthly.svg",
    query: { term: "monthly" },
  },
  {
    id: "minivan",
    key: "minivan",
    count: 955,
    image: "/car-types/MiniVan.svg",
    query: { bodyType: "van" },
  },
  {
    id: "electric",
    key: "electric",
    count: 1390,
    image: "/car-types/Electric.svg",
    query: { q: "electric" },
  },
  {
    id: "fourByFour",
    key: "fourByFour",
    count: 1485,
    image: "/car-types/4X4.svg",
    query: { q: "4x4" },
  },
];

export function BrowseCarsSection({ city }: { city: string }) {
  const t = useTranslations("BodyTypes");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <LayoutWrapper>
      <section className="flex w-full flex-col gap-[var(--spacing-space-0)] border-t-0   md:gap-[var(--spacing-space-16)] md:pb-[var(--spacing-space-40)] lg:gap-[32px] lg:pb-[var(--spacing-space-0)]">
        {/* Title */}
        <h2 className="font-sans text-[length:var(--text-h4)] font-semibold leading-[1.26] tracking-[-0.02em] text-text-primary md:text-[length:var(--text-h3)] md:leading-[1.2]">
          {t("title")}
        </h2>

        {/* Grid: 3 cols (mobile) -> 4 cols (tablet) -> 5 cols (desktop) */}
        <div className="grid grid-cols-3 justify-items-center gap-[var(--spacing-space-12)] md:grid-cols-4 md:gap-[var(--spacing-space-16)] lg:grid-cols-5">
          {CATEGORIES.map((item, index) => {
            // Responsive breakdown:
            // Mobile (< 768px): shows 6 items (2 rows of 3)
            // Tablet (768px - 1023px): shows 8 items (2 rows of 4)
            // Desktop (1024px+): shows all 10 items (2 rows of 5)
            let visibilityClass = "flex";
            if (!isExpanded) {
              if (index >= 8) {
                visibilityClass = "hidden lg:flex";
              } else if (index >= 6) {
                visibilityClass = "hidden md:flex";
              }
            }

            const href = catalogPath(city, item.query);

            return (
              <Link
                key={item.id}
                href={href}
                className={`${visibilityClass} h-[168px] w-full max-w-[109px] flex-col items-center justify-between gap-[var(--spacing-space-12)] rounded-[var(--radius-16)] bg-background-primary px-[var(--spacing-space-0)] py-[14px] md:h-[158px] md:max-w-[164px] md:px-[var(--spacing-space-0)] lg:h-[179px] lg:max-w-[243px] lg:px-[var(--spacing-space-20)]`}
              >
                {/* Image */}
                <div className="relative flex min-h-0 w-full max-w-[170px] flex-1 items-center justify-center">
                  <Image
                    src={item.image}
                    alt={t(item.key)}
                    fill
                    sizes="(max-width: 767px) 30vw, (max-width: 1023px) 22vw, 170px"
                    className="object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.opacity = "0";
                    }}
                  />
                </div>

                {/* Text */}
                <div className="flex h-[43px] w-full max-w-[203px] shrink-0 flex-col items-center justify-center gap-[var(--spacing-space-4)]">
                  <span className="w-full truncate text-center font-sans text-[18px] font-medium leading-[1.4] text-text-primary">
                    {t(item.key)}
                  </span>
                  <span className="w-full truncate text-center font-sans text-[13px] font-medium leading-[1.1] text-text-secondary">
                    {t("carsCount", { count: item.count })}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* "See more" / "See less" Button: visible on Mobile & Tablet only */}
        <div className="mt-[var(--spacing-space-16)] flex justify-center md:mt-0 lg:hidden">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex h-[var(--spacing-dim-40)] items-center justify-center rounded-[var(--radius-999)] border border-border-default bg-background-primary px-[var(--spacing-space-24)] font-sans text-[length:var(--text-body-small)] font-medium text-text-primary transition hover:bg-background-secondary active:scale-95"
          >
            {isExpanded ? t("seeLess") : t("seeMore")}
          </button>
        </div>
      </section>
    </LayoutWrapper>
  );
}
