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
      <section className="w-full">
        {/* Title */}
        <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-text-primary md:text-[32px]">
          {t("title")}
        </h2>

        {/* Grid: 2 cols (mobile) -> 4 cols (tablet) -> 5 cols (desktop) */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 justify-items-center">
          {CATEGORIES.map((item, index) => {
            // Responsive breakdown:
            // Mobile (< 768px): shows 6 items (index 0 to 5)
            // Tablet (768px - 1024px): shows 8 items (index 0 to 7)
            // Desktop (1024px+): shows all 10 items
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
                className={`${visibilityClass} h-[179px] w-full max-w-[243px] flex-col items-center justify-between rounded-[16px] border border-[var(--Border-Default,#CCD0D8)] bg-white px-[20px] py-[14px] transition-all hover:border-text-primary hover:shadow-xs active:scale-[0.98]`}
              >
                {/* Image */}
                <div className="relative flex aspect-[170/96] w-full max-w-[170px] shrink-0 items-center justify-center">
                  <Image
                    src={item.image}
                    alt={t(item.key)}
                    fill
                    sizes="(max-width: 639px) 40vw, (max-width: 1023px) 20vw, 170px"
                    className="object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.opacity = "0";
                    }}
                  />
                </div>

                {/* Text */}
                <div className="flex h-[43px] w-[203px] max-w-full flex-col items-center justify-center gap-1">
                  <span className="w-full truncate text-center text-[18px] font-medium leading-[1.4] text-text-primary">
                    {t(item.key)}
                  </span>
                  <span className="w-full truncate text-center text-[13px] font-medium leading-[1.1] text-text-secondary">
                    {t("carsCount", { count: item.count })}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* "See more" / "See less" Button: visible on Mobile & Tablet only */}
        <div className="mt-8 flex justify-center lg:hidden">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex h-[40px] items-center justify-center rounded-full border border-[var(--Border-Default,#CCD0D8)] bg-white px-6 text-sm font-medium text-text-primary transition hover:bg-neutral-50 active:scale-95"
          >
            {isExpanded ? t("seeLess") : t("seeMore")}
          </button>
        </div>
      </section>
    </LayoutWrapper>
  );
}
