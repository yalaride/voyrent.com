"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

export interface PopularCityItem {
  slug: string;
  name: string;
  href: string;
  image?: string;
  carCount?: number;
}

interface PopularCitiesSliderProps {
  countryName: string;
  cities: PopularCityItem[];
  /** Optional fallback subtitle when carCount is not provided */
  fallbackSubtitle?: string;
}

const DEFAULT_CARD_WIDTH = 311;
const CARD_GAP = 12;

export function PopularCitiesSlider({
  countryName,
  cities,
  fallbackSubtitle,
}: PopularCitiesSliderProps) {
  const t = useTranslations("Cities");
  const headingId = useId();
  const trackRef = useRef<HTMLUListElement>(null);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const currentScroll = Math.abs(el.scrollLeft);

    setCanScrollPrev(currentScroll > 2);
    setCanScrollNext(maxScroll > 2 && currentScroll < maxScroll - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    updateScrollButtons();

    if (!el) return;

    const observer = new ResizeObserver(() => updateScrollButtons());
    observer.observe(el);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [cities.length, updateScrollButtons]);

  if (cities.length === 0) {
    return null;
  }

  const handleScroll = (direction: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;

    const firstCard = el.querySelector("li");
    const cardWidth = firstCard
      ? firstCard.getBoundingClientRect().width
      : DEFAULT_CARD_WIDTH;
    const isRtl = getComputedStyle(el).direction === "rtl";
    const step = cardWidth + CARD_GAP;
    const delta = (direction === "next" ? 1 : -1) * (isRtl ? -step : step);

    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <LayoutWrapper>
      <section aria-labelledby={headingId} className="mt-10 w-full">
        {/* Header Row: 30px height on mobile, 43px on tablet+ */}
        <div className="flex min-h-[30px] items-center justify-between gap-4 sm:min-h-[43px]">
          <h2
            id={headingId}
            className="text-[24px] font-semibold leading-[1.26] text-text-primary ltr:tracking-[-0.02em] sm:text-[36px] sm:leading-[1.2]"
          >
            {t("sliderTitle", { country: countryName })}
          </h2>

          {/* Slider Controls: removed on mobile & tablet, visible on desktop (lg+) */}
          <div className="hidden shrink-0 items-center gap-[var(--spacing-space-6)] lg:flex">
            <button
              type="button"
              onClick={() => handleScroll("prev")}
              disabled={!canScrollPrev}
              aria-label={t("previousSlide")}
              className="flex h-[var(--spacing-dim-40)] w-[var(--spacing-dim-40)] items-center justify-center rounded-[var(--radius-999)] border border-border-default bg-background-primary text-text-primary transition-colors hover:border-text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeftIcon className="size-4 rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("next")}
              disabled={!canScrollNext}
              aria-label={t("nextSlide")}
              className="flex h-[var(--spacing-dim-40)] w-[var(--spacing-dim-40)] items-center justify-center rounded-[var(--radius-999)] border border-border-default bg-background-primary text-text-primary transition-colors hover:border-text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRightIcon className="size-4 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Slider Track: 311x200 cards, gap 12px, touch scroll on mobile & tablet */}
        <ul
          ref={trackRef}
          onScroll={updateScrollButtons}
          className="-me-4 mt-4 flex h-[200px] touch-pan-x snap-x snap-mandatory gap-[var(--spacing-space-12)] overflow-x-auto scroll-smooth pe-4 [scrollbar-width:none] sm:-me-5 sm:pe-5 lg:me-0 lg:pe-0 [&::-webkit-scrollbar]:hidden"
        >
          {cities.map((city) => (
            <li
              key={city.slug}
              className="h-[200px] w-[311px] shrink-0 snap-start lg:w-[calc((100%-36px)/4)]"
            >
              <Link
                href={city.href}
                className="group relative flex h-full w-full flex-col justify-end overflow-hidden rounded-[var(--radius-16)] bg-background-section p-[var(--spacing-space-20)]"
              >
                {city.image ? (
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    sizes="(max-width: 1023px) 311px, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : null}

                {/* Gradient overlay: 180deg, transparent 50% -> #000000 100% */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_50%,#000000_100%)]"
                />

                {/* Card Text Block: 271px width, 25px title height */}
                <div className="relative z-10 flex w-full max-w-[271px] flex-col gap-0">
                  <span className="h-[25px] truncate text-[20px] font-semibold leading-[1.26] text-text-inverse ltr:tracking-[-0.02em]">
                    {city.name}
                  </span>
                  <span className="h-[25px] truncate text-[16px] font-normal leading-[1.5] tracking-[0] text-text-inverse">
                    {typeof city.carCount === "number"
                      ? t("carsAvailable", { count: city.carCount })
                      : (fallbackSubtitle ?? countryName)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </LayoutWrapper>
  );
}
